export default class LobbyHandler {
    constructor() {
        this.mapUserIdToLobby = new Map();
    }
    addUserToLobby(userId, lobbyId) {
        this.mapUserIdToLobby.set(userId, lobbyId);
    }
    removeUserFromLobby(userId) {
        this.mapUserIdToLobby.delete(userId);
    }
    doesUserBelongToLobby(userId, lobbyId) {
        return this.mapUserIdToLobby.get(userId) === lobbyId;
    }
    doesUserHaveLobby(userId){
        return this.mapUserIdToLobby.has(userId)
    }
    whoIsInLobby() {
        console.log("TESTOWO");
    }
}
