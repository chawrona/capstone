import UserHandler from "../handlers/UserHandler.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventEmmiter from "../services/EventEmmiter.js";

export default class UserEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
        this.eventEmmiter = new EventEmmiter();
        this.userHandler = new UserHandler();
        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
    }

    registerEvents() {
        this.socket.on("initialRequest", (redirectRequest) =>
            this.onInitalRequest(redirectRequest),
        );
        this.socket.on("disconnect", () => this.onDisconnect());
    }

        onInitalRequest(redirectRequest) {               
        const userId = redirectRequest.userId;       // przypisanie zmiennej userId wartości z pola userId obiektu o nazwie redirectRequest
        this.socket.data.userId = userId; 

        if (!redirectRequest.data) return;                       // zwraca true albo false w zależności od tego czy obiekt this.userManager w polu users (this.userManager.users), który jest mapą,
                                                                 // przechowuje wartość pod kluczem którym jest to konkretne id użytkownika
        const lobbyId = redirectRequest.data.lobbyId;  // do zmiennej user przypisujemy obekt instancji klasy User

        if (this.userManager.doesUserExist(userId)) {  // zwracam id usera jeżeli istnieje
            const user = this.userManager.getUser(userId);   // zmiennej user przypisuje userId obiektu
            if (user.hasLobby(lobbyId)) {                     // sprawdzam czy user ma lobby
                this.socket.join(user.lobbyId);        // Dołączam (socket) usera do pokoju o id user.lobbyId
                this.eventEmmiter.toUser(userId, "brianboru");  // event o nazwie 'brianboru' do usera o id 'userId'
            } else {
                this.isLobbyIdGiven(userId, lobbyId);  // sprawdzamy czy frontend wysłał nam informację do jakiego lobby chce dołączyć
            }
        } else { 
            this.userHandler.addUser(userId, this.socket.id); 
            this.isLobbyIdGiven(userId, lobbyId); 
        }
    }

    isLobbyIdGiven(userId, lobbyId) {
        if (lobbyId) { // frontend przekazał id lobby
            if (this.lobbyManager.canJoinLobby(lobbyId)) { // trzeba zmienic canJoinLobby na inne bo zawsze zwraca true (a my chcemy dostac informacje o tym czy mozna czy nie)
                const user = this.userManager.getUser(userId); // dostajemy obiekt usera
                user.lobbyId = lobbyId;
                this.socket.join(lobbyId)
                this.eventEmmiter.toUser(userId, "lobby");
            } else {
                this.eventEmmiter.toUser(userId, "homepage", { //  W tym konkretnym wypadku dołączamy dane, danymi jest obiekt, który ma pole error, a wartością pod tym polem jest string "500"
                    error: "500",
                });
            }
        } else {
            this.eventEmmiter.toUser(userId, "homepage");
        }
    }

    onDisconnect() {
        const { userId } = this.socket.data;

        if (!userId) return;

        const lobby = this.lobbyManager.getLobby(userId);

        if (lobby) {
            lobby.users.delete(userId);
            if (lobby.users.size <= 0) {
                this.lobbyManager.deleteLobby(lobby.id);
            }
        }

        const user = this.userManager.getUser(userId);
        if (user) user.lobbyId = null;
    }
}