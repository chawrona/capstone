import Game from "../../Game.js";

export default class Craftsmen extends Game {
    constructor(players, endGame, lobbyId, playerClass) {
        super(players, endGame, lobbyId, playerClass);
    }

    generateGameData(publicId) {
        const player = this.getPlayer(publicId);

        return [
            {
                target: publicId,
                eventName: "gameData",
                data: {
                    you: player.generateData(),
                },
            }
        ];
    }

    gameDataRequest(data) {
        console.log("request");

        return this.generateGameData(data.publicId);
    }
}
