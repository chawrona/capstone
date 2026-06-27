import games from "../config/games.json" with { type: "json" };
import ColorDuplicatedError from "../errors/ColorDuplicatedError.js";
import GameDoesNotExistError from "../errors/GameDoesNotExistError.js";
import LobbyDoesNotExistError from "../errors/LobbyDoesNotExistError.js";
import PlayerLacksColorError from "../errors/PlayerLacksColorError.js";
import UserCountMismatchError from "../errors/UserCountMismatchError.js";
import UserNotAdminError from "../errors/UserNotAdminError.js";
import UsersNotReadyError from "../errors/UsersNotReadyError.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmitter from "../services/EventEmitter.js";
import EventHelper from "../services/EventHelper.js";
import Logger from "../services/Logger.js";
import parseCookie from "../utils/parseCookie.js";

export default class LobbyEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
        this.lobbyManager = new LobbyManager();
        this.userManager = new UserManager();
        this.eventEmitter = new EventEmitter();
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
        this.socket.on("changeGame", (payload) => this.onChangeGame(payload));
        this.socket.on("onEndGame", (payload) => this.onEndGame(payload));
    }

    onLeaveLobby() {
        const userId = parseCookie(
            this.socket.handshake.headers.cookie,
            "userId",
        );
        try {
            const user = this.userManager.getUser(userId);
            const lobby = this.lobbyManager.getLobby(user.lobbyId);

            this.eventHelper.checkIfLobbyActive(lobby);

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
            this.eventEmitter.toUserError(userId, error);
        }
    }

    onGameStart() {
        const userId = parseCookie(
            this.socket.handshake.headers.cookie,
            "userId",
        );
        try {
            const user = this.userManager.getUser(userId);
            const lobby = this.lobbyManager.getLobby(user.lobbyId);

            this.eventHelper.checkIfLobbyActive(lobby);

            const { minPlayers, maxPlayers } = lobby.gameInfo;
            const userCount = lobby.users.size;

            if (!lobby.isAdmin(userId)) throw new UserNotAdminError();

            console.log(process.env.DEVELOPMENT);

            if (
                process.env.DEVELOPMENT !== "true" &&
                (userCount < minPlayers || userCount > maxPlayers)
            ) {
                throw new UserCountMismatchError();
            }

            const users = [...lobby.users].map((userId) =>
                this.userManager.getUser(userId),
            );

            const colorsInUse = new Set();
            for (const user of users) {
                if (!user.color) throw new PlayerLacksColorError();
                if (colorsInUse.has(user.color))
                    throw new ColorDuplicatedError();
                colorsInUse.add(user.color);
            }

            if (
                users.some((user) => !user.isReady && !lobby.isAdmin(user.id))
            ) {
                // => to return
                throw new UsersNotReadyError();
            }

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

            const gameTitle = lobby.start(players);
            this.eventEmitter.toLobby(lobby.id, "game", {
                gameTitle: gameTitle,
                lobbyId: lobby.id,
            });

            this.logger.log(`Gra ${gameTitle} została wystartowana.`);
        } catch (error) {
            console.log(error);
            this.eventEmitter.toUserError(userId, error);
        }
    }

    onLobbyDataRequest() {
        const userId = parseCookie(
            this.socket.handshake.headers.cookie,
            "userId",
        );
        try {
            const user = this.userManager.getUser(userId);

            const lobbyData = this.eventHelper.createLobbyData(user.lobbyId);

            if (lobbyData instanceof LobbyDoesNotExistError) {
                throw lobbyData;
            }

            this.eventEmitter.toUser(userId, "lobbyData", {
                ...lobbyData,
                currentUser: user.publicId,
            });
        } catch (error) {
            // Jak użytkownik odświeża stronę, a był w lobby, to serwer wyrzuca go z lobby
            // Ale jednocześnie klient ładuje komponent z lobby zanim serwer go ponownie
            // przekieruje na homepage Z tego powodu wysyła ponownie event z prośbą o dane,
            // jednak lobby już nie istnieje. Na chwilę obecną ignorujemy wysyłany event
            if (error instanceof LobbyDoesNotExistError) return;
            this.eventEmitter.toUserError(userId, error);
        }
    }

    onRemoveUser({ data: { userToKickPublicId } }) {
        const userId = parseCookie(
            this.socket.handshake.headers.cookie,
            "userId",
        );
        try {
            const user = this.userManager.getUser(userId);
            const lobby = this.lobbyManager.getLobby(user.lobbyId);

            this.eventHelper.checkIfLobbyActive(lobby);

            if (userId !== lobby.admin) {
                throw new UserNotAdminError();
            }
            const userIdToKick =
                this.userManager.getUserIdByPublicId(userToKickPublicId);
            lobby.removeUser(userIdToKick);

            this.eventEmitter.toUser(userId, "info", {
                info: `Pomyślnie usunięto gracza z pokoju.`,
            });
            this.eventEmitter.toUser(userIdToKick, "homepage", {
                error: `Zostałeś wyrzucony z pokoju`,
            });

            this.eventHelper.sendLobbyData(lobby.id);
        } catch (error) {
            this.eventEmitter.toUserError(userId, error);
        }
    }

    onEndGame() {
        const userId = parseCookie(
            this.socket.handshake.headers.cookie,
            "userId",
        );
        try {
            const user = this.userManager.getUser(userId);
            const lobby = this.lobbyManager.getLobby(user.lobbyId);

            // Póki niewiadomo czy działają gry to każdy może skończyć
            // if (userId !== lobby.admin) {
            //     throw new UserNotAdminError();
            // }

            lobby.endGame();

            this.eventEmitter.toUser(userId, "lobby", lobby.id);

            this.eventHelper.sendLobbyData(lobby.id);
        } catch (error) {
            this.eventEmitter.toUserError(userId, error);
        }
    }

    onChangeGame({ data: { gameTitle } }) {
        const userId = parseCookie(
            this.socket.handshake.headers.cookie,
            "userId",
        );
        try {
            const user = this.userManager.getUser(userId);
            const lobby = this.lobbyManager.getLobby(user.lobbyId);

            this.eventHelper.checkIfLobbyActive(lobby);

            const gameInfo = games.find((game) => game.title === gameTitle);

            if (!gameInfo) {
                throw new GameDoesNotExistError();
            }

            for (const userId of lobby.users) {
                const user = this.userManager.getUser(userId);
                user.isReady = false;
                user.color = null;
            }

            lobby.gameInfo = gameInfo;
            this.eventHelper.sendLobbyData(lobby.id);
        } catch (error) {
            if (error instanceof LobbyDoesNotExistError) return;
            if (error instanceof GameDoesNotExistError) return;
            this.eventEmitter.toUserError(userId, error);
        }
    }
}
