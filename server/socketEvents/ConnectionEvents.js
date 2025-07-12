import LobbyHandler from "../handlers/LobbyHandler.js";
import UserManager from "../managers/UserManager.js";
import EventEmmiter from "../services/EventEmmiter.js";

export default class ConnectionEvents {
    constructor(socket) {
        this.socket = socket;
        this.registerEvents();
    }
    registerEvents() {
        this.socket.on("authorization", this.authorization);
        this.socket.on("disconnect", this.disconnect);
        this.socket.on("connection", this.connect);
    }
    authorization(redirectRequest) {
        const userId = redirectRequest.UUID;
        const lobbyId = redirectRequest.data.lobbyId;
        const userManager = new UserManager()
        if (userManager.doesUserExist(userId)){
            const lobbyHandler = new LobbyHandler()
            if(lobbyHandler.doesUserHaveLobby()){

            } else{

            }
        } else{
            userManager.createUser();
        }
    }
    disconnect() {
        console.log("disconnected");
    }
    connect() {
        console.log("Połączono");
        // const ee = new EventEmmiter();
        // ee.toAll("connect", "connected");
    }
    isLobbyIdGiven(userId,lobbyId){
        if(lobbyId){

        } else{
            const ee = new EventEmmiter()
            const socketId = 
        }
    }
}
