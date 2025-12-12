export default class UserDoesNotExistError extends Error {
  constructor(message = "Użytkownik nie istnieje.") {
    super(message);
    this.name = "UserDoesNotExistError";
    this.code = "USER_DOES_NOT_EXIST";
  }
}
