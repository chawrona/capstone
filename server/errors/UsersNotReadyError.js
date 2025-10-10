export default class UsersNotReadyError extends Error {
    constructor(
        message = "Użytkownicy nie są gotowi do rozpoczęcia rozgrywki.",
    ) {
        super(message);
        this.name = "UsersNotReadyError";
        this.code = "USERS_NOT_READY";
    }
}
