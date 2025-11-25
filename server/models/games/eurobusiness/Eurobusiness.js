import getRandomNumber from "../../../utils/getRandomNumber.js";
import Game from "../../Game.js";
import actions from "../eurobusiness/interfaces/actions.js";
import tileTypes from "../eurobusiness/interfaces/tileTypes.js";
import EurobusinessMap from "../eurobusiness/modules/EurobusinessMap.js";
import tiles from "./config/tiles.json" with { type: "json" };

export default class Eurobusiness extends Game {
    constructor(players, endGame) {
        super(players, endGame);
    }

    initializeGameData() {
        this.gameData.availableActions = [actions.rollDice];
        this.gameData.dublets = 0;
        this.gameData.rollResult = [3, 5];
        this.gameData.currentMessage = "Start";
        this.gameMap = new EurobusinessMap();
    }

    setPlayerData(player) {
        player.setData("position", () => 0);
        player.setData("inJail", () => false);
        player.setData("outOfJailCard", () => 0);
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
                    gameMap: tiles,
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

    executeTileAction(tile) {
        switch (tile.name) {
            case tileTypes.default:
            case tileTypes.start:
            case tileTypes.parking:
            case tileTypes.jail:
                break;
            case tileTypes.goToJail:
                this.playerToJail(this.getCurrentPlayer());
                break;
        }
    }

    rollDice(data) {
        this.checkIfActionPossible(data.publicId, actions.rollDice);
        const diceResult = [getRandomNumber(1, 6), getRandomNumber(1, 6)];
        const player = this.getCurrentPlayer();

        if (this.gameData.dublets === 2 && diceResult[0] === diceResult[1]) {
            this.playerToJail(player);
            return [
                {
                    target: "lobby",
                    eventName: "currentMessage",
                    data: this.gameData.currentMessage,
                },
                {
                    target: this.getCurrentPlayerPublicId(),
                    eventName: "availableActions",
                    data: this.getAvailableActions(),
                },
            ];
        }

        const hasCompletedLap = this.gameMap.movePlayer(
            player,
            diceResult[0] + diceResult[1],
        );

        if (hasCompletedLap) {
            console.log("Okrążył");
        }

        this.gameData.rollResult = diceResult;

        const tile = this.gameMap.getCurrentPlayerTile(player);
        this.executeTileAction(tile);

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
        this.gameData.availableActions = [actions.rollDice];

        const currentPlayer = this.getCurrentPlayer();

        if (this.gameData.rollResult[0] === this.gameData.rollResult[1]) {
            this.gameData.dublets += 1;

            this.nextTurn();

            if (currentPlayer.getData("inJail")) {
                this.gameData.availableActions = [
                    actions.rollDice,
                    actions.payJail,
                    actions.useOutOfJailCard,
                ];
            }
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

    playerToJail(player) {
        player.setData("inJail", () => true);
        player.setData("position", () => 10);

        this.gameData.availableActions = [actions.endTurn];
    }

    payJail(data) {
        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.getData("money") < 50) {
            return {
                target: data.publicId,
                eventName: "info",
                data: "Nie masz wystarczająco pieniędzy",
            };
        }

        currentPlayer.setData("money", (money) => money - 50);

        this.gameData.availableActions = [actions.rollDice];

        return [
            {
                target: "lobby",
                eventName: "currentMessage",
                data: this.gameData.currentMessage,
            },
            {
                target: this.getCurrentPlayerPublicId(),
                eventName: "availableActions",
                data: this.getAvailableActions(),
            },
        ];
    }

    useOutOfJailCard(data) {
        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.getData("outOfJailCard") < 1) {
            return {
                target: data.publicId,
                eventName: "info",
                data: "Nie masz karty wyjścia z więzienia",
            };
        }

        currentPlayer.setData(
            "outOfJailCard",
            (outOfJailCard) => outOfJailCard - 1,
        );

        this.gameData.availableActions = [actions.rollDice];

        return [
            {
                target: "lobby",
                eventName: "currentMessage",
                data: this.gameData.currentMessage,
            },
            {
                target: this.getCurrentPlayerPublicId(),
                eventName: "availableActions",
                data: this.getAvailableActions(),
            },
        ];
    }
}
