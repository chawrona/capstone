import Player from "./Player.js";

export default class Game {
    constructor(players, endGame) {
        this.endGame = endGame;
        this.players = new Map();
        this.playersQueue = [];
        this.currentPlayerIndex = 0;
        this.data = {};
        this.createPlayers(players);
        this.createTurnOrder();
        this.initializeGameData();
        this.disconnectedPlayers = new Set();
        this.paused = false;
    }

    initializeGameData() {
        this.data.addedWood = 0;
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
        for (const player of players) {
            const newPlayer = new Player(
                player.username,
                player.color,
                player.publicId,
            );
            newPlayer.setData("wood", () => 5);
            this.players.set(player.publicId, newPlayer);
            this.playersQueue.push(player.publicId);
        }
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
            data: this.data,
        };
    }

    addWood(data) {
        const player = this.players.get(data.publicId);
        player.setData("wood", (oldWood) => oldWood + 5);
        this.data.addedWood++;
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
            data: this.data,
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
        this.disconnectedPlayers.delete(userId);
        if (this.disconnectedPlayers.size === 0) {
            this.paused = false;
            return true;
        }
        return false;
    }
}
