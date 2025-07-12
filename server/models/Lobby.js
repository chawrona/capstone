export default class Lobby {
    constructor(uuid, maxPlayers, gameType, game, isGameActive){
        this.uuid = uuid;
        this.maxPlayers = maxPlayers;
        this.gameType = gameType;
        this.game = game;
        this.isGameActive = isGameActive;

    }
    canJoinLobby(){
        console.log("To be seen");
        return true;
    }
    lobbyInformation(){
        console.log("Information about lobby");
    }
    endGameJoinLobby(){
        console.log("Thanks for playing, redirecting to lobby...");
    }
}