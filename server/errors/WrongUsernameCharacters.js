export default class WrongUsernameCharacters extends Error {
    constructor() {
        super(`Nick może składać się tylko z liter, liczb oraz spacji`);
        this.name = "WrongUsernameCharacters";
        this.code = "WRONG_USERNAME_CHARS";
    }
}
