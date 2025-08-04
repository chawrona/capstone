import UserManager from "../managers/UserManager.js";

export default class UserHandler {
    constructor() {
        if (UserHandler.instance) {
            return UserHandler.instance;
        }
        this.userIdToSocketId = new Map();

        this.userManager = new UserManager();

        UserHandler.instance = this;
    }

    doesUserExist(userId) {
        return this.userIdToSocketId.has(userId);
    }

    addUser(userId, socketId) {
        this.userManager.createUser(userId);
        this.userIdToSocketId.set(userId, socketId);
    }

    deleteUser(userId) {
        return this.userIdToSocketId.delete(userId);
    }

    getUserSocketId(userId) {
        return this.userIdToSocketId.get(userId);
    }
}
