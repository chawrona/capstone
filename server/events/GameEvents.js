import LobbyManager from "../managers/LobbyManager";
import UserManager from "../managers/UserManager";
import EventEmmiter from "../services/EventEmmiter";

export default class GameEvents {
    // Pamiętajcie o komentarzach z rzeczami do poprawy na githubie, bo pojawiły się nowe, a one nie były omawiane na spotkaniu

    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
        this.eventEmmiter = new EventEmmiter();
    }

    registerEvents() {
        this.socket.on("GameData", (payload) => this.onGameData(payload));
    }

    onGameData({ userId, data }) {
        const user = this.userManager.getUser(userId);
        const lobby = this.lobbyManager.getLobby(user.lobbyId);
        data.publicId = user.publicId;
        const targets = lobby.game.processGameData(data);

        for (const targetObject of targets) {
            if (targetObject.target === "lobby") {
                this.eventEmmiter.toRoom(user.lobbyId, targetObject.eventName, targetObject.data);
            } else if (targetObject.eventName === "error") {
                this.eventEmmiter.toPublicUserError(targetObject.target, targetObject.error);
            } else {
                this.eventEmmiter.toPublicUser(targetObject.target, targetObject.eventName, targetObject.data);
            }
        }
    }
}
