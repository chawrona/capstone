import Lobby from "../models/Lobby.js";

export default class LobbyManager {
    constructor() {
        if (LobbyManager.instance) {
            return LobbyManager.instance;
        }
        this.lobbies = new Map();
        LobbyManager.instance = this;
    }
    createLobby() {
        const lobby = new Lobby();
        this.lobbies.set(lobby.uuid, lobby);
        return lobby;
    }
    deleteLobby(uuid) {
        return this.lobbies.delete(uuid);
    }
    getLobby(uuid) {
        return this.lobbies.get(uuid);
    }
    canJoinLobby(lobbyId) {
        console.log(lobbyId);
        return true;
    }
}
