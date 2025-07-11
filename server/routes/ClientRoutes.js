import express from "express";

export default class ClientRoutes {
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        const sendIndex = (req, res) => {
            res.sendFile("index.html", { root: "clients" });
        };

        this.router.get("/1", sendIndex);
    }

    getRouter() {
        return this.router;
    }
}
