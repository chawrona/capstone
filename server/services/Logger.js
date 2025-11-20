import fs from "fs/promises";

export default class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }

        this.queue = Promise.resolve();

        Logger.instance = this;
    }

    enqueueWrite(logLine) {
        this.queue = this.queue
            .then(() =>
                fs.appendFile("./server/storage/logs.txt", logLine + "\n"),
            )
            .catch((err) => console.error("Logger error:", err));

        return this.queue;
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logLine = `[${timestamp}] ${message}`;
        console.log(logLine);
        return this.enqueueWrite(logLine);
    }

    error(message) {
        const timestamp = new Date().toISOString();
        const logLine = `[ERROR] [${timestamp}] ${message}`;
        return this.enqueueWrite(logLine);
    }
}
