import colors from "../config/colors.json" with { type: "json" };
import UserDoesNotExistError from "../errors/UserDoesNotExistError.js";
import ColorDoesNotExistError from "../errors/ColorDoesNotExistError.js";
import ColorDuplicatedError from "../errors/ColorDuplicatedError.js";
import UserOnlineError from "../errors/UserOnlineError.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmmiter from "../services/EventEmmiter.js";
import generateUUID from "../utils/generateUuid.js";
import EventHelper from "./EventHelper.js";

export default class UserEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
        this.eventEmmiter = new EventEmmiter();
        this.eventHelper = new EventHelper();
        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
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
            this.socket.data.userId = userId;

            if (!redirectRequest.data) return;
            const lobbyId = redirectRequest.data.lobbyId;
            let username = redirectRequest.data.username;

            if (this.userManager.doesUserExist(userId)) {
                this.userManager.updateUserSocketId(userId, this.socket.id);
                const user = this.userManager.getUser(userId);
                if (user.isOnline) throw new UserOnlineError();
                if (user.hasLobby()) {
                    const lobby = this.lobbyManager.getLobby(user.lobbyId);
                    this.socket.join(user.lobbyId);
                    this.eventEmmiter.toUser(userId, "game", {
                        gameTitle: lobby.gameInfo.title,
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
        } catch (error) {
            if (error instanceof UserOnlineError) {
                this.eventEmmiter.toUser(
                    redirectRequest.userId,
                    "userIdChangeRequest",
                    generateUUID(),
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
            const isColorTaken = [...lobby.users]
                .map((userId) => {
                    return this.userManager.getUser(userId);
                })
                .some((user) => {
                    return user.color.name === newColor.name;
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

            user.name = newUsername.trim();

            this.eventHelper.sendLobbyData(user.lobbyId);
        } catch (error) {
            this.eventEmmiter.toUserError(userId, error);
        }
    }

    onToggleReady({ userId }) {
        try {
            const user = this.userManager.getUser(userId);
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
        const { userId } = this.socket.data;
        try {
            const user = this.userManager.getUser(userId);
            const lobby = this.lobbyManager.getLobby(user.lobbyId);

            if (lobby) {
                lobby.removeUser(userId);

                if (!lobby.getPlayerCount()) {
                    this.lobbyManager.deleteLobby(lobby.id);
                } else if (lobby.isAdmin) {
                    lobby.admin = [...lobby.users][0];
                    this.eventHelper.sendLobbyData(lobby.id);
                }

                this.socket.leave(lobby.id);
            }

            user.lobbyId = null;
            user.isReady = false;
            user.isOnline = false;
        } catch (error) {
            this.eventEmmiter.toUserError(userId, error);
        }
    }
}
