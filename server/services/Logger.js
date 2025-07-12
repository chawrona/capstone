import fs from "fs";
export default class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }

        Logger.instance = this;
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logLine = `[${timestamp}] ${message}`;

        console.log(logLine);

        fs.appendFile("./server/storage/logs.txt", logLine + "\n");
    }
}
