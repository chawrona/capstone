import LobbyDoesNotExistError from "../errors/LobbyDoesNotExistError.js";
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
        console.log("Usunięto pokój");
        return this.lobbies.delete(lobbyId);
    }

    getLobby(lobbyId) {
        const lobby = this.lobbies.get(lobbyId);
        if (!lobby) {
            throw new LobbyDoesNotExistError("Lobby nie istnieje");
        }
        return lobby;
    }
}
