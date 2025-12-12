export default class InvalidUsernameLengthError extends Error {
    constructor(
        message = "Nieprawidłowa długość nazwy gracza. Wymagane od 3 do 20 znaków.",
    ) {
        super(message);
        this.name = "InvalidUsernameLengthError";
        this.code = "INVALID_USERNAME_LENGTH";
    }
}
