export default class UserCountMismatchError extends Error {
  constructor(message = "Za mało lub za dużo graczy, by rozpocząć grę.") {
    super(message);
    this.name = "UserCountMismatchError";
    this.code = "USER_COUNT_MISMATCH";
  }
}
