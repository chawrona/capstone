import games from "../config/games.json" with { type: "json" };
import generateShortId from "../utils/generateShortId.js";
import Game from "./Game.js";

export default class Lobby {
    constructor() {
        this.id = generateShortId();
        this.gameInfo = games[0];
        this.game = null;
        this.isActive = false;
        this.users = new Set();
        this.admin = null;
    }

    start(players) {
        switch (this.gameInfo.title) {
            case "game":
                this.game = new Game(players, () => this.endGame());
                break;
        }
        this.isActive = true;
        return this.gameInfo.title;
    }

    lobbyInformation() {
        console.log("Information about lobby");
    }

    endGameJoinLobby() {
        console.log("Thanks for playing, redirecting to lobby...");
    }

    joinUser(userId) {
        if (this.users.size >= this.maxPlayers) {
            throw new Error("Pokój jest pełny.");
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
    endGame() {
        this.isActive = false;
    }
}
