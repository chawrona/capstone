import games from "../config/games.json" with { type: "json" };
import generateShortId from "../utils/generateShortId.js";
import BrianBoru from "./games/brianboru/BrianBoru.js";
import BrianBoruPlayer from "./games/brianboru/BrianBoruPlayer.js";
import Craftsmen from "./games/craftsmen/Craftsmen.js";
import CraftsmenPlayer from "./games/craftsmen/CraftsmenPlayer.js";
import Craftsmen2 from "./games/craftsmen2/Craftsmen.js";
import CraftsmenPlayer2 from "./games/craftsmen2/CraftsmenPlayer.js";
import Eurobusiness from "./games/eurobusiness/Eurobusiness.js";
import Ludo from "./games/Ludo.js";
import Philanthropists from "./games/philantropists/Philanthropists.js";
import PhilanthropistsPlayer from "./games/philantropists/PhilanthropistsPlayer.js";

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
            case "craftsmen":
                this.game = new Craftsmen(
                    players,
                    () => this.endGame(),
                    this.id,
                    CraftsmenPlayer,
                );
                break;
            case "craftsmen2":
                this.game = new Craftsmen2(
                    players,
                    () => this.endGame(),
                    this.id,
                    CraftsmenPlayer2,
                );
                break;
            case "brianboru":
                this.game = new BrianBoru(
                    players,
                    () => this.endGame(),
                    this.id,
                    BrianBoruPlayer,
                );
                break;
            case "eurobusiness":
                this.game = new Eurobusiness(
                    players,
                    () => this.endGame(),
                    this.id,
                );
                break;
            case "philanthropists":
                this.game = new Philanthropists(
                    players,
                    () => this.endGame(),
                    this.id,
                    PhilanthropistsPlayer,
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
