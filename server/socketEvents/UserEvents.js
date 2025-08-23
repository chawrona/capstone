import LobbyDoesNotExistError from "../errors/LobbyDoesNotExistError.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmmiter from "../services/EventEmmiter.js";

export default class UserEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
        this.eventEmmiter = new EventEmmiter();

        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
    }

    registerEvents() {
        this.socket.on("initialRequest", (redirectRequest) =>
            this.onInitialRequest(redirectRequest),
        );
        this.socket.on("disconnect", () => this.onDisconnect());
    }

    onInitialRequest(redirectRequest) {
        const userId = redirectRequest.userId;
        this.socket.data.userId = userId;

        if (!redirectRequest.data) return;
        const lobbyId = redirectRequest.data.lobbyId;

        if (this.userManager.doesUserExist(userId)) {
            this.userManager.updateUserSocketId(userId, this.socket.id);
            const user = this.userManager.getUser(userId);
            if (user.hasLobby()) {
                this.socket.join(user.lobbyId);
                this.eventEmmiter.toUser(userId, "brianboru");
            } else {
                this.isLobbyIdGiven(userId, lobbyId);
            }
        } else {
            this.userManager.createUser(userId, this.socket.id);
            this.isLobbyIdGiven(userId, lobbyId);
        }
    }

    isLobbyIdGiven(userId, lobbyId) {
        try {
            if (!lobbyId) {
                return this.eventEmmiter.toUser(userId, "homepage");
            }

            const lobby = this.lobbyManager.getLobby(lobbyId);

            if (!lobby) {
                throw new LobbyDoesNotExistError(
                    `Pokój #${lobbyId} nie istnieje.`,
                );
            }

            lobby.joinUser(userId);
            const user = this.userManager.getUser(userId);
            user.lobbyId = lobbyId;
            this.socket.join(user.lobbyId);
            this.eventEmmiter.toUser(userId, "lobby");
        } catch (error) {
            if (error instanceof LobbyDoesNotExistError) {
                this.eventEmmiter.toUser(userId, "homepage", {
                    error: error.message,
                });
            } else {
                this.eventEmmiter.toUserError(userId, error);
            }
        }
    }

    onDisconnect() {
        const { userId } = this.socket.data;
        const user = this.userManager.getUser(userId);
        const lobby = this.lobbyManager.getLobby(user.lobbyId);

        if (lobby) {
            lobby.removeUser(userId);

            if (!lobby.getPlayerCount()) {
                this.lobbyManager.deleteLobby(lobby.id);
            }
        }

        user.lobbyId = null;
    }
}
