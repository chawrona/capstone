import UserManager from "../managers/UserManager";
import LobbyManager from "../managers/LobbyManager";

export default class GameEvents{
    constructor(){
        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
    }

    onGameData({userId, data}){
        const user = this.userManager.getUser(userId);
        const publicId = user.publicId;
        const lobbyId = user.lobbyId;
        const lobby = this.lobbyManager.getLobby(lobbyId);
        const game = lobby.game;
        data.publicId = publicId;
        const targets = game.processGameData(data);
    }
}