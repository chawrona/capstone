import express from "express";

import LobbyDoesNotExistError from "../errors/LobbyDoesNotExistError.js";
import UserDoesNotExistError from "../errors/UserDoesNotExistError.js";
import UserInLobbyError from "../errors/UserInLobbyError.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import EventHelper from "../services/EventHelper.js";
import generateUUID from "../utils/generateUuid.js";
import parseCookie from "../utils/parseCookie.js";

export default class AuthenticationController {
    constructor() {
        this.router = express.Router();
        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
        this.eventHelper = new EventHelper();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post("/authentication", (req, res) =>
            this.authenticateUser(req, res),
        );
        this.router.post("/joinLobby", (req, res) => this.joinLobby(req, res));
    }

    joinLobby(req, res) {
        try {
            let requestedLobbyId = req.body?.lobbyId;
            let userId = parseCookie(req.headers.cookie, "userId");
            if (!userId) throw new UserDoesNotExistError();

            if (requestedLobbyId === "create") {
                const lobby = this.lobbyManager.createLobby();
                const lobbyId = lobby.id;
                const user = this.userManager.getUser(userId);
                user.color = null;
                user.lobbyId = lobbyId;
                lobby.joinUser(userId);
                lobby.admin = userId;
                if (process.env.DEVELOPMENT === "true") {
                    user.color = {
                        name: "crimson",
                        hex: "#d72638",
                    };
                }
                requestedLobbyId = lobbyId;
            } else {
                this.connectToLobby(userId, requestedLobbyId);
            }

            return res.status(200).json({
                redirect: `/${requestedLobbyId}`,
                message: "Gracz dołączył do pokoju",
            });
        } catch (error) {
            return res.status(400).json({
                redirect: null,
                message: error.message,
            });
        }
    }

    connectToLobby(userId, lobbyId) {
        if (process.env.DEVELOPMENT === "true") {
            lobbyId = this.lobbyManager.lobbies.entries().next().value[0];
        }

        const lobby = this.lobbyManager.getLobby(lobbyId);

        const user = this.userManager.getUser(userId);

        if (process.env.DEVELOPMENT === "true") {
            const colorMap = {
                1: { name: "blue", hex: "#3b82f6" },
                2: { name: "green", hex: "#22c55e" },
            };
            user.color = colorMap[lobby.users.size] || {
                name: "yellow",
                hex: "#facc15",
            };
        }

        if (user.lobbyId) throw new UserInLobbyError();

        if (!process.env.DEVELOPMENT) {
            user.color = null;
        }

        lobby.joinUser(userId);
        user.lobbyId = lobbyId;
    }

    authenticateUser(req, res) {
        try {
            let userId = parseCookie(req.headers.cookie, "userId");

            const requestedLobbyId = req.body?.lobbyId;

            if (!userId) {
                userId = generateUUID();
                res.cookie("userId", userId, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                console.log("Stworzono Ciasteczko");
            }

            if (!this.userManager.doesUserExist(userId)) {
                this.userManager.createUser(userId);
                console.log("Użytkownik nie istniał. Został stworzony");

                if (requestedLobbyId) {
                    try {
                        const lobby =
                            this.lobbyManager.getLobby(requestedLobbyId);

                        this.joinLobby(userId, lobby.id);

                        return res.status(200).json({
                            redirect: `/${lobby.id}`,
                            message: "Gracz dołączył do czyjegoś pokoju",
                        });
                    } catch (error) {
                        if (error instanceof LobbyDoesNotExistError) {
                            return res.status(400).json({
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

                if (lobby.isActive) {
                    return res.status(200).json({
                        redirect: `/${lobby.id}/${lobby.gameInfo.title}`,
                        message: "Powrót do trwającej gry",
                    });
                } else {
                    return res.status(200).json({
                        redirect: `/${lobby.id}`,
                        message: "Powrót do trwającej gry",
                    });
                }
            }

            return res.status(200).json({
                redirect: null,
                message: "Połączono pomyślnie, brak aktywnej gry",
            });
        } catch (error) {
            return res.status(500).json({
                redirect: null,
                message: error.message,
            });
        }
    }

    getRouter() {
        return this.router;
    }
}
