import UserHandler from "../handlers/UserHandler.js"

export default class EventEmmiter {
    constructor(io) {
        if (EventEmmiter.instance) {
            return EventEmmiter.instance;
        }
        this.io = io;
        EventEmmiter.instance = this;

    }

    toUser(userId, eventName, data) {
        const socketId = UserHandler.getUserSocketId(userId);
        this.io.to(socketId).emit(eventName, data);
    }

    toRoom(roomId, eventName, data) {
        this.io.to(roomId).emit(eventName, data);
    }

    toAll(eventName, data) {
        this.io.emit(eventName, data);
    }
}
