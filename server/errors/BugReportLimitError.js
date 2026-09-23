export default class BugReportLimitError extends Error {
    constructor(message = "Osiągnięto limit zgłoszeń, spróbuj później.") {
        super(message);
        this.name = "BugReportLimitError";
        this.code = "BUG_REPORT_LIMIT";
    }
}
