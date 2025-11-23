import Game from "../../Game.js";
import gameMap from "../eurobusiness/config/gameMap.json" with { type: "json" };
import actions from "../eurobusiness/interfaces/actions.js";

export default class Eurobusiness extends Game {
    constructor(players, endGame) {
        super(players, endGame);
        this.actions = actions;
        this.gameMap = gameMap;
    }

    initializeGameData() {
        this.gameData.availableActions = [actions.rollDice, actions.endTurn];
    }

    getPlayersPositions() {
        const playersPositions = {};

        for (const player of this.players) {
            playersPositions[player.publicId] = player.getData("position");
        }

        return playersPositions;
    }

    getAvailableActions() {
        return this.gameData.availableActions;
    }

    getPlayersData() {
        const playersData = [];

        for (const player of this.players) {
            playersData.push(player.getPlayerData());
        }

        return playersData;
    }

    getDiceThrowResult() {
        // zamiast tego dodać do initialize game data? idk
        return Math.floor(Math.random() * 6) + 1;
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
                    rollResult: this.getDiceThrowResult(),
                    yourPublicId: data.publicId,
                    currentMessage: "???????????????????????",
                },
            },
        ];
    }
}
