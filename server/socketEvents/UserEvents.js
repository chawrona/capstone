import LobbyHandler from "../handlers/LobbyHandler.js";
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
        this.lobbyHandler = new LobbyHandler();
    }

    registerEvents() {
        this.socket.on("initalRequest", this.onInitalRequest);
        this.socket.on("disconnect", this.onDisconnect);
    }

    onInitalRequest(redirectRequest) {
        const userId = redirectRequest.userId;
        const lobbyId = redirectRequest.data.lobbyId;
        if (this.userManager.doesUserExist(userId)) {
            if (this.lobbyHandler.doesUserHaveLobby()) {
                // const socketId = this.userHandler.getUserSocketId(userId);
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
        console.log("disconnected");
    }
}
