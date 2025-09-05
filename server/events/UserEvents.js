import colors from "../config/colors.json" with { type: "json" };
import ColorDoesNotExistError from "../errors/ColorDoesNotExistError.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmmiter from "../services/EventEmmiter.js";
import EventHelper from "./EventHelper.js";

export default class UserEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
        this.eventEmmiter = new EventEmmiter();
        this.eventHelper = new EventHelper();
        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
    }

    registerEvents() {
        this.socket.on("initialRequest", (redirectRequest) =>
            this.onInitialRequest(redirectRequest),
        );
        this.socket.on("disconnect", () => this.onDisconnect());
        this.socket.on("changeUserColor", (payload) => {
            const { newColor } = payload.data;
            this.onChangeUserColor(newColor);
        });
    }

    onInitialRequest(redirectRequest) {
        const userId = redirectRequest.userId;
        let username = redirectRequest.data.username;
        this.socket.data.userId = userId;

        if (!redirectRequest.data) return;
        const lobbyId = redirectRequest.data.lobbyId;

        if (this.userManager.doesUserExist(userId)) {
            this.userManager.updateUserSocketId(userId, this.socket.id);
            const user = this.userManager.getUser(userId);
            if (user.hasLobby()) {
                this.socket.join(user.lobbyId);
                this.eventEmmiter.toUser(userId, "brianboru");
            } else {
                this.eventHelper.isLobbyIdGiven(userId, lobbyId);
            }
        } else {
            if (!this.eventHelper.validateUsername(username)) username = null;
            this.userManager.createUser(userId, this.socket.id, username);
            this.eventHelper.isLobbyIdGiven(userId, lobbyId);
        }
    }

    onChangeUserColor({ userId, data: { newColor } }) {
        try {
            const user = this.userManager.getUser(userId);
            if (!colors.includes(newColor)) {
                throw new ColorDoesNotExistError();
            }
            user.color = newColor;
            this.eventHelper.sendLobbyData(user.lobbyId);
        } catch (error) {
            this.eventEmmiter.toUserError(userId, error);
        }
    }

    onChangeUsername({ userId, data: { newUsername } }) {
        try {
            this.eventHelper.validateUsername(newUsername);

            const user = this.userManager.getUser(userId);

            user.name = newUsername.trim();

            this.eventHelper.sendLobbyData(user.lobbyId);
        } catch (error) {
            this.eventEmmiter.toUserError(userId, error);
        }
    }

    onToggleReady({ userId }) {
        const user = this.userManager.getUser(userId);
        user.isReady = !user.isReady;
        this.eventHelper.sendLobbyData(user.lobbyId);
    }

    onDisconnect() {
        const { userId } = this.socket.data;
        try {
            const user = this.userManager.getUser(userId);
            const lobby = this.lobbyManager.getLobby(user.lobbyId);

            if (lobby) {
                lobby.removeUser(userId);

                if (!lobby.getPlayerCount()) {
                    this.lobbyManager.deleteLobby(lobby.id);
                } else if (lobby.isAdmin) {
                    lobby.admin = [...lobby.users][0];
                    this.eventHelper.sendLobbyData(lobby.id);
                }

                this.socket.leave(lobby.id);
            }

            user.lobbyId = null;
            user.isReady = false;
        } catch (error) {
            this.eventEmmiter.toUserError(userId, error);
        }
    }
}
