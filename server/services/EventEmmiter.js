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
        this.logger.error(error.message);
    }

    toLobby(lobbyId, eventName, data) {
        this.io.to(lobbyId).emit(eventName, data);
    }

    toLobbyError(lobbyId, error) {
        if (lobbyId) {
            this.toLobby(lobbyId, "error", {
                error: error.message,
            });
        }
        this.logger.error(error.message);
    }

    toAll(eventName, data) {
        this.io.emit(eventName, data);
    }

    toPublicUser(publicId, eventName, data) {
        const userId = this.userManager.getUserIdByPublicId(publicId);
        this.toUser(userId, eventName, data);
    }

    toPublicUserError(publicId, error) {
        const userId = this.userManager.getUserIdByPublicId(publicId);
        this.toUserError(userId, error);
    }
}
