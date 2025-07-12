import EventEmmiter from "../services/EventEmmiter.js";

export default class ConnectionEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
    }
    registerEvents() {
        this.socket.on("authorization", this.authorization);
        this.socket.on("disconnect", this.disconnect);
        this.socket.on("connect", this.connect);
    }
    authorization() {
        console.log("authorized");
    }
    disconnect() {
        console.log("disconnected");
    }
    connect() {
        const ee = new EventEmmiter();
        ee.toAll("connect", "connected");
    }
}
