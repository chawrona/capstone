import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import AuthenticationController from "./controllers/AuthenticationController.js";
import ConnectionController from "./controllers/ConnectionController.js";
import ViewController from "./controllers/ViewController.js";
import EventEmitter from "./services/EventEmitter.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin:
            process.env.DEVELOPMENT === "true"
                ? "http://localhost:5173"
                : false,
        methods: ["GET", "POST"],
        credentials: process.env.DEVELOPMENT === "true",
    },
});
const authenticationController = new AuthenticationController();
const viewController = new ViewController();

app.use(express.json());
app.use(express.static("public"));

if (process.env.DEVELOPMENT === "true") {
    app.use((req, res, next) => {
        const origin = req.headers.origin;
        if (origin) {
            res.header("Access-Control-Allow-Origin", origin);
        }
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET, POST");
        res.header("Access-Control-Allow-Headers", "Content-Type");

        next();
    });
}

app.use("/api", authenticationController.getRouter());
app.use("/", viewController.getRouter());

new EventEmitter(io);
new ConnectionController(io);

server.listen(process.env.PORT, () =>
    console.log(`Server running on http://localhost:${process.env.PORT}`),
);
