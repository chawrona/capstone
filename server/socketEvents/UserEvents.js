import UserHandler from "../handlers/UserHandler.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmmiter from "../services/EventEmmiter.js";

export default class UserEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
        this.eventEmmiter = new EventEmmiter();
        this.userHandler = new UserHandler();
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
            this.userHandler.updateUserSocketId(userId, this.socket.id);
            const user = this.userManager.getUser(userId);
            if (user.hasLobby()) {
                this.socket.join(user.lobbyId);
                this.eventEmmiter.toUser(userId, "brianboru");
            } else {
                this.isLobbyIdGiven(userId, lobbyId);
            }
        } else {
            this.userHandler.addUser(userId, this.socket.id);
            this.isLobbyIdGiven(userId, lobbyId);
        }
    }

    isLobbyIdGiven(userId, lobbyId) {
        console.log(`User o id: ${userId}. Podał lobbyId: ${lobbyId}`);
        if (lobbyId) {
            const lobby = this.lobbyManager.getLobby(lobbyId);
            if (lobby && lobby.joinUser(userId)) {
                const user = this.userManager.getUser(userId);
                user.lobbyId = lobbyId;
                this.socket.join(user.lobbyId);
                this.eventEmmiter.toUser(userId, "lobby");
            } else {
                this.eventEmmiter.toUser(userId, "homepage", {
                    errorMessage: "Lobby nie istnieje",
                });
            }
        } else {
            this.eventEmmiter.toUser(userId, "homepage");
        }
    }

    onDisconnect() {
        const { userId } = this.socket.data;
        const user = this.userManager.getUser(userId);
        const lobby = this.lobbyManager.getLobby(user.lobbyId);

        if (lobby) {
            lobby.users.delete(userId);
            if (lobby.users.size <= 0) {
                this.lobbyManager.deleteLobby(lobby.id);
            }
        }

        user.lobbyId = null;
    }
}
