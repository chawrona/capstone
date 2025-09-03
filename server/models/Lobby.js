import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import generateShortId from "../utils/generateShortId.js";
import Game from "./Game.js";
import games from "../config/games.json";

export default class Lobby {
    constructor() {
        this.id = generateShortId();
        this.gameType = games[0].game;
        this.game = null;
        this.isActive = false;
        this.users = new Set();
        this.lobbyManager = new LobbyManager();
        this.userManager = new UserManager();
        this.admin = null;
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
        console.log("Dołączył do pokoju");
    }

    getPlayerCount() {
        return this.users.size;
    }

    removeUser(userId) {
        return this.users.delete(userId);
    }

    isAdmin(userId) {
        return userId === this.admin;
    }
}
