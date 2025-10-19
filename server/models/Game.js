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
        this.setPlayersData();
        this.initializeGameData();
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

    nextTurn() {
        this.currentPlayerIndex++;
        if (this.currentPlayerIndex === this.playersQueue.length) {
            this.currentPlayerIndex = 0;
        }
    }

    processGameData(data) {
        try {
            return this[data.eventName](data);
        } catch {
            return [
                {
                    target: data.publicId,
                    eventName: "error",
                    data: new Error("Nieprawidłowa akcja"),
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

    pause() {
        console.log("pause");
    }

    resume() {
        console.log("resume");
    }
}
