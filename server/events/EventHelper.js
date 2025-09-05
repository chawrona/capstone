// Parsing error: Unexpected token assert
import colors from "../config/colors.json" with { type: "json" };
import BadUsernameError from "../errors/BadUsernameError.js";
import LobbyDoesNotExistError from "../errors/LobbyDoesNotExistError.js";
import WrongUsernameCharacters from "../errors/WrongUsernameCharacters.js";
import WrongUsernameLength from "../errors/WrongUsernameLength.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmmiter from "../services/EventEmmiter.js";

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
            const { name, isReady, publicId, color } =
                this.userManager.getUser(lobbyUserId);
            lobbyUsers.push({
                username: name,
                isReady,
                publicId,
                isAdmin: lobby.isAdmin(lobbyUserId),
                color,
            });
        }

        const lobbyData = {
            lobbyUsers,
            maxPlayers: lobby.maxPlayers,
            availableColors: colors,
            gameData: lobby.gameType,
        };

        for (const lobbyUserId of lobby.users) {
            const user = this.userManager.getUser(lobbyUserId);
            this.eventEmmiter.toUser(lobbyUserId, "lobbyData", {
                ...lobbyData,
                currentUser: user.publicId,
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
            this.eventEmmiter.toUser(userId, "lobby", lobbyId);
            this.sendLobbyData(lobbyId);
            return true;
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

    validateUsername(username) {
        if (!username || typeof username !== "string") {
            throw new BadUsernameError();
        }

        if (username.length < 3 || username.length > 20) {
            throw new WrongUsernameLength();
        }

        const regex = /^(?!.* {2})[A-Za-z0-9 ]+$/;
        if (!regex.test(username)) {
            throw new WrongUsernameCharacters();
        }
    }
}
