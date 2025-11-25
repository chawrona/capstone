import getRandomNumber from "../../../utils/getRandomNumber.js";
import Game from "../../Game.js";
import actions from "../eurobusiness/interfaces/actions.js";
import tileTypes from "../eurobusiness/interfaces/tileTypes.js";
import EurobusinessMap from "../eurobusiness/modules/EurobusinessMap.js";
import EurobusinessEventFactory from "./modules/EurobusinessEventFactory.js";

export default class Eurobusiness extends Game {
    constructor(players, endGame) {
        super(players, endGame);
        this.events = new EurobusinessEventFactory(this);
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
        player.setData("money", () => 1500);
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

    getCurrentPlayerPublicId() {
        return this.playersQueue[this.currentPlayerIndex];
    }

    getCurrentPlayer() {
        return this.players.get(this.playersQueue[this.currentPlayerIndex]);
    }

    gameDataRequest(data) {
        return [this.events.gameDataRequest(data.publicId)];
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
            case tileTypes.tax:
                this.gameData.availableActions = [actions.payTax];
                break;
            case tileTypes.incomeTax:
                this.gameData.availableActions = [actions.payIncomeTax];
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
                this.events.currentMessage(),
                this.events.availableActions(),
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
            this.events.currentMessage(),
            this.events.rollResult(this.gameData.rollResult),
            this.events.availableActions(),
            this.events.playersPosition(),
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
            this.events.currentMessage(),
            this.events.yourTurn(data.publicId, false),
            this.events.yourTurn(this.getCurrentPlayerPublicId(), true),
            this.events.availableActions(),
        ];
    }

    checkIfActionPossible(publicId, checkedAction) {
        if (publicId !== this.getCurrentPlayerPublicId()) {
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
        this.checkIfActionPossible(data.publicId, actions.payJail);
        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.getData("money") < 50) {
            return [this.events.info("Nie masz wystarczająco pieniędzy")];
        }

        currentPlayer.setData("money", (money) => money - 50);

        this.gameData.availableActions = [actions.rollDice];

        return [this.events.currentMessage(), this.events.availableActions()];
    }

    useOutOfJailCard(data) {
        this.checkIfActionPossible(data.publicId, actions.useOutOfJailCard);
        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.getData("outOfJailCard") < 1) {
            return [this.events.info("Nie masz karty wyjścia z więzienia")];
        }

        currentPlayer.setData(
            "outOfJailCard",
            (outOfJailCard) => outOfJailCard - 1,
        );

        this.gameData.availableActions = [actions.rollDice];

        return [this.events.currentMessage(), this.events.availableActions()];
    }

    payTax(data) {
        this.checkIfActionPossible(data.publicId, actions.payTax);
        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.getData("money") < 100) {
            return [this.events.info("Nie masz wystarczająco pieniędzy")];
        }

        currentPlayer.setData("money", (money) => money - 100);

        this.gameData.availableActions = [actions.endTurn];

        return [this.events.currentMessage(), this.events.availableActions()];
    }

    payIncomeTax(data) {
        this.checkIfActionPossible(data.publicId, actions.payIncomeTax);
        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.getData("money") < 150) {
            return [this.events.info("Nie masz wystarczająco pieniędzy")];
        }

        currentPlayer.setData("money", (money) => money - 150);

        this.gameData.availableActions = [actions.endTurn];

        return [this.events.currentMessage(), this.events.availableActions()];
    }
}
