export default class InvalidBugReportError extends Error {
    constructor(message = "Nieprawidłowa treść zgłoszenia.") {
        super(message);
        this.name = "InvalidBugReportError";
        this.code = "INVALID_BUG_REPORT";
    }
}
