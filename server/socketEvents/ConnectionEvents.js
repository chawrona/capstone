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
    authorization() {
        console.log("authorized");
        const ee = new EventEmmiter();
        ee.toAll("abc", "connected");
    }
    disconnect() {
        console.log("disconnected");
    }
    connect() {
        console.log("Połączono");
        // const ee = new EventEmmiter();
        // ee.toAll("connect", "connected");
    }
}
