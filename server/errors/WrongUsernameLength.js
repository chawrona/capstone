export default class WrongUsernameLength extends Error {
    constructor() {
        super("Nieprawidłowa długość nazwy gracza. Wymagane od 3 do 20 znaków");
        this.name = "WrongUsernameLength";
        this.code = "WRONG_USERNAME_LENGTH";
    }
}
