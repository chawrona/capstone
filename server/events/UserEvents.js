import ColorDoesNotExistError from "../errors/ColorDoesNotExistError.js";
import ColorDuplicatedError from "../errors/ColorDuplicatedError.js";
import UserDoesNotExistError from "../errors/UserDoesNotExistError.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmitter from "../services/EventEmitter.js";
import EventHelper from "../services/EventHelper.js";
import Logger from "../services/Logger.js";
import parseCookie from "../utils/parseCookie.js";

export default class UserEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
        this.eventEmitter = new EventEmitter();
        this.eventHelper = new EventHelper();
        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
        this.logger = new Logger();
    }

    registerEvents() {
        this.socket.on("toggleReady", (payload) => this.onToggleReady(payload));
        this.socket.on("changeUserColor", (payload) => {
            this.onChangeUserColor(payload);
        });
        this.socket.on("changeUsername", (payload) => {
            this.onChangeUsername(payload);
        });
        this.socket.on("disconnect", () => this.onDisconnect());
    }

    onChangeUserColor({ data: { newColor } }) {
        const userId = parseCookie(
            this.socket.handshake.headers.cookie,
            "userId",
        );
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
            if (
                !lobby.gameInfo.colors.some(
                    (color) => color.name === newColor.name,
                )
            ) {
                throw new ColorDoesNotExistError();
            }
            user.color = newColor;
            this.eventHelper.sendLobbyData(user.lobbyId);
        } catch (error) {
            this.eventEmitter.toUserError(userId, error);
        }
    }

    onChangeUsername({ data: { newUsername } }) {
        const userId = parseCookie(
            this.socket.handshake.headers.cookie,
            "userId",
        );
        try {
            this.eventHelper.validateUsername(newUsername);

            const user = this.userManager.getUser(userId);

            this.eventHelper.checkIfLobbyActive(user.lobbyId);

            user.name = newUsername.trim();

            this.eventHelper.sendLobbyData(user.lobbyId);
            this.eventEmitter.toUser(userId, "usernameChanged", user.name);
        } catch (error) {
            this.eventEmitter.toUserError(userId, error);
            this.eventEmitter.toUser(userId, "usernameChangedError");
        }
    }

    onToggleReady() {
        const userId = parseCookie(
            this.socket.handshake.headers.cookie,
            "userId",
        );
        try {
            const user = this.userManager.getUser(userId);

            this.eventHelper.checkIfLobbyActive(user.lobbyId);

            user.isReady = !user.isReady;
            this.eventHelper.sendLobbyData(user.lobbyId);
        } catch (error) {
            if (error instanceof UserDoesNotExistError) {
                this.eventEmitter.toUser(userId, "homepage", {
                    error: `Użytkownik o ID ${userId} nie istnieje.`,
                });
            } else {
                this.eventEmitter.toUserError(userId, error);
            }
        }
    }

    onDisconnect() {
        const userId = parseCookie(
            this.socket.handshake.headers.cookie,
            "userId",
        );
        try {
            const user = this.userManager.getUser(userId);

            if (user.hasLobby()) {
                const lobby = this.lobbyManager.getLobby(user.lobbyId);
                if (!lobby.isActive) {
                    lobby.removeUser(userId);
                    user.lobbyId = null;
                    if (!lobby.getPlayerCount()) {
                        this.lobbyManager.deleteLobby(lobby.id);
                    } else if (lobby.isAdmin) {
                        lobby.admin = [...lobby.users][0];
                        this.eventHelper.sendLobbyData(lobby.id);
                    }

                    this.userManager.deleteUser(userId);
                } else {
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
