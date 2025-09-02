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
    }

    onInitialRequest(redirectRequest) {
        const userId = redirectRequest.userId;
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
            this.userManager.createUser(userId, this.socket.id);
            this.eventHelper.isLobbyIdGiven(userId, lobbyId);
        }
    }

    onDisconnect() {
        const { userId } = this.socket.data;
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
        }

        user.lobbyId = null;
        user.isReady = false;
    }
}
