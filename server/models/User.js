import generateUsername from "../utils/generateUsername.js";
import generateUuid from "../utils/generateUuid.js";

export default class User {
    constructor(userId, username) {
        this.id = userId;
        this.publicId = generateUuid();
        this.lobbyId = null;
        this.isReady = false;
        this.isOnline = true;
        this.color = null;
        this.name = username || generateUsername();
    }

    hasLobby() {
        return Boolean(this.lobbyId);
    }
}
