export default class ConnectionManager {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
    }
    registerEvents() {
        this.socket.on("authorization", this.authorization);
        this.socket.on("disconnect", this.disconnect);
    }
    authorization() {
        console.log("authorization");
    }
    disconnect() {
        console.log("disconnected");
    }
}
