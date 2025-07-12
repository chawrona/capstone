export default class LobbyHandler {
    constructor() {
        this.mapUUIDToLobby = new Map();
    }
    addUserToLobby(userId, lobbyId) {
        this.mapUUIDToLobby.set(userId, lobbyId);
    }
    removeUserFromLobby(userId) {
        this.mapUUIDToLobby.delete(userId);
    }
    doesUserBelongToLobby(userId, lobbyId) {
        return this.mapUUIDToLobby.get(userId) === lobbyId;
    }
    doesUserHaveLobby(userId){
        return this.mapUUIDToLobby.has(userId)
    }
    whoIsInLobby() {
        console.log("TESTOWO");
    }
}
