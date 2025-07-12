import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import ClientRoutes from "./routes/ClientRoutes.js";
import ConnectionEvents from "./socketEvents/ConnectionEvents.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const clientRoutes = new ClientRoutes();

dotenv.config();

// Tutaj ustawiamy jakie pliki strony internetowej będzie wysyłał nasz serwer
app.use(express.static("clients"));
app.use("/", clientRoutes.getRouter());

// Tutaj ustawiamy w na jakie event w komunikacji socket-io będziemy nasłuchiwać i reagować
io.on("connection", (socket) => {
    new ConnectionEvents(socket);
    // lobby events
});

server.listen(process.env.PORT, () =>
    console.log(`Server running on http://localhost:${process.env.PORT}`),
);
