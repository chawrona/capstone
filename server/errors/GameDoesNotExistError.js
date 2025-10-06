export default class GameDoesNotExistError extends Error {
    constructor() {
        super(`Game does not exist`);
        this.name = "GameDoesNotExistError";
        this.code = "GAME_NOT_EXISTS";
    }
}