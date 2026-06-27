import express from "express";

import LobbyDoesNotExistError from "../errors/LobbyDoesNotExistError.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import generateUUID from "../utils/generateUuid.js";

export default class AuthorizationController {
    constructor() {
        this.router = express.Router();
        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post("/authentication", (req, res) =>
            this.authenticateUser(req, res),
        );
    }

    authenticateUser(req, res) {
        let userId = req.cookies?.userId;
        const requestedLobbyId = req.body?.lobbyId;

        if (!userId) {
            userId = generateUUID();
            res.cookie("userId", userId, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
        }

        if (!this.userManager.doesUserExist(userId)) {
            // sprawdź czy lobby istnieje, jeżeli tak to go przekieruj na to lobby,
            // a socket.io już go wrzuci do odpowiedniego pokoju przy nawiązywaniu połączenia.
            if (requestedLobbyId) {
                try {
                    const lobby = this.lobbyManager.getLobby(requestedLobbyId);

                    return res.status(200).json({
                        redirect: `/${lobby.id}`,
                        message: "Gracz dołączył do czyjegoś pokoju",
                    });
                } catch (error) {
                    if (error instanceof LobbyDoesNotExistError) {
                        return res.status(200).json({
                            redirect: null,
                            message:
                                "Pokój, do którego gracz chciał dołączyć, nie istnieje",
                        });
                    }
                }
            }

            return res.status(200).json({
                redirect: null,
                message: "Połączono pomyślnie, brak aktywnej gry",
            });
        }

        const user = this.userManager.getUser(userId);

        // Jeżeli ma lobby, to MUSI być w grze, bo inaczej socket by go wywalił z lobby
        if (user.hasLobby()) {
            const lobby = this.lobbyManager.getLobby(user.lobbyId);

            return res.status(200).json({
                redirect: `/${lobby.id}/${lobby.gameInfo.title}`,
                message: "Powrót do trwającej gry",
            });
        }

        return res.status(200).json({
            redirect: null,
            message: "Połączono pomyślnie, brak aktywnej gry",
        });
    }

    getRouter() {
        return this.router;
    }
}
