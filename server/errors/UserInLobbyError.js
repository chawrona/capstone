export default class UserInLobbyError extends Error {
    constructor(message = "Użytkownik znajduje się już w lobby.") {
        super(message);
        this.name = "UserInLobbyError";
        this.code = "USER_HAS_LOBBY";
    }
}
