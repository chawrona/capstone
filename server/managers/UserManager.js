import User from "../models/User.js";
export default class UserManager {
    constructor() {
        if (UserManager.instance) {
            return UserManager.instance;
        }
        UserManager.instance = this;
        this.users = new Map();
        this.userIdToSocketId = new Map();
    }

    createUser(userId, socketId) {
        const user = new User(userId);
        this.users.set(user.id, user);
        this.updateUserSocketId(userId, socketId);
    }

    getUser(userId) {
        return this.users.get(userId);
    }

    getUserSocketId(userId) {
        return this.userIdToSocketId.get(userId);
    }

    doesUserExist(userId) {
        return this.users.has(userId);
    }

    updateUserSocketId(userId, socketId) {
        this.userIdToSocketId.set(userId, socketId);
    }

    deleteUser(userId) {
        this.userIdToSocketId.delete(userId);
        this.users.delete(userId);
    }
}
