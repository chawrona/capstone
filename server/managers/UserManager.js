import User from "../models/User.js";
export default class UserManager {
    constructor() {
        if (UserManager.instance) {
            return UserManager.instance;
        }
        UserManager.instance = this;
        this.users = new Map();
    }

    createUser(userId) {
        const user = new User(userId);
        this.users.set(user.id, user);
    }

    deleteUser(userId) {
        return this.users.delete(userId);
    }

    getUser(userId) {
        this.users.get(userId);
    }

    doesUserExist(userId) {
        return this.users.has(userId);
    }
}
