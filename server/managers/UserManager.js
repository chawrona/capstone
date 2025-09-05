import User from "../models/User.js";

export default class UserManager {
    constructor() {
        if (UserManager.instance) {
            return UserManager.instance;
        }
        UserManager.instance = this;
        this.users = new Map();
        this.userIdToSocketId = new Map();
        this.publicIdToId = new Map();
    }

    createUser(userId, socketId, username) {
        const user = new User(userId, username);
        this.users.set(userId, user);
        this.publicIdToId.set(user.publicId, userId);
        this.updateUserSocketId(userId, socketId);
    }

    getUser(userId) {
        return this.users.get(userId);
    }

    getUserByPublicId(publicId) {
        const userId = this.publicIdToId.get(publicId);
        if (!userId) return null;
        return this.users.get(userId);
    }

    getUserIdByPublicId(publicId) {
        return this.publicIdToId.get(publicId);
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
        const user = this.users.get(userId);
        if (user) {
            this.publicIdToId.delete(user.publicId);
        }
        this.userIdToSocketId.delete(userId);
        this.users.delete(userId);
    }
}
