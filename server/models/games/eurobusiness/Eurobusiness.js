import Game from "../../Game.js";
import actions from "../eurobusiness/interfaces/actions.js";

export default class Eurobusiness extends Game {
    constructor(players, endGame) {
        super(players, endGame);
    }

    initializeGameData() {
        this.gameData.availableActions = [actions.rollDice];
    }

    getPlayersPositions() {
        const playersPositions = {};

        for (const [publicId, player] of this.players) {
            playersPositions[publicId] = player.getData("position");
        }

        return playersPositions;
    }

    getAvailableActions() {
        return this.gameData.availableActions;
    }

    gameDataRequest(data) {
        return [
            this._dataWithPlayerTarget(data.publicId),
            {
                target: data.publicId,
                eventName: "gameDataRequest",
                data: {
                    yourTurn:
                        data.publicId ===
                        this.playersQueue[this.currentPlayerIndex],
                    playersData: this.getPlayersData(),
                    playersPosition: this.getPlayersPositions(),
                    gameMap: this.gameMap,
                    availableActions: this.getAvailableActions(),
                    rollResult: this.gameData.rollResult,
                    yourPublicId: data.publicId,
                    currentMessage: this.gameData.currentMessage,
                },
            },
        ];
    }
}
