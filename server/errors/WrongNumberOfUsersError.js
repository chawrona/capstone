export default class WrongNumberOfUsersError extends Error {
    constructor(
        message = "W pokoju znajduje się za mało lub za dużo graczy, aby wystartować grę.",
    ) {
        super(message);
        this.name = "WrongNumberOfUsersError";
        this.code = "WRONG_NUMBER_USERS_LOBBY";
    }
}
