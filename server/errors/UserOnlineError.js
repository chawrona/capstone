export default class UserOnlineError extends Error {
  constructor(message = "Użytkownik jest już online.") {
    super(message);
    this.name = "UserOnlineError";
    this.code = "USER_ONLINE";
  }
}
