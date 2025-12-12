export default class InvalidUsernameCharactersError extends Error {
  constructor(
    message = "Nazwa użytkownika może składać się tylko z liter, liczb oraz spacji.",
  ) {
    super(message);
    this.name = "InvalidUsernameCharactersError";
    this.code = "INVALID_USERNAME_CHARS";
  }
}
