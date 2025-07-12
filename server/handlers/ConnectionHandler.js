import UserManager from "../managers/UserManager.js";

export default class ConnectionHandler {
    constructor() {
        if (ConnectionHandler.instance) {
            return ConnectionHandler.instance;
        }
        this.uuidToSocketId = new Map();
        // this.socketIdToUuid = new Map();

        ConnectionHandler.instance = this;
    }

    doesUserExist(uuid) {
        return this.uuidToSocketId.has(uuid);
    }

    addUser(socketId) {
        const userManager = new UserManager();
        const uuid = userManager.createUser();
        this.uuidToSocketId.set(uuid, socketId);
        // this.socketIdToUuid.set(socketId, uuid);
    }

    deleteUser(uuid) {
        return this.uuidToSocketId.delete(uuid);
    }

    getUserSocketId(userId) {
        return this.uuidToSocketId.get(userId);
    }
}
