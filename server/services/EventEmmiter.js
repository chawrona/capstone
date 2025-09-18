import UserManager from "../managers/UserManager.js";
import Logger from "./Logger.js";

export default class EventEmmiter {
    constructor(io) {
        if (EventEmmiter.instance) {
            return EventEmmiter.instance;
        }
        this.io = io;
        EventEmmiter.instance = this;

        this.userManager = new UserManager();
        this.logger = new Logger();
    }

    toUser(userId, eventName, data) {
        const socketId = this.userManager.getUserSocketId(userId);
        this.io.to(socketId).emit(eventName, data);
    }

    toUserError(userId, error) {
        if (userId) {
            this.toUser(userId, "error", {
                error: error.message,
            });
        }
        console.log(error);
        this.logger.error(error.message);
    }

    toRoom(roomId, eventName, data) {
        this.io.to(roomId).emit(eventName, data);
    }

    toAll(eventName, data) {
        this.io.emit(eventName, data);
    }
    toPublicUser(targets){
        for(const target of targets){
            if(target === "lobby"){
                const lobby = data.lobby;
                const lobbyId = lobby.id;
                this.toRoom(lobbyId, eventName, data);
            }else if(target != null){
                const userId = this.userManager.getUserIdByPublicId(data.publicId);
                toUser(userId, eventName, data);
            }
        }
    }
}
