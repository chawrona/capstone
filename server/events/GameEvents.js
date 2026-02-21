import LobbyDoesNotExistError from "../errors/LobbyDoesNotExistError.js";
import UserDoesNotExistError from "../errors/UserDoesNotExistError.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmmiter from "../services/EventEmmiter.js";

export default class GameEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
        this.eventEmmiter = new EventEmmiter();
    }

    registerEvents() {
        this.socket.on("gameData", (payload) => this.onGameData(payload));
    }

    onGameData({ userId, data }) {
        try {
            const user = this.userManager.getUser(userId);
            const lobby = this.lobbyManager.getLobby(user.lobbyId);

            if (!lobby.isActive) {
                return this.eventEmmiter.toLobby(lobby.id, "lobby", lobby.id);
            }

            const targets = lobby.game.processGameData({
                ...data,
                publicId: user.publicId,
            });

            if (!targets) return;

            for (const { target, eventName, data } of targets) {
                if (target === "lobby") {
                    this.eventEmmiter.toLobby(user.lobbyId, eventName, data);
                } else if (eventName === "error") {
                    this.eventEmmiter.toPublicUserError(target, data);
                } else {
                    this.eventEmmiter.toPublicUser(target, eventName, data);
                }
            }
        } catch (error) {
            if (error instanceof UserDoesNotExistError) return;
            if (error instanceof LobbyDoesNotExistError) return;
            this.eventEmmiter.toUserError(userId, error);
        }
    }
}
