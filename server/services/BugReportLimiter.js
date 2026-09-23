import BugReportLimitError from "../errors/BugReportLimitError.js";
import InvalidBugReportError from "../errors/InvalidBugReportError.js";

// Limity zgłoszeń - śmiało zmieniać
const COOLDOWN_MS = 15_000;
const HOUR_MS = 60 * 60 * 1000;
const MAX_PER_HOUR = 10;
const MAX_GLOBAL_PER_DAY = 300;
const MIN_LENGTH = 5;
const MAX_LENGTH = 1000;

export default class BugReportLimiter {
    constructor() {
        if (BugReportLimiter.instance) {
            return BugReportLimiter.instance;
        }

        // userId -> timestampy zgłoszeń z ostatniej godziny
        this.userReports = new Map();
        this.globalDay = null;
        this.globalCount = 0;

        BugReportLimiter.instance = this;
    }

    validate(message) {
        if (typeof message !== "string") {
            throw new InvalidBugReportError();
        }

        const trimmed = message.trim();

        if (trimmed.length < MIN_LENGTH) {
            throw new InvalidBugReportError(
                `Opis błędu musi mieć co najmniej ${MIN_LENGTH} znaków.`,
            );
        }

        if (trimmed.length > MAX_LENGTH) {
            throw new InvalidBugReportError(
                `Opis błędu może mieć maksymalnie ${MAX_LENGTH} znaków.`,
            );
        }

        return trimmed;
    }

    check(userId) {
        const now = Date.now();
        this.resetGlobalIfNewDay();

        if (this.globalCount >= MAX_GLOBAL_PER_DAY) {
            throw new BugReportLimitError(
                "Dzienny limit zgłoszeń został osiągnięty, spróbuj jutro.",
            );
        }

        // wywalamy stare wpisy, żeby mapa nie rosła w nieskończoność
        const timestamps = (this.userReports.get(userId) || []).filter(
            (time) => now - time < HOUR_MS,
        );
        this.userReports.set(userId, timestamps);

        const last = timestamps[timestamps.length - 1];
        if (last && now - last < COOLDOWN_MS) {
            const seconds = Math.ceil((COOLDOWN_MS - (now - last)) / 1000);
            throw new BugReportLimitError(
                `Poczekaj ${seconds} s przed kolejnym zgłoszeniem.`,
            );
        }

        if (timestamps.length >= MAX_PER_HOUR) {
            throw new BugReportLimitError();
        }
    }

    register(userId) {
        this.resetGlobalIfNewDay();
        this.globalCount++;

        const timestamps = this.userReports.get(userId) || [];
        timestamps.push(Date.now());
        this.userReports.set(userId, timestamps);
    }

    resetGlobalIfNewDay() {
        const today = new Date().toISOString().slice(0, 10);
        if (this.globalDay !== today) {
            this.globalDay = today;
            this.globalCount = 0;
            // przy okazji czyścimy userów bez świeżych zgłoszeń
            const now = Date.now();
            for (const [userId, timestamps] of this.userReports) {
                if (!timestamps.some((time) => now - time < HOUR_MS)) {
                    this.userReports.delete(userId);
                }
            }
        }
    }
}
