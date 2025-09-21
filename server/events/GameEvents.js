import UserManager from "../managers/UserManager";
import LobbyManager from "../managers/LobbyManager";
import EventEmmiter from "../services/EventEmmiter";

export default class GameEvents{
    constructor(){
        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
        this.eventEmmiter = new EventEmmiter();
    }

    onGameData({userId, data}){ // nie wiemy dokładnie w jaki sposób będzie wykorzystywany onGameData i nie chcemy go zmieniać drastycznie tylko do dopasowania do toPublicUser z eventEmmitera.
        const user = this.userManager.getUser(userId);
        const lobby = this.lobbyManager.getLobby(user.lobbyId);
        data.publicId = user.publicId;
        const targets = lobby.game.processGameData(data);
        for(const targetObject of targets){
            if(targetObject.target === "lobby"){
                this.eventEmmiter.toRoom(targetObject.data.lobby.id, targetObject.eventName, targetObject.data);
            }else if(targetObject.eventName === "error"){
                const userId = this.userManager.getUserIdByPublicId(targetObject.data.publicId);
                this.eventEmmiter.toUserError(userId, targetObject.data.error);
                // this.eventEmmiter.toUserError(userId, targetObject.data)
            }else{
                const userId = this.userManager.getUserIdByPublicId(targetObject.data.publicId);
                this.eventEmmiter.toUser(userId, targetObject.eventName, targetObject.data);
            }
        }
    }
}