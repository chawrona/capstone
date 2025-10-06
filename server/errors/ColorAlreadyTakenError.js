export default class ColorDoesNotExistError extends Error {
    constructor() {
        super(`Color is already taken`);
        this.name = "ColorAlreadyTakenError";
        this.code = "COLOR_ALREADY_TAKEN";
    }
}
