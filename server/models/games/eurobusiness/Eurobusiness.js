import getRandomNumber from "../../../utils/getRandomNumber.js";
import Game from "../../Game.js";
import chanceCards from "../eurobusiness/config/chanceCards.json" with { type: "json" };
import communityCards from "../eurobusiness/config/communityCards.json" with { type: "json" };
import actions from "../eurobusiness/interfaces/actions.js";
import chanceCardTypes from "../eurobusiness/interfaces/chanceCardTypes.js";
import communityCardTypes from "../eurobusiness/interfaces/communityCardTypes.js";
import tileTypes from "../eurobusiness/interfaces/tileTypes.js";
import EurobusinessMap from "../eurobusiness/modules/EurobusinessMap.js";
import EurobusinessEventFactory from "./modules/EurobusinessEventFactory.js";

export default class Eurobusiness extends Game {
    constructor(players, endGame) {
        super(players, endGame);
        this.events = new EurobusinessEventFactory(this);
        this.logs = [];
    }

    addLog(message) {
        this.logs.push(message);
        if (this.logs.length > 19) {
            this.logs.shift();
        }
    }

    initializeGameData() {
        this.gameData.availableActions = [actions.rollDice];
        this.gameData.dublets = 0;
        this.gameData.rollResult = [3, 5];
        this.gameData.currentMessage = `${this.getCurrentPlayer().username} rzuca kośćmi`;
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
            const position = player.getData("position");

            if (!playersPositions[position]) {
                playersPositions[position] = [];
            }

            playersPositions[position].push(publicId);
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
                this.gameData.currentMessage = `${this.getCurrentPlayer().username} kończy turę`;
                this.gameData.availableActions = [actions.endTurn];
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

        const isDublet = diceResult[0] === diceResult[1];

        if (this.gameData.dublets === 2 && isDublet) {
            this.playerToJail(player);
            return this.events.rollPackage();
        }

        let wasPlayerInJail = false;
        if (player.getData("inJail")) {
            this.gameData.availableActions = ["rollDice"];
            if (isDublet) {
                this.addLog(
                    `${player.username} wyrzucił dublet (${diceResult[0]}, ${diceResult[1]}). Wychodzi z więzienia.`,
                );
                player.setData("outOfJailAttempts", () => 1);
                player.setData("inJail", () => false);
                wasPlayerInJail = true;
            } else {
                player.setData("outOfJailAttempts", (attempts) => attempts + 1);

                this.addLog(
                    `${player.username} wyrzucił ${diceResult[0]} oraz ${diceResult[1]}. Nie wychodzi z więzienia.`,
                );

                if (player.getData("outOfJailAttempts") === 3) {
                    this.gameData.availableActions = ["endTurn"];
                    this.gameData.currentMessage = `${this.getCurrentPlayer().username} nie wychodzi z więzienia. Oczekiwanie na koniec tury.`;
                } else {
                    this.gameData.currentMessage = `${this.getCurrentPlayer().username} wychodzi z więzienia. Próba (${player.getData("outOfJailAttempts")}/3)`;
                }
                return this.events.rollPackage();
            }
        }

        const hasCompletedLap = this.gameMap.movePlayer(
            player,
            diceResult[0] + diceResult[1],
        );

        if (hasCompletedLap) {
            player.setData("money", (money) => money + 200);
            this.addLog(
                `${player.username} otrzymał 200$ za przejście przez start.`,
            );
        }

        this.gameData.rollResult = diceResult;

        const tile = this.gameMap.getCurrentPlayerTile(player);
        this.executeTileAction(tile);

        if (isDublet && !wasPlayerInJail) {
            this.addLog(
                `${player.username} wyrzucił dublet (${diceResult[0]}, ${diceResult[1]}). Idzie na pole ${tile.name}.`,
            );
        } else if (!isDublet && !wasPlayerInJail) {
            this.addLog(
                `${player.username} wyrzucił ${diceResult[0] + diceResult[1]}. Idzie na pole ${tile.name}.`,
            );
        } else if (wasPlayerInJail) {
            this.addLog(`Idzie na pole ${tile.name}.`);
        }

        return this.events.rollPackage();
    }

