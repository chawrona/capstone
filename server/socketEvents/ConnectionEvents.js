import ConnectionHandler from "../handlers/ConnectionHandler.js";
import LobbyHandler from "../handlers/LobbyHandler.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmmiter from "../services/EventEmmiter.js";

export default class ConnectionEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
    }
    registerEvents() {
        this.socket.on("authorization", this.authorization);
        this.socket.on("disconnect", this.disconnect);
        this.socket.on("connection", this.connect);
    }
    authorization(redirectRequest) {
        const userId = redirectRequest.UUID;
        const lobbyId = redirectRequest.data.lobbyId;
        const userManager = new UserManager();
        if (userManager.doesUserExist(userId)) {
            const lobbyHandler = new LobbyHandler();
            if (lobbyHandler.doesUserHaveLobby()) {
                const ee = new EventEmmiter();
                const connectionHandler = new ConnectionHandler();
                const socketId = connectionHandler.getUserSocketId(userId);
                ee.toUser(socketId, "brianboru");
            } else {
                this.isLobbyIdGiven(userId, lobbyId);
            }
        } else {
            userManager.createUser();
            this.isLobbyIdGiven(userId, lobbyId);
        }
    }
    disconnect() {
        console.log("disconnected");
    }
    connect() {
        console.log("Połączono");
        // const ee = new EventEmmiter();
        // ee.toAll("connect", "connected");
    }
    isLobbyIdGiven(userId, lobbyId) {
        const ee = new EventEmmiter();
        const connectionHandler = new ConnectionHandler();
        const socketId = connectionHandler.getUserSocketId(userId);
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
