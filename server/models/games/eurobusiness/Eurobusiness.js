import getRandomNumber from "../../../utils/getRandomNumber.js";
import Game from "../../Game.js";
import chanceCards from "../eurobusiness/config/chanceCards.json" with { type: "json" };
import communityCards from "../eurobusiness/config/communityCards.json" with { type: "json" };
import actions from "../eurobusiness/interfaces/actions.js";
import chanceCardTypes from "../eurobusiness/interfaces/chanceCardTypes.js";
import communityCardTypes from "../eurobusiness/interfaces/communityCardTypes.js";
import tileTypes from "../eurobusiness/interfaces/tileTypes.js";
import EurobusinessMap from "../eurobusiness/modules/EurobusinessMap.js";
import Timer from "../eurobusiness/modules/Timer.js";
import EurobusinessEventFactory from "./modules/EurobusinessEventFactory.js";

export default class Eurobusiness extends Game {
    constructor(players, endGame) {
        super(players, endGame);
        this.events = new EurobusinessEventFactory(this);
        this.logs = [];
        this.timer = new Timer();
        this.startTimer();
        this.leaderboard = [];
        this.gameEnded = false;
    }

    startTimer(data) {
        setInterval(() => {
            this.timer.subtract(1);
            this.endTimerConsequences(data);
        }, 1000);
    }

    endTimerConsequences(data) {
        if (this.timer.isTimerZero()) {
            if (this.gameData.availableActions.includes(actions.auction)) {
                this.endAuction();
            } else if (
                this.gameData.availableActions.includes(actions.endTurn)
            ) {
                this.endTurn(data);
            } else if (
                this.gameData.availableActions.includes(actions.rollDice)
            ) {
                this.rollDice(data);
            } else if (
                this.gameData.availableActions.includes(actions.payTax)
            ) {
                this.payTax(data);
            } else if (
                this.gameData.availableActions.includes(actions.payIncomeTax)
            ) {
                this.payIncomeTax(data);
            } else if (
                this.gameData.availableActions.includes(actions.payRent)
            ) {
                this.payRent(data);
            } else if (
                this.gameData.availableActions.includes(actions.payJail)
            ) {
                this.payJail(data);
            }
        }
    }

    endAuction() {
        this.timer.setTimer(30);
        const player = this.getCurrentPlayerPublicId(
            this.gameData.auction.winningPlayer,
        );
        const tile = this.gameMap.getTile(this.gameData.auction.tileIndex);

        player.setData("money", (money) => money - this.gameData.auction.price);
        this.setOwnership(player, this.gameData.auction.tileIndex);
        this.addLog(
            `${player.username} wylicytował <i>${tile.name}</i> za <b>${tile.price}$</b>.`,
        );
        this.gameData.availableActions = [actions.endTurn];
        this.gameData.currentMessage = `${this.getCurrentPlayer().username} kończy turę`;

        this.useEventEmmiter([
            this.events.availableActions(),
            this.events.logs(),
            this.events.currentMessage(),
            this.events.playersData(),
        ]);
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
        this.timer.setTimer(60);
        this.gameData.auction = {
            price: 0,
            winningPlayer: null,
            tileIndex: 0,
            cannotBid: null,
        };
    }

    setPlayerData(player) {
        player.setData("position", () => 0);
        player.setData("inJail", () => false);
        player.setData("outOfJailCard", () => 0);
        player.setData("money", () => 9999);
        player.setData("ownerships", () => new Set());
        player.setData("outOfJailAttempts", () => 0);
        player.setData("lost", () => false);
    }

    setOwnership(player, position) {
        this.gameMap.ownerships.set(position, player.publicId);
        player.setData("ownerships", (set) => {
            set.add(position);
            return set;
        });
    }

    removeOwnership(player, position) {
        this.gameMap.ownerships.delete(position);
        player.setData("ownerships", (set) => {
            set.delete(position);
            return set;
        });
    }

