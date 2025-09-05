export default class ColorDoesNotExistError extends Error {
    constructor() {
        super(`Color does not exist`);
        this.name = "ColorDoesNotExistError";
        this.code = "COLOR_NOT_EXISTS";
    }
}
