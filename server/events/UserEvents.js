import colors from "../config/colors.json" with { type: "json" };
import ColorDoesNotExistError from "../errors/ColorDoesNotExistError.js";
import ColorDuplicatedError from "../errors/ColorDuplicatedError.js";
import GameAbortedPlayerLeftError from "../errors/GameAbortedPlayerLeftError.js";
import UserDoesNotExistError from "../errors/UserDoesNotExistError.js";
import UserOnlineError from "../errors/UserOnlineError.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmmiter from "../services/EventEmmiter.js";
import Logger from "../services/Logger.js";
import EventHelper from "./EventHelper.js";

export default class UserEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
        this.eventEmmiter = new EventEmmiter();
        this.eventHelper = new EventHelper();
        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
        this.logger = new Logger();
    }

    registerEvents() {
        this.socket.on("initialRequest", (redirectRequest) =>
            this.onInitialRequest(redirectRequest),
        );

        this.socket.on("toggleReady", (payload) => this.onToggleReady(payload));
        this.socket.on("changeUserColor", (payload) => {
            this.onChangeUserColor(payload);
        });
        this.socket.on("changeUsername", (payload) => {
            this.onChangeUsername(payload);
        });
        this.socket.on("disconnect", () => this.onDisconnect());
    }

    onInitialRequest(redirectRequest) {
        try {
            const userId = redirectRequest.userId;

            if (!redirectRequest.data) return;
            const lobbyId = redirectRequest.data.lobbyId;
            let username = redirectRequest.data.username;

            if (this.userManager.doesUserExist(userId)) {
                const user = this.userManager.getUser(userId);

                if (user.isOnline) {
                    throw new UserOnlineError();
                }

                this.userManager.updateUserSocketId(userId, this.socket.id);
                user.isOnline = true;

                if (user.hasLobby()) {
                    const lobby = this.lobbyManager.getLobby(user.lobbyId);

                    if (this.userManager.hasTimeout(user.id)) {
                        this.userManager.clearTimeout(user.id);
                        if (lobby.game.resume(user.id)) {
                            this.eventEmmiter.toLobby(lobby.id, "resume");
                        }
                    }

                    this.socket.join(user.lobbyId);
                    this.eventEmmiter.toUser(userId, "game", {
                        gameTitle: lobby.gameInfo.title,
                        lobbyId: lobby.id,
                    });
                } else {
                    if (this.eventHelper.isLobbyIdGiven(userId, lobbyId)) {
                        this.socket.join(lobbyId);
                    }
                }
            } else {
                try {
                    !this.eventHelper.validateUsername(username);
                } catch {
                    username = null;
                }

                this.userManager.createUser(userId, this.socket.id, username);

                if (this.eventHelper.isLobbyIdGiven(userId, lobbyId)) {
                    this.socket.join(lobbyId);
                }
            }

            this.socket.data.userId = userId;
        } catch (error) {
            if (error instanceof UserOnlineError) {
                // Specyficzny przypadek, jak jesteście ciekaw to mnie spytajcie
                this.eventEmmiter.toLobbyError(
                    this.socket.id,
                    new Error("Aplikacja jest już otwarta w innej karcie"),
                );
            } else {
                this.eventEmmiter.toUserError(redirectRequest.userId, error);
            }
        }
    }

    onChangeUserColor({ userId, data: { newColor } }) {
        try {
            const user = this.userManager.getUser(userId);
            const lobby = this.lobbyManager.getLobby(user.lobbyId);

            this.eventHelper.checkIfLobbyActive(lobby);

            const isColorTaken = [...lobby.users]
                .map((userId) => {
                    return this.userManager.getUser(userId);
                })
                .some((user) => {
                    return user.color && user.color.name === newColor.name;
                });
            if (isColorTaken) throw new ColorDuplicatedError();
            if (!colors.some((color) => color.name === newColor.name)) {
                throw new ColorDoesNotExistError();
            }
            user.color = newColor;
            this.eventHelper.sendLobbyData(user.lobbyId);
        } catch (error) {
            this.eventEmmiter.toUserError(userId, error);
        }
    }

    onChangeUsername({ userId, data: { newUsername } }) {
        try {
            this.eventHelper.validateUsername(newUsername);

            const user = this.userManager.getUser(userId);

            this.eventHelper.checkIfLobbyActive(user.lobbyId);

            user.name = newUsername.trim();

            this.eventHelper.sendLobbyData(user.lobbyId);
            this.eventEmmiter.toUser(userId, "usernameChanged", user.name);
        } catch (error) {
            this.eventEmmiter.toUserError(userId, error);
            this.eventEmmiter.toUser(userId, "usernameChangedError");
        }
    }

    onToggleReady({ userId }) {
        try {
            const user = this.userManager.getUser(userId);

            this.eventHelper.checkIfLobbyActive(user.lobbyId);

            user.isReady = !user.isReady;
            this.eventHelper.sendLobbyData(user.lobbyId);
        } catch (error) {
            if (error instanceof UserDoesNotExistError) {
                this.eventEmmiter.toUser(userId, "homepage", {
                    error: `Użytkownik o ID ${userId} nie istnieje.`,
                });
            } else {
                this.eventEmmiter.toUserError(userId, error);
            }
        }
    }

    onDisconnect() {
        try {
            const { userId } = this.socket.data;
            const user = this.userManager.getUser(userId);

            if (user.hasLobby()) {
                const lobby = this.lobbyManager.getLobby(user.lobbyId);
                if (!lobby.isActive) {
                    lobby.removeUser(userId);

                    if (!lobby.getPlayerCount()) {
                        this.lobbyManager.deleteLobby(lobby.id);
                    } else if (lobby.isAdmin) {
                        lobby.admin = [...lobby.users][0];
                        this.eventHelper.sendLobbyData(lobby.id);
                    }

                    this.userManager.deleteUser(userId);
                } else {
                    lobby.game.pause(userId);
                    this.eventEmmiter.toLobby(lobby.id, "pause");
                    const timeoutId = setTimeout(
                        () => {
                            for (const lobbyUserId of [
                                ...lobby.game.disconnectedPlayers,
                            ]) {
                                this.userManager.clearTimeout(lobbyUserId);
                            }

                            for (const userId of lobby.users) {
                                const user = this.userManager.getUser(userId)
                                user.lobbyId = null;
                                user.isReady = false;
                            }

                            this.eventEmmiter.toLobby(lobby.id, "homepage");

                            this.eventEmmiter.toLobbyError(
                                lobby.id,
                                new GameAbortedPlayerLeftError(),
                            );

                            this.eventEmmiter.closeRoom(lobby.id)

                            this.lobbyManager.deleteLobby(lobby.id);
                            this.userManager.deleteUser(userId);
                        },
                        3 * 60 * 1000,
                    );
                    this.userManager.createTimeout(user.id, timeoutId);
                    user.isOnline = false;
                }
            } else {
                this.userManager.deleteUser(userId);
            }
        } catch (error) {
            this.logger.error(error.message);
        }
    }
}
