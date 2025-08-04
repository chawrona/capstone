import generateUUID from "../utils/generateUUID.js";
import Game from "../models/Game.js";

export default class Lobby {
    constructor() {
        this.id = generateUUID();
        this.maxPlayers = 5;
        this.gameType = "brianboru";
        this.game = null;
        this.isActive = false;
    }

    start(){
        switch(this.gameType){
            case "brianboru":
                this.game = new Game();
                break;
        }
        this.isActive = true;
    }
    canJoinLobby() {
        console.log("To be seen");
        return true;
    }

    lobbyInformation() {
        console.log("Information about lobby");
    }

    endGameJoinLobby() {
        console.log("Thanks for playing, redirecting to lobby...");
    }
}
