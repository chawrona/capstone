import express from "express";

export default class ClientRoutes {
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        const sendIndex = (req, res) => {
            res.sendFile("index.html", { root: "public" });
        };

        this.router.get(/.*/, sendIndex);
    }

    getRouter() {
        return this.router;
    }
}