    getOwnerId(position) {
        return this.gameMap.ownerships.get(position);
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

    getPlayer(publicId) {
        return this.players.get(publicId);
    }

    gameDataRequest(data) {
        return [this.events.gameDataRequest(data.publicId)];
    }

    executeTileAction(tile) {
        switch (tile.type) {
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
                this.gameData.currentMessage = `${this.getCurrentPlayer().username} płaci podatek`;
                this.gameData.availableActions = [actions.payTax];
                break;
            case tileTypes.incomeTax:
                this.gameData.currentMessage = `${this.getCurrentPlayer().username} płaci podatek dochodowy`;
                this.gameData.availableActions = [actions.payIncomeTax];
                break;
            case tileTypes.chanceCard:
                this.gameData.currentMessage = `${this.getCurrentPlayer().username} losuje kartę szansy`;
                this.gameData.availableActions = [actions.pickChanceCard];
                break;
            case tileTypes.communityCard:
                this.gameData.currentMessage = `${this.getCurrentPlayer().username} losuje kartę społeczności`;
                this.gameData.availableActions = [actions.pickCommunityCard];
                break;
            case tileTypes.building:
                this.buildingAction();
                break;
        }
    }

    buildingAction() {
        const player = this.getCurrentPlayer();
        const position = player.getData("position");
        const currentTileOwnerId = this.getOwnerId(position);
        if (!currentTileOwnerId) {
            this.gameData.currentMessage = `${this.getCurrentPlayer().username} zastanawia się nad zakupem`;
            this.gameData.availableActions = [
                actions.buyBuilding,
                actions.refuseToBuyBuilding,
            ];
        } else if (currentTileOwnerId === player.publicId) {
            this.gameData.currentMessage = `${this.getCurrentPlayer().username} kończy turę`;
            this.addLog(
                `${this.getCurrentPlayer().username} stanął na swoim polu`,
            );
            this.gameData.availableActions = [actions.endTurn];
        } else {
            this.gameData.currentMessage = `${this.getCurrentPlayer().username} płaci czynsz.`;
            this.addLog(
                `${this.getCurrentPlayer().username} stanął na polu gracza ${this.players[currentTileOwnerId]}`,
            );
            this.gameData.availableActions = [actions.payRent];
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
        this.timer.addTimeIfLessThan(30, 30);
        let wasPlayerInJail = false;
        if (player.getData("inJail")) {
            this.gameData.availableActions = [actions.rollDice];
            if (isDublet) {
                this.addLog(
                    `${player.username} wyrzucił dublet <b>(${diceResult[0]}, ${diceResult[1]})</b>. Wychodzi z więzienia.`,
                );
                player.setData("outOfJailAttempts", () => 0);
                player.setData("inJail", () => false);
                wasPlayerInJail = true;
            } else {
                player.setData("outOfJailAttempts", (attempts) => attempts + 1);

                this.addLog(
                    `${player.username} wyrzucił <b>${diceResult[0]}</b> oraz <b>${diceResult[1]}</b>. Nie wychodzi z więzienia.`,
                );

                if (player.getData("outOfJailAttempts") === 3) {
                    this.gameData.availableActions = [actions.endTurn];
                    this.gameData.currentMessage = `${this.getCurrentPlayer().username} nie wychodzi z więzienia.`;
                    player.setData("outOfJailAttempts", () => 0);
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
                `${player.username} otrzymał <b>200$</b> za przejście przez <b>Start</b>.`,
            );
        }

        this.gameData.rollResult = diceResult;

        const position = player.getData("position");
        const tile = this.gameMap.getTile(position);

        if (isDublet && !wasPlayerInJail) {
            this.addLog(
                `${player.username} wyrzucił dublet <b>(${diceResult[0]}, ${diceResult[1]})</b>. Idzie na pole <i>${tile.name}</i>.`,
            );
        } else if (!isDublet && !wasPlayerInJail) {
            this.addLog(
                `${player.username} wyrzucił <b>${diceResult[0] + diceResult[1]}</b>. Idzie na pole <i>${tile.name}</i>.`,
            );
        } else if (wasPlayerInJail) {
            this.addLog(`Idzie na pole <i>${tile.name}</i>.`);
        }

        this.executeTileAction(tile);

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
        this.timer.setTimer(60);
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
        if (this.getCurrentPlayer().getData("lost")) {
            throw new Error("Przegrałeś, brak dostępnych akcji");
        }

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
        this.timer.addTime(30);
        this.addLog(`${player.username} idzie do <b>więzienia</b>.`);
        this.gameData.availableActions = [actions.endTurn];
        this.gameData.dublets = 0;

        return [this.events.logs()];
    }

    payJail(data) {
        this.checkIfActionPossible(data.publicId, actions.payJail);
        const currentPlayer = this.getCurrentPlayer();
        this.timer.addTime(30);

        if (currentPlayer.getData("money") < 50) {
            return [
                this.events.info("Nie masz wystarczająco pieniędzy."),
                this.gameOver(currentPlayer),
            ];
        }

        currentPlayer.setData("money", (money) => money - 50);

        this.addLog(
            `${currentPlayer.username} płaci <b>50$</b> za wyjście z <b>więzienia</b>.`,
        );

        this.gameData.availableActions = [actions.rollDice];

        return [
            this.events.currentMessage(),
            this.events.availableActions(),
            this.events.logs(),
            this.events.playersData(),
        ];
    }

    useOutOfJailCard(data) {
        this.checkIfActionPossible(data.publicId, actions.useOutOfJailCard);
        const currentPlayer = this.getCurrentPlayer();
        this.timer.addTime(30);

        if (currentPlayer.getData("outOfJailCard") < 1) {
            return [this.events.info("Nie masz karty wyjścia z więzienia")];
        }

        currentPlayer.setData(
            "outOfJailCard",
            (outOfJailCard) => outOfJailCard - 1,
        );

        this.addLog(
            `${currentPlayer.username} użył karty <b>Wyjście z Więzienia</b>.`,
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
        this.timer.addTime(30);

        if (currentPlayer.getData("money") < 100) {
            return [
                this.events.info("Nie masz wystarczająco pieniędzy"),
                this.gameOver(currentPlayer),
            ];
        }

        currentPlayer.setData("money", (money) => money - 100);

        this.addLog(`${currentPlayer.username} płaci podatek <b>100$</b>.`);

        this.gameData.availableActions = [actions.endTurn];

        return [
            this.events.currentMessage(),
            this.events.availableActions(),
            this.events.logs(),
            this.events.playersData(),
        ];
    }

    payIncomeTax(data) {
        this.checkIfActionPossible(data.publicId, actions.payIncomeTax);
        const currentPlayer = this.getCurrentPlayer();
        this.timer.addTime(30);

        if (currentPlayer.getData("money") < 150) {
            return [
                this.events.info("Nie masz wystarczająco pieniędzy"),
                this.gameOver(currentPlayer),
            ];
        }

        currentPlayer.setData("money", (money) => money - 150);

        this.addLog(`${currentPlayer.username} płaci <b>150$</b> podatku`);

        this.gameData.availableActions = [actions.endTurn];

        return [
            this.events.currentMessage(),
            this.events.availableActions(),
            this.events.logs(),
            this.events.playersData(),
        ];
    }

    payRent(data) {
        this.checkIfActionPossible(data.publicId, actions.payRent);
        const player = this.getCurrentPlayer();
        const position = player.getData("position");
        const tile = this.gameMap.getTile(position);
        const owner = this.players.get(this.getOwnerId(position));

        if (player.getData("money") < tile.rent) {
            return [
                this.events.info("Nie masz wystarczająco pieniędzy"),
                this.gameOver(player, owner),
            ];
        }

        player.setData("money", (money) => money - tile.rent);
        owner.setData("money", (money) => money + tile.rent);
        this.addLog(
            `${player.username} płaci <b>${tile.rent}$</b> graczowi ${owner.username}.`,
        );
        this.gameData.availableActions = [actions.endTurn];
        return [
            this.events.availableActions(),
            this.events.logs(),
            this.events.playersData(),
        ];
    }

    buyBuilding(data) {
        this.checkIfActionPossible(data.publicId, actions.buyBuilding);
        const player = this.getCurrentPlayer();
        const position = player.getData("position");
        const tile = this.gameMap.getTile(position);

        if (player.getData("money") < tile.price) {
            return [this.events.info("Nie masz wystarczająco pieniędzy")];
        }

        player.setData("money", (money) => money - tile.price);
        this.setOwnership(player, position);
        this.addLog(
            `${player.username} kupił <i>${tile.name}</i> za <b>${tile.price}$</b>.`,
        );
        this.gameData.availableActions = [actions.endTurn];
        this.gameData.currentMessage = `${this.getCurrentPlayer().username} kończy turę`;
        return [
            this.events.availableActions(),
            this.events.logs(),
            this.events.currentMessage(),
            this.events.playersData(),
        ];
    }

    refuseToBuyBuilding(data) {
        this.checkIfActionPossible(data.publicId, actions.refuseToBuyBuilding);
        const player = this.getCurrentPlayer();
        const position = player.getData("position");
        const tile = this.gameMap.getTile(position);
        this.addLog(
            `${player.username} rozpoczął licytację pola <i>${tile.name}</i>.`,
        );
        this.gameData.availableActions = [actions.auction];
        this.gameData.currentMessage = "Licytacja";
        this.gameData.auction = {
            price: tile.price / 2,
            winningPlayer: null,
            tileIndex: position,
            cannotBid: player.publicId,
        };
        this.timer.setTimer(20);

        return [
            this.events.availableActions(),
            this.events.logs(),
            this.events.currentMessage(),
            this.events.auction(),
        ];
    }

    auction(data) {
        if (data.publicId === this.gameData.auction.cannotBid) {
            return [this.events.info("Nie możesz licytować", data.publicId)];
        }
        const bidIncrement = data.bidIncrement;
        const player = this.getPlayer(data.publicId);
        if (
            player.getData("money") <
            this.gameData.auction.price + bidIncrement
        ) {
            return [this.events.info("Nie masz wystarczająco pieniędzy")];
        }
        this.gameData.auction.price =
            this.gameData.auction.price + bidIncrement;
        this.gameData.auction.winningPlayer = data.publicId;
        this.timer.addTimeIfLessThan(5, 10);
        if (this.timer.getTimer() > 10) this.timer.setTimer(10);
        return [this.events.logs(), this.events.auction()];
    }

    pickChanceCard() {
        const currentPlayer = this.getCurrentPlayer();
        const position = currentPlayer.getData("position");
        const randomIndex = getRandomNumber(0, chanceCards.length - 1);
        const card = chanceCards[randomIndex];
        this.timer.addTime(30);
        this.addLog(
            `${currentPlayer.username} wylosował kartę <b>${card.name}</b>.`,
        );
        switch (card.type) {
            case chanceCardTypes.goToStart:
                currentPlayer.setData("position", () => 0);
                currentPlayer.setData("money", (money) => money + 200);
                this.addLog(`${currentPlayer.username} idzie na <b>Start.</b>`);
                this.addLog(
                    `${currentPlayer.username} otrzymał <b>200$</b> za przejście przez <b>Start</b>.`,
                );
                break;
            case chanceCardTypes.goToTile:
                currentPlayer.setData("position", () => getRandomNumber(0, 40));
                this.executeTileAction(this.gameMap.getTile(position));
                this.addLog(
                    `${currentPlayer.username} idzie na pole <b>${this.gameMap.getTile(position).name}</b>.`,
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
                this.addLog(
                    `${currentPlayer.username} pobiera z banku <b>50$</b>.`,
                );
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
        const randomIndex = getRandomNumber(0, communityCards.length - 1);
        const card = communityCards[randomIndex];
        this.timer.addTime(30);
        this.log(JSON.stringify({ card, randomIndex, communityCards }));

        this.addLog(
            `${currentPlayer.username} wylosował kartę <b>${card.name}</b>.`,
        );
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
                this.gameData.currentMessage = `${currentPlayer.username} płaci podatek <b>50$</b>`;
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

    gameOver(loser, opponent) {
        const currentPlayer = this.getCurrentPlayer();
        currentPlayer.setData("lost", () => true);

        const possesions = currentPlayer.getData("ownerships");

        if (opponent !== undefined) {
            for (const position of possesions) {
                this.removeOwnership(currentPlayer, position);
                this.setOwnership(opponent, position);
            }

            const outOfJailCards = currentPlayer.getData("outOfJailCard");
            currentPlayer.setData("outOfJailCard", () => 0);
            opponent.setData(
                "outOfJailCard",
                (outOfJailCard) => outOfJailCard + outOfJailCards,
            );

            const cash = currentPlayer.getData("money");
            currentPlayer.setData("money", () => 0);
            opponent.setData("money", (money) => money + cash);
            this.addLog(
                `${currentPlayer.username} zbankrutował na rzecz gracza ${opponent.username}.`,
            );
        } else {
            for (const position of possesions) {
                this.removeOwnership(currentPlayer, position);
            }

            currentPlayer.setData("outOfJailCard", () => 0);

            currentPlayer.setData("money", () => 0);
            this.addLog(`${currentPlayer.username} zbankrutował`);
        }

        this.leaderboard.unshift(currentPlayer.publicId);

        let playersLeft = 0;

        for (const [, player] of this.players) {
            if (!player.getData("lost")) {
                playersLeft += 1;
            }
        }

        if (playersLeft === 1) {
            this.gameData.currentMessage = this.leaderboard;
            this.events.currentMessage();
            this.gameEnded = true;
            // Tutaj powinno się całe lobby zafreezować czy coś takiego
        }

        this.gameData.availableActions = [actions.rollDice];
        this.timer.setTimer(60);
        this.nextTurn();

        while (this.getCurrentPlayer().getData("lost")) {
            this.nextTurn();
        }

        return [
            this.events.currentMessage(),
            this.events.yourTurn(loser.publicId, false),
            this.events.yourTurn(this.getCurrentPlayerPublicId(), true),
            this.events.availableActions(),
            this.events.logs(),
            this.events.playersData(),
        ];
    }
}
