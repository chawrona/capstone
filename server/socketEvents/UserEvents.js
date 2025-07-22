import UserHandler from "../handlers/UserHandler.js";
import LobbyHandler from "../handlers/LobbyHandler.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmmiter from "../services/EventEmmiter.js";

export default class UserEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
    }
    registerEvents() {
        this.socket.on("authorization", this.onInitialRequest);
        this.socket.on("disconnect", this.onDisconnect);
        this.socket.on("connection", this.onConnect);
    }
    onInitialRequest(redirectRequest) {
        const userId = redirectRequest.userId;
        const lobbyId = redirectRequest.data.lobbyId;
        const userManager = new UserManager();
        if (userManager.doesUserExist(userId)) {
            const lobbyHandler = new LobbyHandler();
            if (lobbyHandler.doesUserHaveLobby()) {
                const ee = new EventEmmiter();
                const userHandler = new UserHandler();
                const socketId = userHandler.getUserSocketId(userId);
                ee.toUser(socketId, "brianboru");
            } else {
                this.isLobbyIdGiven(userId, lobbyId);
            }
        } else {
            userManager.createUser();
            this.isLobbyIdGiven(userId, lobbyId);
        }
    }
    onDisconnect() {
        console.log("disconnected");
    }
    onConnect() {
        console.log("Połączono");
        // const ee = new EventEmmiter();
        // ee.toAll("connect", "connected");
    }
    isLobbyIdGiven(userId, lobbyId) {
        const ee = new EventEmmiter();
        const userHandler = new UserHandler();
        const socketId = userHandler.getUserSocketId(userId);
        if (lobbyId) {
            const lobbyManager = new LobbyManager();
            if (lobbyManager.canJoinLobby(lobbyId)) {
                ee.toUser(socketId, "lobby");
            } else {
                ee.toUser(socketId, "homepage", { error: "500" });
            }
        } else {
            ee.toUser(socketId, "homepage");
        }
    }
}
