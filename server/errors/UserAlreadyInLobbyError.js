export default class UserAlreadyInLobbyError extends Error {
    constructor(message = "Użytkownik znajduje się już w lobby") {
        super(message);
        this.name = "UserAlreadyInLobbyError";
        this.code = "USER_HAS_LOBBY";
    }
}
