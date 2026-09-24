import Game from "../../Game.js";

export default class YetAnotherHungarianDefense extends Game {
    constructor(players, endGame, lobbyId, playerClass) {
        super(players, endGame, lobbyId, playerClass);
        this.TPS = 20;
        this.gameSize = [1920, 1050];
    }

    initializeGameData() {
        setTimeout(() => {
            setInterval(() => this.tick(), 1000 / this.TPS);
        }, 3000);
    }

    tick() {
        this.useEventEmitter([
            {
                target: "lobby",
                eventName: "gameData",
                data: {
                    players: this.getPlayersData(),
                },
            },
        ]);

        // this.moveRandomly();
    }

    moveRandomly() {
        for (const [, player] of this.players) {
            player.moveRandomly();
        }
    }

    setPlayerData(player) {
        player.initalizeData();
    }

    // @event
    move(data) {
        const player = this.getPlayer(data.publicId);
        player.updatePosition(data);
    }

    gameDataRequest(data) {
        return [
            {
                target: data.publicId,
                eventName: "gameData",
                data: {
                    players: this.getPlayersData(),
                },
            },
        ];
    }
}
