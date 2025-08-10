export default class User {
    constructor(userId) {
        this.id = userId;
        this.name = 1;
    //    this.lobby = null; po napisaniu niżej this.lobbies = new Map(); zrezygnowałbym z tej linijki
        this.lobbies = new Map();
    }
    hasLobby(lobbyId){ 
        return this.lobbies.has(lobbyId);
    }
}