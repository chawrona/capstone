import UserIsNotAdminError from "../errors/UserIsNotAdminError.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmmiter from "../services/EventEmmiter.js";
import Logger from "../services/Logger.js";
import EventHelper from "./EventHelper.js";

export default class LobbyEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
        this.lobbyManager = new LobbyManager();
        this.userManager = new UserManager();
        this.eventEmmiter = new EventEmmiter();
        this.eventHelper = new EventHelper();
        this.logger = new Logger();
    }

    registerEvents() {
        this.socket.on("createLobby", (payload) => this.onCreateLobby(payload));
        this.socket.on("joinLobby", (payload) => this.onJoinLobby(payload));
        this.socket.on("leaveLobby", (payload) => this.onLeaveLobby(payload));
        this.socket.on("toggleReady", (payload) => this.onToggleReady(payload));
        this.socket.on("lobbyDataRequest", (payload) =>
            this.onLobbyDataRequest(payload),
        );
        this.socket.on("removeUser", (payload) => this.onRemoveUser(payload));
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
            lobby.admin = userId;
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
            if (!lobby) throw new Error(`Pokój #${lobbyId} nie istnieje.`);
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

            this.eventHelper.sendLobbyData(lobbyId);
        } catch (error) {
            this.eventEmmiter.toUserError(userId, error);
        }
    }

    onLeaveLobby({ userId }) {
        const user = this.userManager.getUser(userId);
        const lobby = this.lobbyManager.getLobby(user.lobbyId);
        try {
            lobby.removeUser(userId);

            if (!lobby.getPlayerCount()) {
                this.lobbyManager.deleteLobby(lobby.id);
            } else if (lobby.isAdmin) {
                lobby.admin = [...lobby.users][0];
                this.eventHelper.sendLobbyData(lobby.id);
            }

            this.socket.leave(user.lobbyId);
            user.lobbyId = null;
            user.isReady = false;

            this.logger.log(`Użytkownik o id ${userId} opuścił pokój.`);
        } catch (error) {
            this.eventEmmiter.toUserError(userId, error);
        }
    }

    onGameStart({ userId }) {
        const lobby = this.lobbyManager.getLobby(userId);
        lobby.start();
    }

    onToggleReady({ userId }) {
        const user = this.userManager.getUser(userId);
        user.isReady = !user.isReady;
        this.eventHelper.sendLobbyData(user.lobbyId);
    }

    onLobbyDataRequest({ userId }) {
        const user = this.userManager.getUser(userId);
        const lobby = this.lobbyManager.getLobby(user.lobbyId);

        const lobbyUsers = [];
        for (const lobbyUserId of lobby.users) {
            const { username, isReady, publicId } =
                this.userManager.getUser(lobbyUserId);
            lobbyUsers.push({
                username,
                isReady,
                publicId,
                isAdmin: lobby.isAdmin(lobbyUserId),
            });
        }

        const lobbyData = {
            lobbyUsers,
            maxPlayers: lobby.maxPlayers,
            currentUser: user.publicId,
            availableColors: [{ name: "red", hex: "#ff00000" }],
            gameData: { name: "brianboru", maxPlayers: 5 },
        };

        this.eventEmmiter.toUser(userId, "lobbyData", lobbyData);
    }

    onRemoveUser({ userId, data: { userToKickPublicId } }) {
        try {
            const lobby = this.lobbyManager.getLobby(userId);
            if (userId != lobby.admin) {
                throw new UserIsNotAdminError(
                    `Użytkownik #${userId} nie ma uprawnień do wyrzucania graczy z pokoju.`,
                );
            }
            const userIdToKick =
                this.userManager.getUserIdByPublicId(userToKickPublicId);
            lobby.removeUser(userIdToKick);
            this.eventEmmiter.toUser(userId, "info", {
                info: `Pomyślnie usunięto gracza z pokoju.`,
            });
            this.eventEmmiter.toUser(userToKickPublicId, "homepage", {
                error: `Zostałeś wyrzucony z pokoju`,
            });

            this.eventHelper.sendLobbyData(lobby.id);
        } catch (error) {
            if (error instanceof UserIsNotAdminError) {
                this.eventEmmiter.toUserError(userId, error);
            }
        }
    }
}
