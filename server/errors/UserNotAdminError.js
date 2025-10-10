export default class UserNotAdminError extends Error {
    constructor(message = "Użytkownik nie jest administratorem.") {
        super(message);
        this.name = "UserNotAdminError";
        this.code = "USER_NOT_ADMIN";
    }
}
