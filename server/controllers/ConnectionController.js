import UserOnlineError from "../errors/UserOnlineError.js";
import GameEvents from "../events/GameEvents.js";
import LobbyEvents from "../events/LobbyEvents.js";
import UserEvents from "../events/UserEvents.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmitter from "../services/EventEmitter.js";
import Logger from "../services/Logger.js";
import parseCookie from "../utils/parseCookie.js";

export default class ConnectionController {
    constructor(io) {
        io.on("connection", (socket) => this.onConnect(socket));
        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
        this.logger = new Logger();
        this.eventEmitter = new EventEmitter();
    }

    onConnect(socket) {
        // User zawsze znajduje się w lobby jeżeli robi onConnect
        // Ponieważ albo POST na /api/authenticate już go dodał
        // albo był w pokoju, lecz wyszedł
        const userId = parseCookie(socket.handshake.headers.cookie, "userId");

        try {
            if (!this.userManager.doesUserExist(userId)) {
                throw new Error("Użytkownik nie istnieje");
            }

            const user = this.userManager.getUser(userId);

            if (user.isOnline) {
                throw new UserOnlineError();
            }

            this.userManager.updateUserSocketId(userId, socket.id);
            user.isOnline = true;
            socket.join(user.lobbyId);

            this.registerEvents(socket);
        } catch (error) {
            // At this point the userId -> socketId mapping may not be set
            // yet (that's often exactly what's failing here), so routing
            // through EventEmitter.toUser/toUserError would resolve a
            // stale or undefined socket id and reach nobody. Also,
            // registerEvents() never ran, so this socket will never get
            // lobbyData/gameData - send it home directly instead of
            // leaving the client stuck on whatever page it's on.
            socket.emit("homepage", { error: error.message });
            this.logger.error(error.message);
        }
    }

    registerEvents(socket) {
        new UserEvents(socket);
        new LobbyEvents(socket);
        new GameEvents(socket);
    }
}
