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
        this.socket.data.userId = this.socket.data;

        if (!redirectRequest.data) return;
        const lobbyId = redirectRequest.data.lobbyId;

        if (this.userManager.doesUserExist(userId)) {
            const user = this.userManager.getUser(userId);
            // if (user.hasLobby()) { czemu tego nie ma w userze?
            if (user.lobbyId){
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
        // const socketId = this.userHandler.getUserSocketId(userId);
        if (lobbyId) {
            if (this.lobbyManager.canJoinLobby(lobbyId)) {
                const user = this.userManager.getUser(userId);
                user.lobbyId = lobbyId;
                this.socket.join(lobbyId)
                this.eventEmmiter.toUser(userId, "lobby");
            } else {
                this.eventEmmiter.toUser(userId, "homepage", {
                    error: "500",
                });
            }
        } else {
            this.eventEmmiter.toUser(userId, "homepage");
        }
    }

    onDisconnect() {
        const { userId } = this.socket.data;

        if (!userId) return;

        // const lobby = this.lobbyManager.getLobby(userId); To chyba szuka lobby po id lobby a jak będzie chcialo wyszukac lobby po id uzytkownika to po prostu będzie szukalo po losowych dla siebie cyferkach no nie?

        const user = this.userManager.getUser(userId);

        if (user && user.lobbyId) {
            const lobby = this.lobbyManager.getLobby(user.lobbyId);
            if (lobby) {
                lobby.users.delete(userId);
                if (lobby.users.size <= 0) {
                    this.lobbyManager.deleteLobby(lobby.id);
                }
            }
        }
        
        if (user) user.lobbyId = null;
    }
}
