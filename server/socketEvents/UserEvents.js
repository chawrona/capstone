import UserHandler from "../handlers/UserHandler.js";
import LobbyHandler from "../handlers/LobbyHandler.js";
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
        this.socket.on("initalRequest", this.onInitalRequest);
        this.socket.on("disconnect", this.disconnect);
        this.socket.on("connection", this.connect);
    }
    onInitalRequest(redirectRequest) {
        const userId = redirectRequest.userId;
        const lobbyId = redirectRequest.data.lobbyId;
        if (userManager.doesUserExist(userId)) {
            const lobbyHandler = new LobbyHandler();
            if (lobbyHandler.doesUserHaveLobby()) {
                const socketId = this.userHandler.getUserSocketId(userId);
                this.eventEmmiter.toUser(socketId, "brianboru");
            } else {
                this.isLobbyIdGiven(userId, lobbyId);
            }
        } else {
            this.userHandler.addUser(userId, this.socket.id)
            this.isLobbyIdGiven(userId, lobbyId);
        }
    }
    disconnect() {
        console.log("disconnected");
    }
    connect() {
        console.log("Połączono");
    }
    isLobbyIdGiven(userId, lobbyId) {
        const socketId = this.userHandler.getUserSocketId(userId);
        if (lobbyId) {
            if (this.lobbyManager.canJoinLobby(lobbyId)) {
                this.eventEmmiter.toUser(socketId, "lobby");
            } else {
                this.eventEmmiter.toUser(socketId, "homepage", { error: "500" });
            }
        } else {
            this.eventEmmiter.toUser(socketId, "homepage");
        }
    }
}