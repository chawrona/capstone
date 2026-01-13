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
    constructor(players, endGame, lobbyId) {
        super(players, endGame, lobbyId);
        this.events = new EurobusinessEventFactory(this);
        this.logs = [];
        this.timer = new Timer(10);
        this.gameMap = new EurobusinessMap();
        this.startTimer();
        this.leaderboard = [];
    }

    initializeGameData() {
        this.gameData.availableActions = [actions.rollDice];
        this.gameData.dublets = 0;
        this.gameData.rollResult = [3, 5];
        this.gameData.currentMessage = `${this.getCurrentPlayer().username} rzuca kośćmi`;
        this.gameData.auction = {
            price: 0,
            winningPlayer: null,
            tile: null,
            cannotBid: null,
            cannotBidPlayerName: "",
        };
    }

    setPlayerData(player) {
        player.setData("position", () => 0);
        player.setData("inJail", () => false);
        player.setData("outOfJailCard", () => 0);
        player.setData("money", () => 550);
        player.setData("ownerships", () => new Set());
        player.setData("mortgagedCards", () => new Set());
        player.setData("outOfJailAttempts", () => 0);
        player.setData("wasInJail", () => false);
        player.setData("lost", () => false);
        player.setData("properties", () => new Map());
    }

    startTimer() {
        this.intervalId = setInterval(() => {
            if (!this.paused) {
                this.timer.subtract(1);
                const targets = this.endTimerConsequences();
                if (targets) {
                    this.useEventEmmiter(targets);
                }
            }
        }, 1000);
    }

    endTimerConsequences() {
        if (!this.timer.isTimerZero()) return;
        const availableActions = new Set(this.gameData.availableActions);
        const data = { publicId: this.getCurrentPlayerPublicId() };

        try {
            if (availableActions.has(actions.endTurn)) {
                this.logger.log("POCZĄTEK INNEJ KONSEKWENCJI");
                return this.endTurn(data);
            }
            if (availableActions.has(actions.rollDice)) {
                this.logger.log("POCZĄTEK INNEJ KONSEKWENCJI");
                return this.rollDice(data);
            }
            if (availableActions.has(actions.payTax)) {
                this.logger.log("POCZĄTEK PŁATNOŚCIOWEJ KONSEKWENCJI");
                return this.handleAutoPayment(this.payTax, data);
            }
            if (availableActions.has(actions.payHouseTax)) {
                this.logger.log("POCZĄTEK PŁATNOŚCIOWEJ KONSEKWENCJI");
                return this.handleAutoPayment(this.payHouseTax, data);
            }
            if (availableActions.has(actions.payIncomeTax)) {
                this.logger.log("POCZĄTEK PŁATNOŚCIOWEJ KONSEKWENCJI");
                return this.handleAutoPayment(this.payIncomeTax, data);
            }
            if (availableActions.has(actions.payRent)) {
                this.logger.log("POCZĄTEK PŁATNOŚCIOWEJ KONSEKWENCJI");
                return this.handleAutoPayment(this.payRent, data);
            }
            if (availableActions.has(actions.pickChanceCard)) {
                this.logger.log("POCZĄTEK INNEJ KONSEKWENCJI");
                return this.pickChanceCard(data);
            }
            if (availableActions.has(actions.pickCommunityCard)) {
                this.logger.log("POCZĄTEK INNEJ KONSEKWENCJI");
                return this.pickCommunityCard(data);
            }
            if (availableActions.has(actions.refuseToBuyBuilding)) {
                this.logger.log("POCZĄTEK INNEJ KONSEKWENCJI");
                return this.refuseToBuyBuilding(data);
            }
            if (availableActions.has(actions.auction)) {
                this.logger.log("POCZĄTEK INNEJ KONSEKWENCJI");
                return this.endAuction();
            }
        } catch (error) {
            const errorMessage = error ? error.message : "Nieprawidłowa akcja";
            return [
                {
                    target: data.publicId,
                    eventName: "error",
                    data: new Error(errorMessage),
                },
            ];
        }
    }

    handleAutoPayment(paymentAction, data) {
        const player = this.getCurrentPlayer();
        let targets;
        let hasNotEnoughMoney;
        do {
            this.logger.log("Robimy 'do' ");
            this.logger.log("Czekamy na czyjąś turę?");
            targets = paymentAction.call(this, data);
            this.logger.log("Jak nie wywaliło błędu to chyba nie");

            hasNotEnoughMoney = targets.some(
                (target) => target.eventName === "gameInfo",
            );

            if (
                player.getData("ownerships").size !==
                    player.getData("mortgagedCards").size &&
                hasNotEnoughMoney
            ) {
                this.logger.log("Zastawianko");
                const ownerships = [...player.getData("ownerships")];
                const mortgageCards = player.getData("mortgagedCards");

                let mostExpensiveTileIndex;
                for (const cardIndex of ownerships) {
                    if (!mortgageCards.has(cardIndex)) {
                        if (
                            mostExpensiveTileIndex === undefined ||
                            this.gameMap.getTile(cardIndex).position >
                                this.gameMap.getTile(mostExpensiveTileIndex)
                                    .position
                        ) {
                            mostExpensiveTileIndex = cardIndex;
                        }
                    }
                }

                const tileToMortgage = this.gameMap.getTile(
                    mostExpensiveTileIndex,
                );

                player.setData(
                    "money",
                    (money) => money + tileToMortgage.mortgage,
                );
                player.setData("mortgagedCards", (mortgagedCards) =>
                    mortgagedCards.add(mostExpensiveTileIndex),
                );
            } else if (hasNotEnoughMoney) {
                this.logger.log("Brak zastawianka");
                const opponent =
                    paymentAction === this.payRent
                        ? this.getTileOwner(player.getData("position"))
                        : undefined;
                this.logger.log(JSON.stringify({ opponent }));

                return this.gameOver(player, opponent);
            }
        } while (hasNotEnoughMoney);

        this.logger.log("KONIEC AUTO PAYMENTU");

        return targets;
    }

    // @event - special case - wywoływany nie przez gracza tylko metodę z timerem
    endAuction() {
        this.timer.setTimer(30);
        const tile = this.gameMap.getTile(this.gameData.auction.tile.position);

        if (this.gameData.auction.winningPlayer) {
            this.logger.log("2");
            const player = this.players.get(
                this.gameData.auction.winningPlayer.publicId,
            );
            this.logger.log("TUTAJ: ", player);

            player.setData(
                "money",
                (money) => money - this.gameData.auction.price,
            );
            this.setOwnership(player, this.gameData.auction.tile.position);
            this.addLog(
                `${player.username} wylicytował <i>${tile.name}</i> za <b>${tile.price}$</b>.`,
            );
        } else {
            this.addLog(`Nikt nie wylicytował <i>${tile.name}</i>.`);
        }
        this.gameData.currentMessage = `${this.getCurrentPlayer().username} kończy turę`;
        this.gameData.availableActions = [
            actions.endTurn,
            actions.mortgagePropertyCard,
            actions.redeemPropertyCard,
            actions.buildHouse,
            actions.sellHouse,
        ];

        return [
            this.events.closeDialogs(),
            this.events.availableActions(),
            this.events.logs(),
            this.events.currentMessage(),
            this.events.playersData(),
            this.events.time(),
        ];
    }

    addLog(message) {
        this.logs.push(message);
        if (this.logs.length > 25) {
            this.logs.shift();
        }
    }

    setOwnership(player, position) {
        this.gameMap.ownerships.set(position, player.publicId);
        player.setData("ownerships", (ownerships) => {
            ownerships.add(position);
            return ownerships;
        });
    }

    removeOwnership(player, position) {
        this.gameMap.ownerships.delete(position);
        player.setData("ownerships", (ownerships) => {
            ownerships.delete(position);
            return ownerships;
        });
    }

    getOwnerId(position) {
        return this.gameMap.ownerships.get(position);
    }

    getTileOwner(position) {
        this.logger.log("1");
        return this.players.get(this.getOwnerId(position));
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
        this.logger.log(
            "AKCJE: \n" + JSON.stringify(this.gameData.availableActions),
        );
        return this.gameData.availableActions;
    }

    getCurrentPlayerPublicId() {
        return this.playersQueue[this.currentPlayerIndex];
    }

    getCurrentPlayer() {
        console.log("3");

        return this.players.get(this.playersQueue[this.currentPlayerIndex]);
    }

    getPlayer(publicId) {
        this.logger.log("4");
        return this.players.get(publicId);
    }

    gameDataRequest(data) {
        return this.events.gameDataRequest(data.publicId);
    }

    executeTileAction(tile) {
        switch (tile.type) {
            case tileTypes.default:
            case tileTypes.start:
            case tileTypes.parking:
            case tileTypes.jail:
                this.gameData.currentMessage = `${this.getCurrentPlayer().username} kończy turę`;
                this.gameData.availableActions = [
                    actions.endTurn,
                    actions.mortgagePropertyCard,
                    actions.redeemPropertyCard,
                    actions.buildHouse,
                    actions.sellHouse,
                ];
                break;
            case tileTypes.goToJail:
                this.playerToJail(this.getCurrentPlayer());
                break;
            case tileTypes.tax:
                this.gameData.currentMessage = `${this.getCurrentPlayer().username} opłaca warunek`;
                this.gameData.availableActions = [
                    actions.payTax,
                    actions.redeemPropertyCard,
                    actions.mortgagePropertyCard,
                    actions.buildHouse,
                    actions.sellHouse,
                ];
                break;
            case tileTypes.incomeTax:
                this.gameData.currentMessage = `${this.getCurrentPlayer().username} płaci czesne`;
                this.gameData.availableActions = [actions.payIncomeTax];
                break;
            case tileTypes.chanceCard:
                this.gameData.currentMessage = `${this.getCurrentPlayer().username} losuje kartę Samorządu`;
                this.gameData.availableActions = [actions.pickChanceCard];
                break;
            case tileTypes.communityCard:
                this.gameData.currentMessage = `${this.getCurrentPlayer().username} losuje kartę Stypendium`;
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

        const tileOwner = this.getPlayer(currentTileOwnerId);
        this.logger.log(
            JSON.stringify({
                position,
                currentTileOwnerId,
                tileOwner,
            }),
        );
        const mortgagedCards = tileOwner?.getData("mortgagedCards");

        if (!currentTileOwnerId) {
            this.gameData.currentMessage = `${this.getCurrentPlayer().username} zastanawia się nad zakupem`;
            this.gameData.availableActions = [
                actions.buyBuilding,
                actions.refuseToBuyBuilding,
            ];
        } else if (currentTileOwnerId === player.publicId) {
            this.addLog(
                `${this.getCurrentPlayer().username} stanął na swoim polu`,
            );

            if (!this.ownAllOneColorTiles()) {
                this.gameData.availableActions = [
                    actions.endTurn,
                    actions.mortgagePropertyCard,
                    actions.buildHouse,
                    actions.sellHouse,
                    actions.redeemPropertyCard,
                ];
            } else {
                this.gameData.availableActions = [
                    actions.endTurn,
                    actions.mortgagePropertyCard,
                    actions.buildHouse,
                    actions.sellHouse,
                    actions.redeemPropertyCard,
                ];
            }
        } else if (mortgagedCards && mortgagedCards.has(position)) {
            this.gameData.currentMessage = `${player.username} stanął na zastawionym polu przez gracza ${tileOwner.username}.`;
            this.addLog(
                `${player.username} stanął na zastawionym polu gracza ${tileOwner.username}`,
            );
            this.gameData.availableActions = [
                actions.endTurn,
                actions.mortgagePropertyCard,
                actions.buildHouse,
                actions.sellHouse,
                actions.redeemPropertyCard,
            ];
        } else {
            const tile = this.gameMap.getTile(position);
            let rent;

            if (tile?.subtype === "winda") {
                let rentIndex = 0;
                const tileOwnerOwnerships = tileOwner.getData("ownerships");
                if (tileOwnerOwnerships.has(5)) rentIndex++;
                if (tileOwnerOwnerships.has(15)) rentIndex++;
                if (tileOwnerOwnerships.has(25)) rentIndex++;
                if (tileOwnerOwnerships.has(35)) rentIndex++;
                rent = tile.rent[rentIndex - 1];
            } else if (tile?.subtype === "utility") {
                let utilityCount = 0;
                const tileOwnerOwnerships = tileOwner.getData("ownerships");
                if (tileOwnerOwnerships.has(12)) utilityCount++;
                if (tileOwnerOwnerships.has(28)) utilityCount++;
                if (utilityCount === 1)
                    rent =
                        4 *
                        (this.gameData.rollResult[0] +
                            this.gameData.rollResult[1]);
                if (utilityCount === 2)
                    rent =
                        10 *
                        (this.gameData.rollResult[0] +
                            this.gameData.rollResult[1]);
            } else {
                this.logger.log(
                    "JEDEN: \n\n\n " +
                        JSON.stringify({
                            tileOwner,
                            properties: tileOwner.getData("properties"),
                        }),
                );

                rent =
                    tile.rent[
                        tileOwner.getData("properties").get(position) ?? 0
                    ];
            }

            this.gameData.currentMessage = `${this.getCurrentPlayer().username} płaci ${rent}$ czynszu.`;
            this.addLog(
                `${this.getCurrentPlayer().username} stanął na polu gracza ${tileOwner.username}`,
            );
            this.gameData.availableActions = [
                actions.payRent,
                actions.redeemPropertyCard,
                actions.mortgagePropertyCard,
                actions.buildHouse,
                actions.sellHouse,
            ];
        }
    }

    // @event
    buildHouse({ publicId, data: tileIndex }) {
        this.checkIfActionPossible(publicId, actions.buildHouse);
        const player = this.getCurrentPlayer();
        const tile = this.gameMap.getTile(tileIndex);
        const properties = player.getData("properties");
        const currentHouses = properties.get(tileIndex) ?? 0;

        if (!this.ownAllOneColorTiles()) {
            return [this.events.info("Wykup wszystkie pola tego koloru")];
        }

        if (!this.canSellOrBuyHouse(tileIndex, true)) {
            return [this.events.info("Nie można zbudować budynku")];
        }

        if (player.getData("money") < tile.housePrice) {
            return [this.events.info("Nie masz wystarczająco pieniędzy")];
        }

        player.setData("money", (money) => money - tile.housePrice);
        properties.set(tileIndex, currentHouses + 1);
        this.addLog(
            `${player.username} zarezerwował salę na polu <i>${tile.name}</i>`,
        );

        return [
            this.events.logs(),
            this.events.playersData(),
            this.events.time(),
        ];
    }

    ownAllOneColorTiles() {
        const player = this.getCurrentPlayer();
        const position = player.getData("position");
        const currentTile = this.gameMap.getTile(position);
        if (!currentTile.set) return false;

        const [setID, setCount] = currentTile.set;
        const ownerships = player.getData("ownerships");

        let buildings = 0;

        for (const tilePosition of ownerships) {
            const tile = this.gameMap.getTile(tilePosition);
            if (tile.set !== undefined && tile.set[0] === setID) {
                buildings++;
            }
        }

        if (buildings === setCount) {
            return true;
        } else {
            return false;
        }
    }

    sellHouse({ publicId, data: tileIndex }) {
        this.checkIfActionPossible(publicId, actions.sellHouse);
        const player = this.getCurrentPlayer();
        const tile = this.gameMap.getTile(tileIndex);
        const properties = player.getData("properties");
        const currentHouses = properties.get(tileIndex) ?? 0;

        if (!this.canSellOrBuyHouse(tileIndex, false)) {
            return [this.events.info("Nie można odrezerwować tej sali")];
        }

        const refund = tile.housePrice / 2;
        properties.set(tileIndex, currentHouses - 1);
        player.setData("money", (money) => money + refund);

        this.addLog(
            `${player.username} odrezerwował salę na polu <i>${tile.name}</i> za <b>${refund}$</b>`,
        );

        return [
            this.events.logs(),
            this.events.playersData(),
            this.events.time(),
        ];
    }

    canSellOrBuyHouse(tileIndex, buy) {
        const player = this.getCurrentPlayer();
        const currentTile = this.gameMap.getTile(tileIndex);
        const [setID] = currentTile.set;
        const ownerships = player.getData("ownerships");
        const properties = player.getData("properties");

        let currentHouses = 0;
        if (properties.get(tileIndex) !== undefined) {
            currentHouses = properties.get(tileIndex);
        }

        if (!buy) {
            if (currentHouses === 0) return false;
        } else {
            if (currentHouses >= 5) return false;
        }

        for (const tilePosition of ownerships) {
            const tile = this.gameMap.getTile(tilePosition);

            if (tile.set[0] === setID) {
                if (tilePosition === tileIndex) {
                    continue;
                }

                let otherHouses = properties.get(tilePosition);
                if (otherHouses === undefined) {
                    otherHouses = 0;
                }
                if (!buy && otherHouses > currentHouses) {
                    return false;
                } else if (buy && otherHouses < currentHouses) {
                    return false;
                }
            }
        }
        return true;
    }

    // @event
    rollDice(data) {
        this.checkIfActionPossible(data.publicId, actions.rollDice);
        const diceResult = [getRandomNumber(1, 6), getRandomNumber(1, 6)];
        const player = this.getCurrentPlayer();

        const isDublet = diceResult[0] === diceResult[1];
        this.gameData.rollResult = diceResult;
        if (this.gameData.dublets === 2 && isDublet) {
            this.playerToJail(player);
            return this.events.rollPackage();
        }
        this.timer.addTimeIfLessThan(8, 30);
        let wasPlayerInJail = false;
        if (player.getData("inJail")) {
            this.gameData.availableActions = [actions.rollDice];
            if (isDublet) {
                this.addLog(
                    `${player.username} wyrzucił dublet <b>(${diceResult[0]}, ${diceResult[1]})</b>. Zdał sesję.`,
                );
                player.setData("outOfJailAttempts", () => 0);
                player.setData("inJail", () => false);
                wasPlayerInJail = true;
            } else {
                player.setData("outOfJailAttempts", (attempts) => attempts + 1);

                this.addLog(
                    `${player.username} wyrzucił <b>${diceResult[0]}</b> oraz <b>${diceResult[1]}</b>. Nie zdaje sesji.`,
                );

                if (player.getData("outOfJailAttempts") === 3) {
                    this.gameData.availableActions = [
                        actions.endTurn,
                        actions.mortgagePropertyCard,
                        actions.buildHouse,
                        actions.sellHouse,
                        actions.redeemPropertyCard,
                    ];
                    this.gameData.currentMessage = `${this.getCurrentPlayer().username} nie zdaje sesji`;
                    player.setData("outOfJailAttempts", () => 0);
                } else {
                    this.gameData.currentMessage = `${this.getCurrentPlayer().username} zdaje sesje. Próba (${player.getData("outOfJailAttempts")}/3)`;
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

    // @event
    endTurn(data) {
        this.checkIfActionPossible(data.publicId, actions.endTurn);
        this.gameData.availableActions = [actions.rollDice];

        const currentPlayer = this.getCurrentPlayer();

        this.addLog(`${currentPlayer.username} zakończył turę.`);

        if (
            !currentPlayer.getData("wasInJail") &&
            !currentPlayer.getData("lost") &&
            this.gameData.rollResult[0] === this.gameData.rollResult[1]
        ) {
            this.gameData.dublets += 1;
            this.gameData.currentMessage = `${currentPlayer.username} ponownie rzuca kośćmi`;
        } else {
            do {
                this.nextTurn("ręczne kończenie tury");
            } while (this.getCurrentPlayer().getData("lost"));
            this.gameData.currentMessage = `${this.getCurrentPlayer().username} rzuca kośćmi`;
        }
        this.timer.setTimer(10);
        const newPlayer = this.getCurrentPlayer();

        if (newPlayer.getData("inJail")) {
            this.gameData.currentMessage = `${newPlayer.username} podchodzi do sesji`;
            this.gameData.availableActions = [
                actions.rollDice,
                actions.payJail,
            ];
            if (newPlayer.getData("outOfJailCard") > 0) {
                this.gameData.availableActions.push(actions.useOutOfJailCard);
            }
        }

        if (currentPlayer.getData("wasInJail")) {
            currentPlayer.setData("wasInJail", () => false);
        }

        this.addLog("hr");
        return [
            this.events.currentMessage(),
            this.events.yourTurn(data.publicId, false),
            this.events.yourTurn(this.getCurrentPlayerPublicId(), true),
            this.events.availableActions(),
            this.events.logs(),
            this.events.time(),

            this.events.closeDialogs(),
        ];
    }

    checkIfActionPossible(publicId, checkedAction) {
        if (
            this.getCurrentPlayer().getData("lost") &&
            checkedAction !== actions.endTurn
        ) {
            throw new Error("Przegrałeś, brak dostępnych akcji");
        }
        this.logger.log(publicId, this.getCurrentPlayerPublicId());

        this.logger.log(`${(publicId, this.getCurrentPlayerPublicId())}`);

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
        player.setData("wasInJail", () => true);
        player.setData("position", () => 10);
        this.timer.addTime(10);
        this.addLog(`${player.username} idzie na <b>sesję</b>.`);
        this.gameData.availableActions = [actions.endTurn];
        this.gameData.dublets = 0;
    }

    // @event
    payJail(data) {
        this.checkIfActionPossible(data.publicId, actions.payJail);
        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.getData("money") < 200) {
            return [
                this.events.info("Nie masz wystarczająco pieniędzy."),
                this.events.time(),
            ];
        }

        this.timer.addTime(30);

        currentPlayer.setData("money", (money) => money - 200);
        currentPlayer.setData("inJail", () => false);

        this.addLog(
            `${currentPlayer.username} daje prowadzącemu <b>200$</b> i wychodzi z <b>sesji</b>.`,
        );

        this.gameData.availableActions = [actions.rollDice];

        this.gameData.currentMessage = `${this.getCurrentPlayer().username} rzuca koścmi`;

        return [
            this.events.currentMessage(),
            this.events.availableActions(),
            this.events.logs(),
            this.events.playersData(),
            this.events.time(),
            this.events.closeDialogs(),
        ];
    }

    // @event
    useOutOfJailCard(data) {
        this.checkIfActionPossible(data.publicId, actions.useOutOfJailCard);
        const currentPlayer = this.getCurrentPlayer();
        this.timer.addTime(30);

        if (currentPlayer.getData("outOfJailCard") < 1) {
            return [this.events.info("Nie masz karty Zdaj Sesję")];
        }

        currentPlayer.setData(
            "outOfJailCard",
            (outOfJailCard) => outOfJailCard - 1,
        );
        currentPlayer.setData("inJail", () => false);

        this.addLog(`${currentPlayer.username} użył karty <b>Zdaj Sesję</b>.`);

        this.gameData.availableActions = [actions.rollDice];

        this.gameData.currentMessage = `${this.getCurrentPlayer().username} rzuca koścmi`;

        return [
            this.events.currentMessage(),
            this.events.availableActions(),
            this.events.logs(),
            this.events.playersData(),
            this.events.time(),
            this.events.closeDialogs(),
        ];
    }

    // @event
    payTax(data) {
        this.checkIfActionPossible(data.publicId, actions.payTax);
        const currentPlayer = this.getCurrentPlayer();
        this.timer.addTime(10);

        if (currentPlayer.getData("money") < 75) {
            return [this.events.info("Nie masz wystarczająco pieniędzy")];
        }

        currentPlayer.setData("money", (money) => money - 75);

        this.addLog(`${currentPlayer.username} opłaca warunek <b>75$</b>.`);

        this.gameData.availableActions = [
            actions.endTurn,
            actions.mortgagePropertyCard,
            actions.buildHouse,
            actions.sellHouse,
            actions.redeemPropertyCard,
        ];

        return [
            this.events.currentMessage(),
            this.events.availableActions(),
            this.events.logs(),
            this.events.playersData(),
            this.events.time(),
            this.events.closeDialogs(),
        ];
    }

    // @event
    payIncomeTax(data) {
        this.checkIfActionPossible(data.publicId, actions.payIncomeTax);
        const currentPlayer = this.getCurrentPlayer();
        this.timer.addTime(10);

        if (currentPlayer.getData("money") < 150) {
            return [this.events.info("Nie masz wystarczająco pieniędzy")];
        }

        currentPlayer.setData("money", (money) => money - 150);

        this.addLog(`${currentPlayer.username} płaci <b>150$</b> czesnego`);

        this.gameData.currentMessage = `${currentPlayer.username} kończy turę`;

        this.gameData.availableActions = [
            actions.endTurn,
            actions.mortgagePropertyCard,
            actions.buildHouse,
            actions.sellHouse,
            actions.redeemPropertyCard,
        ];

        return [
            this.events.currentMessage(),
            this.events.availableActions(),
            this.events.logs(),
            this.events.closeDialogs(),
            this.events.playersData(),
            this.events.time(),
        ];
    }

    // @event
    payRent(data) {
        this.checkIfActionPossible(data.publicId, actions.payRent);
        const player = this.getCurrentPlayer();
        const position = player.getData("position");
        const tile = this.gameMap.getTile(position);
        this.logger.log("66");
        const owner = this.players.get(this.getOwnerId(position));
        const properties = owner.getData("properties");
        const tileOwnerOwnerships = owner.getData("ownerships");

        let rent = 0;
        if (tile?.subtype === "winda") {
            let rentIndex = 0;
            if (tileOwnerOwnerships.has(5)) rentIndex++;
            if (tileOwnerOwnerships.has(15)) rentIndex++;
            if (tileOwnerOwnerships.has(25)) rentIndex++;
            if (tileOwnerOwnerships.has(35)) rentIndex++;
            rent = tile.rent[rentIndex - 1];
        } else if (tile?.subtype === "utility") {
            let utilityCount = 0;
            if (tileOwnerOwnerships.has(12)) utilityCount++;
            if (tileOwnerOwnerships.has(28)) utilityCount++;
            if (utilityCount === 1)
                rent =
                    4 *
                    (this.gameData.rollResult[0] + this.gameData.rollResult[1]);
            if (utilityCount === 2)
                rent =
                    10 *
                    (this.gameData.rollResult[0] + this.gameData.rollResult[1]);
        } else {
            this.logger.log("7");
            rent = tile.rent[properties.get(position) ?? 0];
        }

        if (player.getData("money") < rent) {
            return [this.events.info("Nie masz wystarczająco pieniędzy")];
        }

        player.setData("money", (money) => money - rent);
        owner.setData("money", (money) => money + rent);
        this.addLog(
            `${player.username} płaci <b>${rent}$</b> graczowi ${owner.username}.`,
        );
        this.gameData.availableActions = [
            actions.endTurn,
            actions.mortgagePropertyCard,
            actions.buildHouse,
            actions.sellHouse,
            actions.redeemPropertyCard,
        ];
        this.gameData.currentMessage = `${this.getCurrentPlayer().username} kończy turę`;
        this.timer.addTime(10);
        return [
            this.events.closeDialogs(),
            this.events.availableActions(),
            this.events.logs(),
            this.events.playersData(),
            this.events.time(),
        ];
    }

    // @event
    mortgagePropertyCard({ publicId, data: card }) {
        const player = this.getPlayer(publicId);

        if (this.getOwnerId(card.position) !== player.publicId) {
            return [this.events.info("To pole nie należy do Ciebie.")];
        }

        player.setData("mortgagedCards", (mortgagedCards) =>
            mortgagedCards.add(card.position),
        );
        player.setData(
            "money",
            (money) => money + this.gameMap.getTile(card.position).mortgage,
        );

        this.addLog(
            `${player.username} zastawia kartę <i>${card.name}</i> za <b>${this.gameMap.getTile(card.position).mortgage}$</b>.`,
        );

        return [
            this.events.closeDialogs(),
            this.events.logs(),
            this.events.playersData(),
            this.events.time(),
        ];
    }

    // @event
    redeemPropertyCard({ publicId, data: card }) {
        const player = this.getPlayer(publicId);
        const mortgagePrice = (
            this.gameMap.getTile(card.position).mortgage * 1.1
        ).toFixed(0);

        if (player.getData("money") < mortgagePrice) {
            return [this.events.info(`Nie masz wystarczająco pieniędzy.`)];
        }

        player.setData("money", (money) => money - mortgagePrice);
        player.setData("mortgagedCards", (mortgagedCards) => {
            mortgagedCards.delete(card.position);
            return mortgagedCards;
        });
        this.addLog(
            `${player.username} odkupił kartę <i>${card.name}</i> za <b>${mortgagePrice}$</b>.`,
        );

        return [
            this.events.closeDialogs(),
            this.events.time(),
            this.events.logs(),
            this.events.playersData(),
        ];
    }

    // @event
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
        this.gameData.availableActions = [
            actions.endTurn,
            actions.mortgagePropertyCard,
            actions.buildHouse,
            actions.sellHouse,
            actions.redeemPropertyCard,
        ];
        this.timer.addTime(10);
        this.gameData.currentMessage = `${this.getCurrentPlayer().username} kończy turę`;
        return [
            this.events.closeDialogs(),
            this.events.availableActions(),
            this.events.logs(),
            this.events.currentMessage(),
            this.events.playersData(),
            this.events.time(),
        ];
    }

    // @event
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
            tile,
            cannotBid: player.publicId,
            cannotBidPlayerName: player.username,
        };
        this.timer.setTimer(20);

        return [
            this.events.closeDialogs(),
            this.events.availableActions(),
            this.events.logs(),
            this.events.currentMessage(),
            this.events.auction(),
            this.events.time(),
        ];
    }

    // @event
    auction({ publicId, data: bidIncrement }) {
        if (publicId === this.gameData.auction.cannotBid) {
            return [this.events.info("Nie możesz licytować", publicId)];
        }

        const player = this.getPlayer(publicId);
        if (
            player.getData("money") <
            this.gameData.auction.price + bidIncrement
        ) {
            return [this.events.info("Nie masz wystarczająco pieniędzy")];
        }
        this.gameData.auction.price =
            this.gameData.auction.price + bidIncrement;

        this.gameData.auction.winningPlayer = player.getPlayerData();

        this.timer.addTimeIfLessThan(5, 10);
        return [this.events.logs(), this.events.auction(), this.events.time()];
    }

    getRandomField() {
        let field;

        do {
            field = getRandomNumber(0, 40);
        } while (
            // Pola z innymi kartami szans
            [2, 7, 17, 22, 33, 36].includes(field)
        );

        return field;
    }

    // @event
    pickChanceCard(data) {
        this.checkIfActionPossible(data.publicId, actions.pickChanceCard);
        const currentPlayer = this.getCurrentPlayer();
        const randomIndex = getRandomNumber(0, chanceCards.length - 1);
        const card = chanceCards[randomIndex];
        let newCard = card;
        let newPosition;
        this.timer.addTime(5);
        this.addLog(
            `${currentPlayer.username} wylosował kartę <b>${card.name}</b>.`,
        );
        this.gameData.currentMessage = `${currentPlayer.username} kończy turę`;
        this.gameData.availableActions = [
            actions.endTurn,
            actions.mortgagePropertyCard,
            actions.buildHouse,
            actions.sellHouse,
            actions.redeemPropertyCard,
        ];
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
                currentPlayer.setData(
                    "position",
                    () => (newPosition = this.getRandomField()),
                );
                this.executeTileAction(this.gameMap.getTile(newPosition));
                this.addLog(
                    `${currentPlayer.username} idzie na pole <b>${this.gameMap.getTile(currentPlayer.getData("position")).name}</b>.`,
                );
                newCard = {
                    ...card,
                    name: `Idź na wskazane pole: ${this.gameMap.getTile(currentPlayer.getData("position")).name}`,
                };
                break;
            case chanceCardTypes.goToJail:
                this.playerToJail(currentPlayer);
                break;
            case chanceCardTypes.payTaxes:
                this.gameData.currentMessage = `${currentPlayer.username} płaci czesne`;
                this.gameData.availableActions = [
                    actions.payIncomeTax,
                    actions.redeemPropertyCard,
                    actions.mortgagePropertyCard,
                    actions.sellHouse,
                ];
                break;
            case chanceCardTypes.withdrawCashFromBank:
                currentPlayer.setData("money", (money) => money + 50);
                this.addLog(
                    `${currentPlayer.username} pobiera od Rektora <b>50$</b>.`,
                );
                break;
            case chanceCardTypes.getOutOfJail:
                currentPlayer.setData(
                    "outOfJailCard",
                    (outOfJailCard) => outOfJailCard + 1,
                );
                break;
            case chanceCardTypes.payForBuildingProperties:
                if (this.calculateBuildingTax()) {
                    this.gameData.currentMessage = `${currentPlayer.username} płaci ${this.calculateBuildingTax()}$ za sale.`;
                    this.gameData.availableActions = [
                        actions.payHouseTax,
                        actions.redeemPropertyCard,
                        actions.mortgagePropertyCard,
                        actions.sellHouse,
                    ];
                } else {
                    this.gameData.currentMessage = `${currentPlayer.username} kończy turę`;
                    this.addLog(
                        `${currentPlayer.username} nie płaci za sale, bo żadnych nie zarezerował.`,
                    );
                    this.gameData.availableActions = [
                        actions.endTurn,
                        actions.mortgagePropertyCard,
                        actions.buildHouse,
                        actions.sellHouse,
                        actions.redeemPropertyCard,
                    ];
                }

                break;
            case chanceCardTypes.takeMoneyFromPlayers:
                this.takeMoneyFromPlayers(currentPlayer);
                break;
        }

        this.logger.log(this.gameData.availableActions);

        return [
            this.events.closeDialogs(),
            this.events.logs(),
            this.events.playersPosition(),
            this.events.currentMessage(),
            this.events.availableActions(),
            this.events.chanceCard(newCard),
            this.events.playersData(),
            this.events.time(),
        ];
    }

    calculateBuildingTax() {
        let totalHouses = 0;
        for (const houseCount of Object.values(
            this.getCurrentPlayer().getData("properties"),
        )) {
            totalHouses += houseCount;
        }

        const houseTax = 50;
        return totalHouses * houseTax;
    }

    payHouseTax(data) {
        this.checkIfActionPossible(data.publicId, actions.payHouseTax);
        const player = this.getCurrentPlayer();
        this.timer.addTime(10);

        const amountToPay = this.calculateBuildingTax();

        if (player.getData("money") < amountToPay) {
            return [this.events.info(`Nie masz wystarczająco pieniędzy.`)];
        }

        player.setData("money", (money) => money - amountToPay);

        if (amountToPay === 0) {
            this.addLog(
                `${player.username} nie posiada zarezerwowanych sal, więc nie płaci podatku.`,
            );
        } else {
            this.addLog(
                `${player.username} zapłacił za zarezerwowane sale <b>${amountToPay}$</b>)`,
            );
        }

        this.gameData.availableActions = [
            actions.endTurn,
            actions.mortgagePropertyCard,
            actions.buildHouse,
            actions.sellHouse,
            actions.redeemPropertyCard,
        ];

        return [
            this.events.currentMessage(),
            this.events.availableActions(),
            this.events.logs(),
            this.events.playersData(),
            this.events.time(),
            this.events.closeDialogs(),
        ];
    }

    takeMoneyFromPlayers(taker) {
        let payersCount = 0;

        for (const [, player] of this.players) {
            if (player.publicId === taker.publicId) {
                continue;
            }

            if (player.getData("money") >= 50) {
                player.setData("money", (money) => money - 50);
                payersCount = payersCount + 1;
                this.addLog(`${player.username} zapłacił 50$`);
            } else {
                this.addLog(
                    `${player.username} nie ma wystarczająco pieniędzy.`,
                );
            }
        }

        if (payersCount > 0) {
            taker.setData("money", (money) => money + payersCount * 50);
            this.addLog(`${taker.username} pobiera po 50$ od każdego gracza`);
        } else {
            this.addLog(`${taker.username} nie otrzymał żadnych pieniędzy.`);
        }
    }

    // @event
    pickCommunityCard(data) {
        this.checkIfActionPossible(data.publicId, actions.pickCommunityCard);
        const currentPlayer = this.getCurrentPlayer();
        const randomIndex = getRandomNumber(0, communityCards.length - 1);
        const card = communityCards[randomIndex];
        this.timer.addTime(5);
        this.addLog(
            `${currentPlayer.username} wylosował kartę <b>${card.name}</b>.`,
        );
        this.gameData.currentMessage = `${currentPlayer.username} kończy turę`;
        this.gameData.availableActions = [
            actions.endTurn,
            actions.mortgagePropertyCard,
            actions.buildHouse,
            actions.sellHouse,
            actions.redeemPropertyCard,
        ];
        switch (card.type) {
            case communityCardTypes.withdrawCashFromBank:
                currentPlayer.setData("money", (money) => money + 50);
                this.addLog(
                    `${currentPlayer.username} pobiera od Rektora 50$.`,
                );
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
                this.gameData.currentMessage = `${currentPlayer.username} opłaca czesne`;
                this.gameData.availableActions = [
                    actions.payIncomeTax,
                    actions.redeemPropertyCard,
                    actions.mortgagePropertyCard,
                    actions.sellHouse,
                ];
                break;
        }

        return [
            this.events.closeDialogs(),
            this.events.logs(),
            this.events.playersPosition(),
            this.events.currentMessage(),
            this.events.availableActions(),
            this.events.communityCard(card),
            this.events.playersData(),
            this.events.time(),
        ];
    }

    gameOver(loser, opponent) {
        this.logger.log("funkcja gameOver");

        loser.setData("lost", () => true);

        const possesions = [...loser.getData("ownerships")];

        if (opponent !== undefined) {
            this.logger.log("Bankructwo na rzecz banku");

            for (const position of possesions) {
                this.removeOwnership(loser, position);
                this.setOwnership(opponent, position);
            }

            opponent.setData("mortgagedCards", (mortgagedCards) => {
                return new Set([
                    ...mortgagedCards,
                    ...loser.getData("mortgagedCards"),
                ]);
            });

            const loserOutOfJailCards = loser.getData("outOfJailCard");
            loser.setData("outOfJailCard", () => 0);
            opponent.setData(
                "outOfJailCard",
                (outOfJailCard) => outOfJailCard + loserOutOfJailCards,
            );

            const loserProperties = loser.getData("properties");
            loser.setData("properties", () => new Map());
            opponent.setData("properties", (properties) => {
                for (const [position, count] of loserProperties) {
                    properties.set(position, count);
                }
                return properties;
            });

            const loserMoney = loser.getData("money");
            loser.setData("money", () => 0);
            opponent.setData("money", (money) => money + loserMoney);
            this.addLog(
                `${loser.username} zbankrutował na rzecz gracza ${opponent.username}.`,
            );
        } else {
            this.logger.log("Bankructwo na rzecz gracza");
            for (const position of possesions) {
                this.removeOwnership(loser, position);
            }

            loser.setData("properties", () => new Map());
            loser.setData("outOfJailCard", () => 0);
            loser.setData("position", () => null);
            loser.setData("money", () => 0);

            this.addLog(`${loser.username} zbankrutował`);
        }

        this.leaderboard.unshift(loser.publicId);

        let playersLeft = 0;

        for (const [, player] of this.players) {
            this.logger.log(
                "Czy nie przegrał? " + `${!player.getData("lost")}`,
            );

            if (!player.getData("lost")) playersLeft += 1;
        }

        if (playersLeft < 2) {
            return this.theGameIsOver();
        }

        this.gameData.availableActions = [actions.endTurn];
        const targets = this.endTurn({ publicId: loser.publicId });
        return targets;
    }

    theGameIsOver() {
        this.endGame();
        this.nextTurn("gameover");
        this.leaderboard.unshift(this.getCurrentPlayerPublicId());
        this.gameData.currentMessage = `Wygrał ${this.getCurrentPlayer().username}`;
        this.gameData.availableActions = [actions.exit];
        clearInterval(this.intervalId);
        this.logger.log("Wysyłanko końca gry!");
        return [
            this.events.closeDialogs(),
            this.events.currentMessage(),
            this.events.playersData(),
            this.events.availableActions(),
            this.events.logs(),
            this.events.time(),
            this.events.endGame(),
        ];
    }

    pause(userId) {
        this.logger.log("Gra zapauzowana");
        this.disconnectedPlayers.add(userId);
        this.paused = true;
    }
}
