import generateUsername from "../utils/generateUsername.js";
import generateUuid from "../utils/generateUuid.js";

export default class User {
    constructor(userId) {
        this.id = userId;
        this.publicId = generateUuid();
        this.name = 1;
        this.lobbyId = null;
        this.isReady = false;
        this.username = generateUsername();
        this.color = null;
    }

    hasLobby() {
        return Boolean(this.lobbyId);
    }
}
