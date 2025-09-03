import LobbyDoesNotExistError from "../errors/LobbyDoesNotExistError.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmmiter from "../services/EventEmmiter.js";
import colors from "../config/colors.json";
import Lobby from "../models/Lobby.js";

export default class EventHelper {
    constructor() {
        this.lobbyManager = new LobbyManager();
        this.userManager = new UserManager();
        this.eventEmmiter = new EventEmmiter();
    }

    sendLobbyData(lobbyId) {
        const lobby = this.lobbyManager.getLobby(lobbyId);
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
            avaibleColors: colors,
            gameData: lobby.gameType,
        };

        for (const lobbyUserId of lobby.users) {
            this.eventEmmiter.toUser(lobbyUserId, "lobbyData", {
                ...lobbyData,
                currentUser: this.userManager.getUser(lobbyUserId),
            });
        }
    }

    isLobbyIdGiven(userId, lobbyId) {
        try {
            if (!lobbyId) {
                return this.eventEmmiter.toUser(userId, "homepage");
            }

            const lobby = this.lobbyManager.getLobby(lobbyId);

            if (!lobby) {
                throw new LobbyDoesNotExistError(
                    `Pokój #${lobbyId} nie istnieje.`,
                );
            }

            lobby.joinUser(userId);
            const user = this.userManager.getUser(userId);
            user.lobbyId = lobbyId;
            this.socket.join(user.lobbyId);
            this.eventEmmiter.toUser(userId, "lobby");
        } catch (error) {
            if (error instanceof LobbyDoesNotExistError) {
                this.eventEmmiter.toUser(userId, "homepage", {
                    error: error.message,
                });
            } else {
                this.eventEmmiter.toUserError(userId, error);
            }
        }
    }
}
