export default class GameAlreadyStartedError extends Error {
    constructor(message = `Gra wystartowała.`) {
        super(message);
        this.name = "GameAlreadyStartedError";
        this.code = "GAME_NOT_EXISTS";
    }
}
