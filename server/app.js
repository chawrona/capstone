import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import ClientRoutes from "./routes/ClientRoutes.js";
import EventEmmiter from "./services/EventEmmiter.js";
import LobbyEvents from "./socketEvents/LobbyEvents.js";
import UserEvents from "./socketEvents/UserEvents.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const clientRoutes = new ClientRoutes();

dotenv.config();

// Tutaj ustawiamy jakie pliki strony internetowej będzie wysyłał nasz serwer
app.use(express.static("clients"));
app.use("/", clientRoutes.getRouter());

// Tutaj ustawiamy w na jakie event w komunikacji socket-io będziemy nasłuchiwać i reagować
new EventEmmiter(io);
io.on("connection", (socket) => {
    new UserEvents(socket);
    new LobbyEvents(socket);
    // lobby events
});

server.listen(process.env.PORT, () =>
    console.log(`Server running on http://localhost:${process.env.PORT}`),
);
