export default class User {
    constructor(userId) {
        this.id = userId;
        this.name = 1;
        this.lobbyId = null;
    }

    hasLobby() {
        return Boolean(this.lobbyId);
    }
}
