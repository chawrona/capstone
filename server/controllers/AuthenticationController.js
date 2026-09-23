import express from "express";

import BugReportLimitError from "../errors/BugReportLimitError.js";
import InvalidBugReportError from "../errors/InvalidBugReportError.js";
import LobbyDoesNotExistError from "../errors/LobbyDoesNotExistError.js";
import UserDoesNotExistError from "../errors/UserDoesNotExistError.js";
import UserInLobbyError from "../errors/UserInLobbyError.js";
import LobbyManager from "../managers/LobbyManager.js";
import UserManager from "../managers/UserManager.js";
import BugReportLimiter from "../services/BugReportLimiter.js";
import EventHelper from "../services/EventHelper.js";
import Logger from "../services/Logger.js";
import generateUUID from "../utils/generateUuid.js";
import parseCookie from "../utils/parseCookie.js";

export default class AuthenticationController {
    constructor() {
        this.router = express.Router();
        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManager();
        this.eventHelper = new EventHelper();
        this.bugReportLimiter = new BugReportLimiter();
        this.logger = new Logger();

        this.initRoutes();
    }

    initRoutes() {
        this.router.post("/authentication", (req, res) =>
            this.authenticateUser(req, res),
        );
        this.router.post("/joinLobby", (req, res) => this.joinLobby(req, res));
        this.router.post("/bugReport", (req, res) => this.bugReport(req, res));
    }

    bugReport(req, res) {
        try {
            const userId = parseCookie(req.headers.cookie, "userId");

            if (!userId || !this.userManager.doesUserExist(userId)) {
                throw new UserDoesNotExistError();
            }

            const message = this.bugReportLimiter.validate(req.body?.message);
            this.bugReportLimiter.check(userId);

            this.logger.bugReport({ userId, message });
            this.bugReportLimiter.register(userId);

            return res.status(200).json({
                message: "Informacja o błędzie została wysłana",
            });
        } catch (error) {
            if (error instanceof BugReportLimitError) {
                return res.status(429).json({ message: error.message });
            }
            if (
                error instanceof InvalidBugReportError ||
                error instanceof UserDoesNotExistError
            ) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({
                message: "Nie udało się wysłać zgłoszenia.",
            });
        }
    }

    joinLobby(req, res) {
        try {
            let requestedLobbyId = req.body?.lobbyId;
            let userId = parseCookie(req.headers.cookie, "userId");
            console.log(req.headers.cookie);

            if (!userId) throw new UserDoesNotExistError();

            if (!this.userManager.doesUserExist(userId)) {
                this.userManager.createUser(userId);
            }

            console.log({ requestedLobbyId });

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

            this.eventHelper.sendLobbyData(requestedLobbyId);

            return res.status(200).json({
                redirect: `/${requestedLobbyId}`,
                lobbyId: requestedLobbyId,
                message: "Gracz dołączył do pokoju",
            });
        } catch (error) {
            return res.status(400).json({
                redirect: null,
                message: error.message,
            });
        }
    }

    attemptJoinByLink(userId, requestedLobbyId, res) {
        if (!requestedLobbyId) return null;

        try {
            const lobby = this.lobbyManager.getLobby(requestedLobbyId);

            this.connectToLobby(userId, lobby.id);

            return res.status(200).json({
                redirect: `/${lobby.id}`,
                lobbyId: lobby.id,
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
            return null;
        }
    }

    connectToLobby(userId, lobbyId) {
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

                const joinResult = this.attemptJoinByLink(
                    userId,
                    requestedLobbyId,
                    res,
                );
                if (joinResult) return joinResult;

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
                        lobbyId: lobby.id,
                        message: "Powrót do trwającej gry",
                    });
                } else {
                    return res.status(200).json({
                        redirect: `/${lobby.id}`,
                        lobbyId: lobby.id,
                        message: "Powrót do trwającej gry",
                    });
                }
            }

            const joinResult = this.attemptJoinByLink(
                userId,
                requestedLobbyId,
                res,
            );
            if (joinResult) return joinResult;

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
