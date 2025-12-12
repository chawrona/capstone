export default class GameAbortedPlayerLeftError extends Error {
  constructor(message = "Gra zakończona z powodu rozłączenia gracza.") {
    super(message);
    this.name = "GameAbortedPlayerLeftError";
    this.code = "GAME_ABORTED_PLAYER_LEFT_ERROR";
  }
}
