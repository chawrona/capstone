import UserManager from "../managers/UserManager.js";

export default class UserHandler {
    constructor() {
        if (UserHandler.instance) {
            return UserHandler.instance;
        }
        this.userIdToSocketId = new Map();

        UserHandler.instance = this;
    }

    doesUserExist(userId) {
        return this.userIdToSocketId.has(userId);
    }

    addUser(socketId) {
        const userManager = new UserManager();
        const userId = userManager.createUser();
        this.userIdToSocketId.set(userId, socketId);
    }

    deleteUser(userId) {
        return this.userIdToSocketId.delete(userId);
    }

    getUserSocketId(userId) {
        return this.userIdToSocketId.get(userId);
    }
}
