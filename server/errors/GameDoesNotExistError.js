export default class GameDoesNotExistError extends Error {
    constructor(message = `Gra nie istnieje.`) {
        super(message);
        this.name = "GameDoesNotExistError";
        this.code = "GAME_NOT_EXISTS";
    }
}
