export default class ConnectionManager {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
    }
    registerEvents() {
        this.socket.on("create", this.onCreate);
        this.socket.on("join", this.onJoin);
        this.socket.on("leave", this.onLeave);
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
}