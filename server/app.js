import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import AuthorizationController from "./controllers/AuthorizationController.js";
import ViewController from "./controllers/ViewController.js";
import GameEvents from "./events/GameEvents.js";
import LobbyEvents from "./events/LobbyEvents.js";
import UserEvents from "./events/UserEvents.js";
import EventEmmiter from "./services/EventEmmiter.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const authorizationController = new AuthorizationController();
const viewController = new ViewController();

dotenv.config();

// Tutaj ustawiamy jakie pliki strony internetowej będzie wysyłał nasz serwer
app.use(express.static("public"));

app.use("/api", authorizationController.getRouter());
app.use("/", viewController.getRouter());

// Tutaj ustawiamy w na jakie event w komunikacji socket-io będziemy nasłuchiwać i reagować
new EventEmmiter(io);

io.on("connection", (socket) => {
    /* 
        Tworzenie instancji gracza jeżeli go nie ma
        Jeżeli jest to update socketu
        event do wszystkich z resume
        gra na resume

        dalej, przemyśleć kiedy usuwa się graczy z systemu.
    
    */

    new UserEvents(socket);
    new LobbyEvents(socket);
    new GameEvents(socket);
});

server.listen(process.env.PORT, () =>
    console.log(`Server running on http://localhost:${process.env.PORT}`),
);
