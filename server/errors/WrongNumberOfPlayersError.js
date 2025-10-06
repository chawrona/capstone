export default class WrongNumberOfPlayersError extends Error {
    constructor(
        message = "W lobby znajduje się nieodpowiednia ilość użytkowników do uruchomienia gry",
    ) {
        super(message);
        this.name = "WrongNumberOfPlayersError";
        this.code = "WRONG_NUMBER_PLAYERS_LOBBY";
    }
}
