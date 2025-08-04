import LobbyManager from "../handlers/LobbyManager.js";

export default class ConnectionManager {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
        this.lobbyManager = new LobbyManager();
    }

    registerEvents() {
        this.socket.on("create", this.onCreate);
        this.socket.on("join", this.onJoin);
        this.socket.on("leave", this.onLeave);
        this.socket.on("start", this.GameStart);
    }

    onCreate() {
        console.log("create");
    }

    onJoin() {
        console.log("join");
    }

    onLeave(lobbyId) {
        console.log("leave");
        console.log(lobbyId);
    }
    GameStart(payload){
        const userId = payload.userId;
        const lobby = this.lobbyManager.getLobby(userId);
        lobby.start();
    }
}
