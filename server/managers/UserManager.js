import User from "../models/User.js";
export default class UserManager {
    constructor() {
        if (UserManager.instance) {
            return UserManager.instance;
        }
        UserManager.instance = this;
        this.users = new Map();
    }
    createUser() {
        const user = new User();
        this.users.set(user.uuid, user);
    }
    deleteUser(uuid) {
        return this.users.delete(uuid);
    }
    getUser(uuid) {
        this.users.get(uuid);
    }
    doesUserExist(uuid){
        return this.users.has(uuid);
    }
}
