import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmmiter from "../services/EventEmmiter.js";
import Logger from "../services/Logger.js";

export default class LobbyEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
        this.lobbyManager = new LobbyManager();
        this.userManager = new UserManager();
        this.eventEmmiter = new EventEmmiter();
        this.logger = new Logger();
    }

    registerEvents() {
        this.socket.on("createLobby", (payload) => this.onCreateLobby(payload));
        this.socket.on("join", () => this.onJoin());
        this.socket.on("leave", (payload) => this.onLeave(payload));
    }

    onCreateLobby(payload) {
        const lobby = this.lobbyManager.createLobby();
        console.log(payload.userId);
        const user = this.userManager.getUser(payload.userId);

        try {
            user.lobbyId = lobby.id;
            this.socket.join(lobby.id);
            lobby.users.add(user.id);
            this.eventEmmiter.toUser(user.id, "lobby", { lobbyId: lobby.id });
        } catch (error) {
            this.eventEmmiter.toUser(user.id, "error", { lobbyId: lobby.id });
            this.logger.log(error);
        }

        this.logger.log(
            `Stworzono lobby o id ${lobby.id} przez gracza ${user.id}`,
        );

        console.log("create");
    }

    onJoin() {
        console.log("join");
    }

    onLeave(payload) {
        console.log("leave");
        console.log(payload);
    }
}
