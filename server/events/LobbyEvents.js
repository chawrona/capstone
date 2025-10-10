import colors from "../config/colors.json" with { type: "json" };
import ColorsDuplicatedError from "../errors/ColorsDuplicatedError";
import LobbyDoesNotExistError from "../errors/LobbyDoesNotExistError.js";
import PlayerLacksColorError from "../errors/PlayerLacksColorError";
import UserAlreadyInLobbyError from "../errors/UserAlreadyInLobbyError.js";
import UserNotAdminError from "../errors/UserNotAdminError.js";
import UsersNotReadyError from "../errors/UsersNotReadyError.js";
import WrongNumberOfPlayersError from "../errors/WrongNumberOfUsersError.js";
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
        this.socket.on("lobbyDataRequest", (payload) =>
            this.onLobbyDataRequest(payload),
        );
        this.socket.on("removeUser", (payload) => this.onRemoveUser(payload));
        this.socket.on("gameStart", (payload) => this.onGameStart(payload));
    }

    onCreateLobby({ userId }) {
        try {
            const lobby = this.lobbyManager.createLobby();
            const lobbyId = lobby.id;
            const user = this.userManager.getUser(userId);

            user.color = null;

            user.lobbyId = lobbyId;
            this.socket.join(lobbyId);
            lobby.joinUser(userId);
            lobby.admin = userId;
            this.eventEmmiter.toUser(userId, "lobby", lobbyId);

            this.logger.log(
                `Stworzono pokój o id ${lobbyId} przez gracza ${userId}`,
            );
        } catch (error) {
            this.eventEmmiter.toUserError(userId, error);
        }
    }

    onJoinLobby({ userId, data: { lobbyId } }) {
        try {
            const lobby = this.lobbyManager.getLobby(lobbyId);
            const user = this.userManager.getUser(userId);

            if (!lobby) throw new LobbyDoesNotExistError();
            if (user.lobbyId) throw new UserAlreadyInLobbyError();

            user.color = null;

            lobby.joinUser(userId);
            user.lobbyId = lobbyId;
            this.socket.join(lobbyId);

            this.eventEmmiter.toUser(userId, "lobby", lobbyId);

            this.logger.log(
                `Użytkownik o id ${userId} dołączył do pokoju #${lobbyId}.`,
            );

            this.eventHelper.sendLobbyData(lobbyId);
        } catch (error) {
            this.eventEmmiter.toUserError(userId, error);
        }
    }

    onLeaveLobby({ userId }) {
        try {
            const user = this.userManager.getUser(userId);
            const lobby = this.lobbyManager.getLobby(user.lobbyId);
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
        try {
            const user = this.userManager.getUser(userId);
            const lobby = this.lobbyManager.getLobby(user.lobbyId);
            const { minPlayers, maxPlayers } = lobby.gameType;
            const userCount = lobby.users.size;
            if (!lobby.isAdmin(userId)) throw new UserNotAdminError();

            if (
                userCount < minPlayers ||
                userCount > maxPlayers
            ){
                throw new WrongNumberOfPlayersError();
            }
                
            const users = [...lobby.users].map(
                (userId) => this.userManager.getUser(userId),
            );
            // const colorsDuplicates =
            //     new Set(userColors).size != userColors.length;
            const colorsInUse = new Set()
            for (const user of users) {
                if (!user.color) throw new PlayerLacksColorError();
                if (colorsInUse.has(user.color)) throw new ColorsDuplicatedError();
                colorsInUse.add(user.color);
            }
            // if (colorsDuplicates) throw new ColorsDuplicatedError();
            if (users.some(user => !user.isReady)) throw new UsersNotReadyError();
            const players = [];
            for (const userId of lobby.users) {
                const user = this.userManager.getUser(userId);
                const player = {
                    publicId: user.publicId,
                    color: user.color,
                    username: user.name,
                };
                players.push(player);
            }
            const gameName = lobby.start(players);
            this.eventEmmiter.toLobby(lobby.id, "game", {
                game: gameName,
                lobbyId: lobby.id,
            });
            this.logger.log(`Gra ${gameName} została wystartowana.`);
        } catch (error) {
            this.eventEmmiter.toUserError(userId, error);
        }
    }

    onLobbyDataRequest({ userId }) {
        try {
            const user = this.userManager.getUser(userId);
            const lobby = this.lobbyManager.getLobby(user.lobbyId);

            if (!lobby) {
                // Jak użytkownik odświeża stronę, a był w lobby, to serwer wyrzuca go z lobby
                // Ale jednocześnie klient ładuje komponent z lobby zanim serwer go ponownie przekieruje na homepage
                // Z tego powodu wysyła ponownie event z prośbą o dane, jednak lobby już nie istnieje
                // Na chwilę obecną ignorujemy wysyłany event
                throw new LobbyDoesNotExistError();
            }

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
                currentUser: user.publicId,
                availableColors: colors,
                gameData: lobby.gameType,
            };
            this.eventEmmiter.toUser(userId, "lobbyData", lobbyData);
        } catch (error) {
            if (error instanceof LobbyDoesNotExistError) return;
            this.eventEmmiter.toUserError(userId, error);
        }
    }

    onRemoveUser({ userId, data: { userToKickPublicId } }) {
        try {
            const user = this.userManager.getUser(userId);
            const lobby = this.lobbyManager.getLobby(user.lobbyId);
            if (userId != lobby.admin) {
                throw new UserNotAdminError(userId);
            }
            const userIdToKick =
                this.userManager.getUserIdByPublicId(userToKickPublicId);
            lobby.removeUser(userIdToKick);

            this.eventEmmiter.toUser(userId, "info", {
                info: `Pomyślnie usunięto gracza z pokoju.`,
            });
            this.eventEmmiter.toUser(userIdToKick, "homepage", {
                error: `Zostałeś wyrzucony z pokoju`,
            });

            this.eventHelper.sendLobbyData(lobby.id);
        } catch (error) {
            this.eventEmmiter.toUserError(userId, error);
        }
    }
}
