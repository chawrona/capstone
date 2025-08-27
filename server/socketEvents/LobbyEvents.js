import LobbyDoesNotExistError from "../errors/LobbyDoesNotExistError.js";
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
        const lobbyId = lobby.id;
        const user = this.userManager.getUser(userId);

        try {
            user.lobbyId = lobbyId;
            this.socket.join(lobbyId);
            lobby.joinUser(userId);
            this.eventEmmiter.toUser(userId, "lobby", { lobbyId });

            this.logger.log(
                `Stworzono pokój o id ${lobbyId} przez gracza ${userId}`,
            );
        } catch (error) {
            this.eventEmmiter.toUserError(userId, error);
        }
    }

    onJoinLobby({ userId, data: { lobbyId } }) {
        const lobby = this.lobbyManager.getLobby(lobbyId);
        const user = this.userManager.getUser(userId);
        try {
            if (!lobby)
                throw new LobbyDoesNotExistError(
                    `Pokój #${lobbyId} nie istnieje.`,
                );
            lobby.joinUser(userId);
            user.lobbyId = lobbyId;
            this.socket.join(lobbyId);

            this.eventEmmiter.toUser(userId, "lobby", {
                userId,
                data: { lobbyId },
            });

            this.logger.log(
                `Użytkownik o id ${userId} dołączył do pokoju #${lobbyId}.`,
            );
        } catch (error) {
            this.eventEmmiter.toUserError(userId, error);
        }
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
        console.log("Wyszedł");
    }

    onGameStart({ userId }) {
        const lobby = this.lobbyManager.getLobby(userId);
        lobby.start();
    }
}
