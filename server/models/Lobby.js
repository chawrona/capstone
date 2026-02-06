import games from "../config/games.json" with { type: "json" };
import generateShortId from "../utils/generateShortId.js";
import BrianBoru from "./games/brianboru/BrianBoru.js";
import Eurobusiness from "./games/eurobusiness/Eurobusiness.js";
import Ludo from "./games/Ludo.js";

export default class Lobby {
    constructor() {
        this.id = generateShortId();
        this.gameInfo = games[0];
        this.game = null;
        this.isActive = false;
        this.users = new Set();
        this.admin = null;
        this.maxPlayers = 10;
    }

    start(players) {
        switch (this.gameInfo.title) {
            case "ludo":
                this.game = new Ludo(players, () => this.endGame(), this.id);
                break;
            case "brianboru":
                this.game = new BrianBoru(
                    players,
                    () => this.endGame(),
                    this.id,
                );
                break;
            case "eurobusiness":
                this.game = new Eurobusiness(
                    players,
                    () => this.endGame(),
                    this.id,
                );
                break;
        }
        this.isActive = true;
        return this.gameInfo.title;
    }

    joinUser(userId) {
        if (this.users.size >= this.maxPlayers) {
            throw new Error("Pokój jest pełny.");
        }
        this.users.add(userId);
        ("Dołączył do pokoju");
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
