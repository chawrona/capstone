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
        this.socket.on("joinLobby", (payload) => this.onJoinLobby(payload));
        this.socket.on("leaveLobby", (payload) => this.onLeaveLobby(payload));
        this.socket.on("gameStart", () => this.onGameStart());
    }

    onCreateLobby({ userId }) {
        const lobby = this.lobbyManager.createLobby();
        const user = this.userManager.getUser(userId);

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
    }

    onJoinLobby() {
        console.log("join");
    }

    onLeaveLobby({ userId }) {
        const user = this.userManager.getUser(userId);
        const lobby = this.lobbyManager.getLobby(user.lobbyId);
        lobby.removeUser(userId);

        if (!lobby.getPlayerCount()) {
            this.lobbyManager.deleteLobby(lobby.id);
        }

        this.socket.leave(user.lobbyId);
        user.lobbyId = null;
    }

    onGameStart({ userId }) {
        const lobby = this.lobbyManager.getLobby(userId);
        lobby.start();
    }
}
