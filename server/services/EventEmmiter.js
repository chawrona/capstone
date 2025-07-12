export default class EventEmmiter {
    constructor(io) {
        if (EventEmmiter.instance) {
            return EventEmmiter.instance;
        }
        this.io = io;
        EventEmmiter.instance = this;
    }
    toUser(socketId, eventName, data) {
        this.io.to(socketId).emit(eventName, data);
    }

    toRoom(roomId, eventName, data) {
        this.io.to(roomId).emit(eventName, data);
    }
}
