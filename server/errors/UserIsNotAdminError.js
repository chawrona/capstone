export default class UserIsNotAdminError extends Error {
    constructor(message) {
        super(message);
        this.name = "UserIsNotAdminError";
        this.code = "USER_NOT_ADMIN";
    }
}
