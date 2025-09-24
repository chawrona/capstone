import LobbyManager from "../managers/LobbyManager";
import UserManager from "../managers/UserManager";
import EventEmmiter from "../services/EventEmmiter";

export default class GameEvents {
    // Pamiętajcie o komentarzach z rzeczami do poprawy na githubie, bo pojawiły się nowe, a one nie były omawiane na spotkaniu

    constructor() {
        // Dodajcie socket, oraz wywołanie metody rejestrującej eventy
        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
        this.eventEmmiter = new EventEmmiter();
    }

    // Metoda rejestrująca eventy

    onGameData({ userId, data }) {
        const user = this.userManager.getUser(userId);
        const lobby = this.lobbyManager.getLobby(user.lobbyId);
        // Tę linijkę niżej Wy napisaliście i w sumie jest bardzo fajna, podoba mi się.
        data.publicId = user.publicId;
        const targets = lobby.game.processGameData(data);
        // (O chuj Dawidowi chodzi, że napisał że linijka kodu jest bardzo fajna xD Chłopa totalnie pojebało już)

        for (const targetObject of targets) {
            if (targetObject.target === "lobby") {
                this.eventEmmiter.toRoom(
                    // 1 użyć tutaj id lobby użytkownika, który przysłał nam event
                    targetObject.data.lobby.id,
                    targetObject.eventName,
                    targetObject.data,
                );
            } else if (targetObject.eventName === "error") {
                const userId = this.userManager.getUserIdByPublicId(
                    targetObject.data.publicId,
                );
                // 2a targetObject dla eventName "error" ma pole error, a nie data
                this.eventEmmiter.toUserError(userId, targetObject.data.error);
                // 2b Jak bylibyście tacy mili to zróbcie proszę funkcję toPublicUserError,
                // która dosłownie jedynie co robi to bierze to userId na podstawie publicId i wywołuje toUserError.
                // Analogicznie tak jak toPublicUser nie robi nic innego jak tylko bierze userId na podstawie publicId i calluje toUser
            } else {
                // 3 użyć toPublicUser
                const userId = this.userManager.getUserIdByPublicId(
                    targetObject.data.publicId,
                );
                this.eventEmmiter.toUser(
                    userId,
                    targetObject.eventName,
                    targetObject.data,
                );
            }
        }
    }
}
