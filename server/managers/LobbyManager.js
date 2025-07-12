import Lobby from "../models/Lobby.js";

export default class LobbyManager{
    constructor(){
        this.lobbies = new Map();
    }
    createLobby(){
        const lobby = new Lobby();
        this.lobbies.set(lobby.uuid,lobby);
        return lobby;
    }
    deleteLobby(uuid){
        return this.lobbies.delete(uuid)
    }
    getLobby(uuid){
        return this.lobbies.get(uuid)
    }
    canJoinLobby(lobbyId){
        return true;
    }
}