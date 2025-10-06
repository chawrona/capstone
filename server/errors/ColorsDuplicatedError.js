export default class ColorsDuplicatedError extends Error {
    constructor(message = "Kilku graczy ma ten sam kolor") {
        super(message);
        this.name = "ColorsDuplicatedError";
        this.code = "COLORS_DUPLICATED";
    }
}
