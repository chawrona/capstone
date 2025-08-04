import LobbyManager from "../models/LobbyManager.js";
import UserManager from "../models/UserManager.js";
import EventEmmiter from "../services/EventEmmiter.js";
import Logger from "../services/Logger.js";

export default class LobbyEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
        this.lobbyManager = new LobbyManager();
        this.userManager = new UserManager();
        this.eventEmmiter = new EventEmmiter();
        this.logger = new Logger();
    }

    registerEvents() {
        this.socket.on("createLobby", this.onCreateLobby);
        this.socket.on("join", this.onJoin);
        this.socket.on("leave", this.onLeave);
    }

    onCreateLobby(payload) {
        try{
            const lobby = this.lobbyManager.createLobby()
            const user = this.userManager.getUser(payload.userId)
            user.lobbyId = lobby.id
            this.socket.join(lobby.id)
            lobby.users.add(user.id)
            this.eventEmmiter.toUser(user.id,"lobby",{lobbyId: lobby.id});
        } catch(error){
            this.eventEmmiter.toUser(user.id,"error",{lobbyId: lobby.id});
            this.logger.log(error)
        } 

        this.logger.log(`Stworzono lobby o id ${lobby.id} przez gracza ${user.id}`) // Tworzenie lobby

        console.log("create");
    }

    onJoin() {
        console.log("join");
    }

    onLeave(lobbyId) {
        console.log("leave");
        console.log(lobbyId);
    }
}
