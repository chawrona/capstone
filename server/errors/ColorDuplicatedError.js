export default class ColorDuplicatedError extends Error {
    constructor(message = "Gracze nie mogą mieć tego samego koloru.") {
        super(message);
        this.name = "ColorDuplicatedError";
        this.code = "COLOR_DUPLICATED_ERROR";
    }
}
