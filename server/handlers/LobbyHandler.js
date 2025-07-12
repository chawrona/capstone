export default class LobbyHandler {
    constructor() {
        this.mapUUIDToLobby = new Map();
    }
    addPlayerToLobby(userId, lobbyId) {
        this.mapUUIDToLobby.set(userId, lobbyId);
    }
    removePlayerFromLobby(userId) {
        this.mapUUIDToLobby.delete(userId);
    }
    doesPlayerBelongToLobby(userId, lobbyId) {
        return this.mapUUIDToLobby.get(userId) === lobbyId;
    }
    whoIsInLobby() {
        console.log("TESTOWO");
    }
}
