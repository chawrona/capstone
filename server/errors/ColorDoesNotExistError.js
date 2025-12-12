export default class ColorDoesNotExistError extends Error {
    constructor(message = "Wybrany kolor nie istnieje.") {
        super(message);
        this.name = "ColorDoesNotExistError";
        this.code = "COLOR_NOT_EXISTS";
    }
}
