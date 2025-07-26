export default class LobbyHandler {
    constructor() {
        this.userIdToLobbyId = new Map();
    }

    addUserToLobby(userId, lobbyId) {
        this.userIdToLobbyId.set(userId, lobbyId);
    }

    removeUserFromLobby(userId) {
        this.userIdToLobbyId.delete(userId);
    }

    doesUserBelongToLobby(userId, lobbyId) {
        return this.userIdToLobbyId.get(userId) === lobbyId;
    }

    doesUserHaveLobby(userId) {
        return this.userIdToLobbyId.has(userId);
    }

    whoIsInLobby() {
        console.log("TESTOWO");
    }
}
