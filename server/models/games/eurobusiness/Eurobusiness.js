import getRandomNumber from "../../../utils/getRandomNumber.js";
import Game from "../../Game.js";
import actions from "../eurobusiness/interfaces/actions.js";
import EurobusinessMap from "../eurobusiness/modules/EurobusinessMap.js";

export default class Eurobusiness extends Game {
    constructor(players, endGame) {
        super(players, endGame);
    }

    initializeGameData() {
        this.gameData.availableActions = [actions.rollDice];
        this.gameMap = new EurobusinessMap();
    }

    setPlayerData(player) {
        player.setData("position", () => 0);
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
            {
                target: data.publicId,
                eventName: "gameDataRequest",
                data: {
                    yourTurn:
                        data.publicId ===
                        this.playersQueue[this.currentPlayerIndex],
                    playersData: this.getPlayersData(),
                    playersPosition: this.getPlayersPositions(),
                    gameMap: this.gameMap.tiles
                    availableActions: this.getAvailableActions(),
                    rollResult: this.gameData.rollResult,
                    yourPublicId: data.publicId,
                    currentMessage: this.gameData.currentMessage,
                },
            },
        ];
    }

    getCurrentPlayerPublicId() {
        return this.playersQueue[this.currentPlayerIndex];
    }

    getCurrentPlayer() {
        return this.players.get(this.playersQueue[this.currentPlayerIndex]);
    }

    rollDice(data) {
        this.checkIfActionPossible(data.publicId, actions.rollDice);
        const diceResult = getRandomNumber(1, 6);
        const player = this.getCurrentPlayer();
        const hasCompletedLap = this.gameMap.movePlayer(player, diceResult);

        if (hasCompletedLap) {
            console.log("Okrążył");
        }

        this.gameData.rollResult = diceResult;
        return [
            {
                target: "lobby",
                eventName: "rollResult",
                data: this.gameData.rollResult,
            },
            {
                target: data.publicId,
                eventName: "availableActions",
                data: this.getAvailableActions(),
            },
            {
                target: "lobby",
                eventName: "playersPosition",
                data: this.getPlayersPositions(),
            },
        ];
    }

    endTurn(data) {
        this.checkIfActionPossible(data.publicId, actions.endTurn);

        if (this.gameData.rollResult !== 6) {
            this.nextTurn();
        }

        return [
            {
                target: "lobby",
                eventName: "currentMessage",
                data: this.gameData.currentMessage,
            },
            {
                target: data.publicId,
                eventName: "yourTurn",
                data: false,
            },
            {
                target: this.getCurrentPlayerPublicId(),
                eventName: "yourTurn",
                data: true,
            },
            {
                target: this.getCurrentPlayerPublicId(),
                eventName: "availableActions",
                data: this.getAvailableActions(),
            },
        ];
    }

    checkIfActionPossible(publicId, checkedAction) {
        if (publicId !== this.currentPlayerPublicId()) {
            throw new Error("Poczekaj na swoją turę.");
        }

        if (
            !this.gameData.availableActions.some(
                (action) => action === checkedAction,
            )
        ) {
            throw new Error("Nie możesz wykonać tej akcji");
        }
    }
}
