export default class ConnectionManager {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
    }
    registerEvents() {
        this.socket.on("create", this.create);
        this.socket.on("join", this.join);
        this.socket.on("leave", this.leave);
    }
    create() {
        console.log("create");
    }
    join() {
        console.log("join");
    }
    leave(UUID) {
        console.log("leave");
        console.log(UUID);
    }
}
