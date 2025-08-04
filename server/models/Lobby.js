import generateUUID from "../utils/generateUUID.js";

export default class Lobby {
    constructor(maxPlayers, gameType, game, isGameActive) {
        this.id = generateUUID();
        this.maxPlayers = maxPlayers;
        this.gameType = gameType;
        this.game = game;
        this.isGameActive = isGameActive;
        this.users = new Set();
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
