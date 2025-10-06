export default class UserAlreadyInLobbyError extends Error {
    constructor(message = "Użytkownik jest już online") {
        super(message);
        this.name = "UserAlreadyOnlineError";
        this.code = "USER_ONLINE";
    }
}
