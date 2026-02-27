import eventEmmiter from "../services/EventEmmiter.js";
import Logger from "../services/Logger.js";
import Player from "./Player.js";

export default class Game {
    constructor(players, endGame, lobbyId, playerClass) {
        this.playerClass = playerClass;
        this.endGame = endGame;
        this.players = new Map();
        this.playersQueue = [];
        this.currentPlayerIndex = 0;
        this.gameData = {};
        this.createPlayers(players);

        this.createTurnOrder();

        this.setPlayersData();

        this.initializeGameData();

        this.logger = new Logger();

        this.disconnectedPlayers = new Set();
        this.paused = false;
        this.gameEnded = false;
        this.lobbyId = lobbyId;
        this.eventEmmiter = new eventEmmiter();
        console.log("XD 2");
    }

    useEventEmmiter(targets) {
        try {
            for (const { target, eventName, data } of targets) {
                if (target === "lobby") {
                    this.eventEmmiter.toLobby(this.lobbyId, eventName, data);
                } else if (eventName === "error") {
                    this.eventEmmiter.toPublicUserError(target, data);
                } else {
                    this.eventEmmiter.toPublicUser(target, eventName, data);
                }
            }
        } catch (error) {
            this.eventEmmiter.toLobbyError(this.lobbyId, error);
        }
    }

    log(message) {
        this.logger.log(message);
    }

    initializeGameData() {
        this.gameData.addedWood = 0;
    }

    createTurnOrder() {
        for (let i = this.playersQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.playersQueue[i], this.playersQueue[j]] = [
                this.playersQueue[j],
                this.playersQueue[i],
            ];
        }
    }

    createPlayers(players) {
        const Constructor = this.playerClass || Player;

        for (const player of players) {
            const newPlayer = new Constructor(
                player.username,
                player.color,
                player.publicId,
            );

            this.players.set(player.publicId, newPlayer);
            this.playersQueue.push(player.publicId);
        }
    }

    setPlayersData() {
        let i = 1;
        for (const publicId of this.playersQueue) {
            const player = this.players.get(publicId);
            player.setData("turnOrder", () => i++);
            this.setPlayerData(player);
        }
    }

    setPlayerData(player) {
        player.setData("wood", () => 5);
    }

    getPlayersData() {
        const playersData = [];

        for (const [, player] of this.players) {
            playersData.push(player.getPlayerData());
        }

        return playersData.sort((a, b) => {
            return (
                this.playersQueue.indexOf(a.publicId) -
                this.playersQueue.indexOf(b.publicId)
            );
        });
    }

    nextTurn() {
        this.currentPlayerIndex++;
        if (this.currentPlayerIndex === this.playersQueue.length) {
            this.currentPlayerIndex = 0;
        }
    }

    processGameData(data) {
        try {
            if (this.paused && data.eventName !== "gameDataRequest") {
                throw new Error("Gra wstrzymana");
            }
            return this[data.eventName](data);
        } catch (error) {
            const errorMessage = error ? error.message : "Nieprawidłowa akcja";
            console.log(error);
            return [
                {
                    target: data.publicId,
                    eventName: "error",
                    data: new Error(errorMessage),
                },
            ];
        }
    }

    dataWithTarget() {
        return {
            target: "lobby",
            eventName: "gameData",
            data: this.gameData,
        };
    }

    addWood(data) {
        const player = this.players.get(data.publicId);
        player.setData("wood", (oldWood) => oldWood + 5);
        this.gameData.addedWood++;
        return [
            this.dataWithTarget(),
            {
                target: data.publicId,
                eventName: "wood",
                data: player.getData("wood"),
            },
        ];
    }

    sayHello(data) {
        return [
            {
                target: data.publicId,
                eventName: "hello",
                data: "Hello",
            },
        ];
    }

    dataWithPlayerTarget(publicId) {
        return {
            target: publicId,
            eventName: "gameData",
            data: this.gameData,
        };
    }

    gameDataRequest(data) {
        return [this.dataWithPlayerTarget(data.publicId)];
    }

    pause(userId) {
        this.disconnectedPlayers.add(userId);
        this.paused = true;
    }

    resume(userId) {
        console.log("Gra ponownie w toku");
        this.disconnectedPlayers.delete(userId);
        if (this.disconnectedPlayers.size === 0) {
            this.paused = false;
            return true;
        }
        return false;
    }

    getCurrentPlayerPublicId() {
        return this.playersQueue[this.currentPlayerIndex];
    }

    getCurrentPlayer() {
        return this.players.get(this.playersQueue[this.currentPlayerIndex]);
    }

    getPlayer(publicId) {
        return this.players.get(publicId);
    }
}
