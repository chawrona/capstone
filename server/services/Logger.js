import fs from "fs/promises";

export default class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }

        Logger.instance = this;
    }

    async log(message) {
        const timestamp = new Date().toISOString();
        const logLine = `[${timestamp}] ${message}`;

        console.log(logLine);

        await fs.appendFile("./server/storage/logs.txt", logLine + "\n");
    }
}