    endTurn(data) {
        this.checkIfActionPossible(data.publicId, actions.endTurn);
        this.gameData.availableActions = [actions.rollDice];

        const currentPlayer = this.getCurrentPlayer();

        if (this.gameData.rollResult[0] === this.gameData.rollResult[1]) {
            this.gameData.dublets += 1;
            this.gameData.currentMessage = `${this.getCurrentPlayer().username} ponownie rzuca kośćmi`;
        } else {
            this.nextTurn();
            this.gameData.currentMessage = `${this.getCurrentPlayer().username} rzuca kośćmi`;
        }

        if (currentPlayer.getData("inJail")) {
            this.gameData.currentMessage = `${this.getCurrentPlayer().username} wychodzi z więzienia`;
            this.gameData.availableActions = [
                actions.rollDice,
                actions.payJail,
                actions.useOutOfJailCard,
            ];
        }

        this.addLog(`${this.getCurrentPlayer().username} zakończył turę.`);
        this.addLog("hr");
        return [
            this.events.currentMessage(),
            this.events.yourTurn(data.publicId, false),
            this.events.yourTurn(this.getCurrentPlayerPublicId(), true),
            this.events.availableActions(),
            this.events.logs(),
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
        this.addLog(`${player.username} idzie do więzienia.`);
        this.gameData.availableActions = [actions.endTurn];

        return [this.events.logs()];
    }

    payJail(data) {
        this.checkIfActionPossible(data.publicId, actions.payJail);
        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.getData("money") < 50) {
            return [this.events.info("Nie masz wystarczająco pieniędzy.")];
        }

        currentPlayer.setData("money", (money) => money - 50);

        this.addLog(
            `${currentPlayer.username} płaci 50$ za wyjście z więzienia.`,
        );

        this.gameData.availableActions = [actions.rollDice];

        return [
            this.events.currentMessage(),
            this.events.availableActions(),
            this.events.logs(),
        ];
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

        this.addLog(
            `${currentPlayer.username} użył karty wyjścia z więzienia.`,
        );

        this.gameData.availableActions = [actions.rollDice];

        return [
            this.events.currentMessage(),
            this.events.availableActions(),
            this.events.logs(),
        ];
    }

    payTax(data) {
        this.checkIfActionPossible(data.publicId, actions.payTax);
        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.getData("money") < 100) {
            return [this.events.info("Nie masz wystarczająco pieniędzy")];
        }

        currentPlayer.setData("money", (money) => money - 100);

        this.addLog(`${currentPlayer.username} płaci podatek (100$).`);

        this.gameData.availableActions = [actions.endTurn];

        return [
            this.events.currentMessage(),
            this.events.availableActions(),
            this.events.logs(),
        ];
    }

    payIncomeTax(data) {
        this.checkIfActionPossible(data.publicId, actions.payIncomeTax);
        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.getData("money") < 150) {
            return [this.events.info("Nie masz wystarczająco pieniędzy")];
        }

        currentPlayer.setData("money", (money) => money - 150);

        this.addLog(`${currentPlayer.username} płaci 150$ podatku`);

        this.gameData.availableActions = [actions.endTurn];

        return [
            this.events.currentMessage(),
            this.events.availableActions(),
            this.events.logs(),
        ];
    }

    pickChanceCard() {
        const currentPlayer = this.getCurrentPlayer();
        const randomIndex = getRandomNumber(0, chanceCards.length);
        const card = chanceCards[randomIndex];
        this.addLog(`${currentPlayer.username} wylosował kartę ${card.name}.`);
        switch (card.type) {
            case chanceCardTypes.goToStart:
                currentPlayer.setData("position", () => 0);
                this.addLog(`${currentPlayer.username} idzie na start.`);
                break;
            case chanceCardTypes.goToTile:
                currentPlayer.setData("position", () => getRandomNumber(0, 40));
                this.executeTileAction(
                    this.gameMap.getCurrentPlayerTile(currentPlayer),
                );
                this.addLog(
                    `${currentPlayer.username} stanął na polu ${this.gameMap.getCurrentPlayerTile(currentPlayer).name}.`,
                );
                break;
            case chanceCardTypes.goToJail:
                this.playerToJail(currentPlayer);
                break;
            case chanceCardTypes.payTaxes:
                this.gameData.availableActions = [actions.payTax];
                break;
            case chanceCardTypes.withdrawCashFromBank:
                currentPlayer.setData("money", (money) => money + 50);
                this.addLog(`${currentPlayer.username} pobiera z banku 50$.`);
                break;
            case chanceCardTypes.getOutOfJail:
                currentPlayer.setData(
                    "outOfJailCard",
                    (outOfJailCard) => outOfJailCard + 1,
                );
                break;
            case chanceCardTypes.payForBuildingProperties:
                break;
            case chanceCardTypes.takeMoneyFromPlayer:
                break;
        }

        return [
            this.events.logs(),
            this.events.playersPosition(),
            this.events.currentMessage(),
            this.events.availableActions(),
            this.events.chanceCard(card),
        ];
    }

    pickCommunityCard() {
        const currentPlayer = this.getCurrentPlayer();
        const randomIndex = getRandomNumber(0, communityCards.length);
        const card = communityCards[randomIndex];
        this.addLog(`${currentPlayer.username} wylosował kartę ${card.name}.`);
        switch (card.type) {
            case communityCardTypes.withdrawCashFromBank:
                currentPlayer.setData("money", (money) => money + 50);
                this.addLog(`${currentPlayer.username} pobiera z banku 50$.`);
                break;
            case communityCardTypes.goToJail:
                this.playerToJail(currentPlayer);
                break;
            case communityCardTypes.getOutOfJail:
                currentPlayer.setData(
                    "outOfJailCard",
                    (outOfJailCard) => outOfJailCard + 1,
                );
                break;
            case communityCardTypes.payTaxes:
                this.gameData.availableActions = [actions.payTax];
                break;
        }

        return [
            this.events.logs(),
            this.events.playersPosition(),
            this.events.currentMessage(),
            this.events.availableActions(),
            this.events.communityCard(card),
        ];
    }
}
