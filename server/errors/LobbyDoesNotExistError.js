export default class LobbyDoesNotExistError extends Error {
  constructor(message = "Pokój o podanym id nie istnieje.") {
    super(message);
    this.name = "LobbyDoesNotExistError";
    this.code = "LOBBY_NOT_FOUND";
  }
}
