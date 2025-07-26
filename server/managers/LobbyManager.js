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
        this.lobbies.set(lobby.id, lobby);
        return lobby;
    }

    deleteLobby(lobbyId) {
        return this.lobbies.delete(lobbyId);
    }

    getLobby(lobbyId) {
        return this.lobbies.get(lobbyId);
    }

    canJoinLobby(lobbyId) {
        console.log(lobbyId);
        return true;
    }
}
