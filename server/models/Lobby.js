import LobbyManager from "../managers/LobbyManager.js";
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

    joinUser(userId) {
        if (this.users.size >= this.maxPlayers) {
            throw new Error("The room is full.");
        }
        this.users.add(userId);
    }
    getPlayerCount() {
        return this.users.size;
    }

    removeUser(userId) {
        return this.users.delete(userId);
    }
}
