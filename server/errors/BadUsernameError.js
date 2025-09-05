export default class BadUsernameError extends Error {
    constructor() {
        super(`Nieprawidłowy nick`);
        this.name = "BadUsernameError";
        this.code = "BAD_USERNAME";
    }
}
