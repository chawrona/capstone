import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import generateUUID from "../utils/generateUUID.js";
import Game from "./Game.js";

export default class Lobby {
    constructor() {
        this.id = generateUUID();
        this.maxPlayers = 5;
        this.gameType = "brianboru";
        this.game = null;
        this.isActive = false;
        this.users = new Set();
        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
    }

    start() {
        switch (this.gameType) {
            case "brianboru":
                this.game = new Game();
                break;
        }
        this.isActive = true;
    }

    lobbyInformation() {
        console.log("Information about lobby");
    }

    endGameJoinLobby() {
        console.log("Thanks for playing, redirecting to lobby...");
    }

    getPlayerCount() {
        return this.users.size;
    }

    removeUser(userId) {
        this.users.delete(userId);
        if (this.getPlayerCount() <= 0) {
            this.lobbyManager.deleteLobby(this.id);
        }
    }
}
