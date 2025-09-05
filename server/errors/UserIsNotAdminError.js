export default class UserIsNotAdminError extends Error {
    constructor(userId) {
        super(
            `Użytkownik #${userId} nie ma uprawnień do wyrzucania graczy z pokoju.`,
        );
        this.name = "UserIsNotAdminError";
        this.code = "USER_NOT_ADMIN";
    }
}
