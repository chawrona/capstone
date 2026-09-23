import LobbyDoesNotExistError from "../errors/LobbyDoesNotExistError.js";
import UserDoesNotExistError from "../errors/UserDoesNotExistError.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmitter from "../services/EventEmitter.js";
import EventHelper from "../services/EventHelper.js";
import parseCookie from "../utils/parseCookie.js";

export default class GameEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
        this.eventHelper = new EventHelper();
        this.eventEmitter = new EventEmitter();
    }

    registerEvents() {
        this.socket.on("gameData", (payload) => this.onGameData(payload));
        this.socket.on("gamePauseStatusRequest", (payload) =>
            this.onGamePauseStatusRequest(payload),
        );
        this.socket.on("toggleGamePause", (payload) =>
            this.onToggleGamePause(payload),
        );
    }

    onGamePauseStatusRequest() {
        const userId = parseCookie(
            this.socket.handshake.headers.cookie,
            "userId",
        );
        try {
            const user = this.userManager.getUser(userId);
            const lobby = this.lobbyManager.getLobby(user.lobbyId);

            if (!lobby.isActive) {
                return this.eventEmitter.toLobby(lobby.id, "lobby", lobby.id);
            }

            return this.eventEmitter.toUser(
                userId,
                "pauseStatus",
                lobby.game.paused,
            );
        } catch (error) {
            if (error instanceof UserDoesNotExistError) return;
            if (error instanceof LobbyDoesNotExistError) {
                return this.eventEmitter.toUser(userId, "homepage", {
                    error: "Pokój nie istnieje.",
                });
            }
            this.eventEmitter.toUserError(userId, error);
        }
    }

    onToggleGamePause() {
        const userId = parseCookie(
            this.socket.handshake.headers.cookie,
            "userId",
        );

        try {
            const user = this.userManager.getUser(userId);
            const lobby = this.lobbyManager.getLobby(user.lobbyId);

            if (!lobby.isActive) {
                this.eventEmitter.toLobby(lobby.id, "lobby", lobby.id);
            }

            lobby.game.toggleGamePause();

            return this.eventEmitter.toLobby(
                lobby.id,
                "pauseStatus",
                lobby.game.paused,
            );
        } catch (error) {
            if (error instanceof UserDoesNotExistError) return;
            if (error instanceof LobbyDoesNotExistError) {
                return this.eventEmitter.toUser(userId, "homepage", {
                    error: "Pokój nie istnieje.",
                });
            }
            this.eventEmitter.toUserError(userId, error);
        }
    }

    onGameData(data) {
        const userId = parseCookie(
            this.socket.handshake.headers.cookie,
            "userId",
        );
        try {
            const user = this.userManager.getUser(userId);
            const lobby = this.lobbyManager.getLobby(user.lobbyId);

            if (!lobby.isActive) {
                return this.eventEmitter.toLobby(lobby.id, "lobby", lobby.id);
            }

            const targets = lobby.game.processGameData({
                ...data,
                publicId: user.publicId,
            });

            if (!targets) return;

            for (const { target, eventName, data } of targets) {
                if (target === "lobby") {
                    console.log("EVENT", { target, eventName, data });
                    this.eventEmitter.toLobby(user.lobbyId, eventName, data);
                } else if (eventName === "error") {
                    this.eventEmitter.toPublicUserError(target, data);
                } else {
                    this.eventEmitter.toPublicUser(target, eventName, data);
                }
            }
        } catch (error) {
            if (error instanceof UserDoesNotExistError) return;
            if (error instanceof LobbyDoesNotExistError) {
                return this.eventEmitter.toUser(userId, "homepage", {
                    error: "Pokój nie istnieje.",
                });
            }
            this.eventEmitter.toUserError(userId, error);
        }
    }
}
