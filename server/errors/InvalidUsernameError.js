export default class InvalidUsernameError extends Error {
  constructor(message = "Nieprawidłowa nazwa użytkownika.") {
    super(message);
    this.name = "InvalidUsernameError";
    this.code = "INVALID_USERNAME";
  }
}
