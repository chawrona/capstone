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
        player.setData("money", () => 9999);
        player.setData("ownerships", () => new Set());
        player.setData("mortgagedCards", () => new Set());
        player.setData("outOfJailAttempts", () => 0);
        player.setData("wasInJail", () => false);
        player.setData("lost", () => false);
    }

    startTimer() {
        this.intervalId = setInterval(() => {
            this.timer.subtract(1);
            const targets = this.endTimerConsequences();
            if (targets) {
                this.useEventEmmiter(targets);
            }
        }, 1000);
    }

    endTimerConsequences() {
        if (!this.timer.isTimerZero()) return;

        const availableActions = new Set(this.gameData.availableActions);
        const data = { publicId: this.getCurrentPlayerPublicId() };

        if (availableActions.has(actions.endTurn)) {
            return this.endTurn(data);
        }
        if (availableActions.has(actions.rollDice)) {
            return this.rollDice(data);
        }
        if (availableActions.has(actions.payTax)) {
            return this.handleAutoPayment(this.payTax, data);
        }
        if (availableActions.has(actions.payIncomeTax)) {
            return this.handleAutoPayment(this.payIncomeTax, data);
        }
        if (availableActions.has(actions.payRent)) {
            return this.handleAutoPayment(this.payRent, data);
        }
        if (availableActions.has(actions.pickChanceCard)) {
            return this.pickChanceCard(data);
        }
        if (availableActions.has(actions.pickCommunityCard)) {
            return this.pickCommunityCard(data);
        }
        if (availableActions.has(actions.refuseToBuyBuilding)) {
            return this.refuseToBuyBuilding(data);
        }
        if (availableActions.has(actions.auction)) {
            return this.endAuction();
        }
    }

    handleAutoPayment(paymentAction, data) {
        const player = this.getCurrentPlayer();
        let targets;
        let hasNotEnoughMoney;

        do {
            targets = paymentAction.call(this, data);
            hasNotEnoughMoney = targets.some(
                (target) => target.eventName === "gameInfo",
            );

            if (
                player.getData("ownerships").size !==
                    player.getData("mortgagedCards").size &&
                hasNotEnoughMoney
            ) {
                const ownerships = [...player.getData("ownerships")];
                const mortgageCards = player.getData("mortgagedCards");
                const firstCardIndex = ownerships.find((cardIndex) => {
                    return !mortgageCards.has(cardIndex);
                });
                const firstCard = this.gameMap.getTile(firstCardIndex);

                player.setData("money", (money) => money + firstCard.mortgage);
                player.setData("mortgagedCards", (mortgagedCards) =>
                    mortgagedCards.add(firstCardIndex),
                );
            } else if (hasNotEnoughMoney) {
                const opponent =
                    paymentAction === this.payRent
                        ? this.getTileOwner(player.getData("position"))
                        : undefined;
                return this.gameOver(player, opponent);
            }
        } while (hasNotEnoughMoney);

        return targets;
    }

    // @event - special case - wywoływany nie przez gracza tylko metodę z timerem
    endAuction() {
        this.timer.setTimer(30);
        const player = this.players.get(this.gameData.auction.winningPlayer);
        const tile = this.gameMap.getTile(this.gameData.auction.tile.position);

        if (this.gameData.auction.winningPlayer) {
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
                ];
                break;
            case tileTypes.goToJail:
                this.playerToJail(this.getCurrentPlayer());
                break;
            case tileTypes.tax:
                this.gameData.currentMessage = `${this.getCurrentPlayer().username} płaci podatek`;
                this.gameData.availableActions = [
                    actions.payTax,
                    actions.redeemPropertyCard,
                    actions.mortgagePropertyCard,
                ];
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
        const tileOwner = this.getPlayer(currentTileOwnerId);
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

            this.gameData.availableActions = [
                actions.endTurn,
                actions.mortgagePropertyCard,
                actions.redeemPropertyCard,
            ];
        } else if (mortgagedCards && mortgagedCards.has(position)) {
            this.gameData.currentMessage = `${player.username} stanął na zastawionym polu przez gracza ${tileOwner.username}.`;
            this.addLog(
                `${player.username} stanął na zastawionym polu gracza ${tileOwner.username}`,
            );
            this.gameData.availableActions = [
                actions.endTurn,
                actions.mortgagePropertyCard,
                actions.redeemPropertyCard,
            ];
        } else {
            this.gameData.currentMessage = `${this.getCurrentPlayer().username} płaci ${this.gameMap.getTile(position).rent}$ czynszu.`;
            this.addLog(
                `${this.getCurrentPlayer().username} stanął na polu gracza ${this.players[currentTileOwnerId]}`,
            );
            this.gameData.availableActions = [
                actions.payRent,
                actions.redeemPropertyCard,
                actions.mortgagePropertyCard,
            ];
        }
    }

    // @event
    rollDice(data) {
        this.checkIfActionPossible(data.publicId, actions.rollDice);
        const diceResult = [getRandomNumber(1, 6), getRandomNumber(1, 6)];
        const player = this.getCurrentPlayer();

        const isDublet = diceResult[0] === diceResult[1];

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
                    this.gameData.availableActions = [
                        actions.endTurn,
                        actions.mortgagePropertyCard,
                        actions.redeemPropertyCard,
                    ];
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

    // @event
    endTurn(data) {
        this.checkIfActionPossible(data.publicId, actions.endTurn);
        this.gameData.availableActions = [actions.rollDice];

        const currentPlayer = this.getCurrentPlayer();

        this.addLog(`${currentPlayer.username} zakończył turę.`);

        if (
            currentPlayer.getData("wasInJail") &&
            this.gameData.rollResult[0] === this.gameData.rollResult[1]
        ) {
            this.gameData.dublets += 1;
            this.gameData.currentMessage = `${currentPlayer.username} ponownie rzuca kośćmi`;
        } else {
            do {
                this.nextTurn();
            } while (this.getCurrentPlayer().getData("lost"));
            this.gameData.currentMessage = `${this.getCurrentPlayer().username} rzuca kośćmi`;
        }
        this.timer.setTimer(10);
        const newPlayer = this.getCurrentPlayer();

        if (newPlayer.getData("inJail")) {
            this.gameData.currentMessage = `${newPlayer.username} wychodzi z więzienia`;
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
        this.addLog(`${player.username} idzie do <b>więzienia</b>.`);
        this.gameData.availableActions = [actions.endTurn];
        this.gameData.dublets = 0;
    }

    // @event
    payJail(data) {
        this.checkIfActionPossible(data.publicId, actions.payJail);
        const currentPlayer = this.getCurrentPlayer();
        this.timer.addTime(30);

        if (currentPlayer.getData("money") < 200) {
            return [
                this.events.info("Nie masz wystarczająco pieniędzy."),
                this.events.time(),
            ];
        }

        currentPlayer.setData("money", (money) => money - 200);
        currentPlayer.setData("inJail", () => false);

        this.addLog(
            `${currentPlayer.username} płaci <b>200$</b> za wyjście z <b>więzienia</b>.`,
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
            return [this.events.info("Nie masz karty wyjścia z więzienia")];
        }

        currentPlayer.setData(
            "outOfJailCard",
            (outOfJailCard) => outOfJailCard - 1,
        );
        currentPlayer.setData("inJail", () => false);

        this.addLog(
            `${currentPlayer.username} użył karty <b>Wyjście z Więzienia</b>.`,
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
    payTax(data) {
        this.checkIfActionPossible(data.publicId, actions.payTax);
        const currentPlayer = this.getCurrentPlayer();
        this.timer.addTime(10);

        if (currentPlayer.getData("money") < 75) {
            return [this.events.info("Nie masz wystarczająco pieniędzy")];
        }

        currentPlayer.setData("money", (money) => money - 75);

        this.addLog(`${currentPlayer.username} płaci podatek <b>75$</b>.`);

        this.gameData.availableActions = [
            actions.endTurn,
            actions.mortgagePropertyCard,
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

        this.addLog(`${currentPlayer.username} płaci <b>150$</b> podatku`);

        this.gameData.availableActions = [
            actions.endTurn,
            actions.mortgagePropertyCard,
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
        const owner = this.players.get(this.getOwnerId(position));

        if (player.getData("money") < tile.rent) {
            return [this.events.info("Nie masz wystarczająco pieniędzy")];
        }

        player.setData("money", (money) => money - tile.rent);
        owner.setData("money", (money) => money + tile.rent);
        this.addLog(
            `${player.username} płaci <b>${tile.rent}$</b> graczowi ${owner.username}.`,
        );
        this.gameData.availableActions = [
            actions.endTurn,
            actions.mortgagePropertyCard,
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

    // @event
    pickChanceCard(data) {
        this.checkIfActionPossible(data.publicId, actions.pickChanceCard);
        const currentPlayer = this.getCurrentPlayer();
        const position = currentPlayer.getData("position");
        const randomIndex = getRandomNumber(0, chanceCards.length - 1);
        const card = chanceCards[randomIndex];
        let newCard = card;
        this.timer.addTime(5);
        this.addLog(
            `${currentPlayer.username} wylosował kartę <b>${card.name}</b>.`,
        );
        this.gameData.currentMessage = `${currentPlayer.username} kończy turę`;
        this.gameData.availableActions = [
            actions.endTurn,
            actions.mortgagePropertyCard,
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
                currentPlayer.setData("position", () => getRandomNumber(0, 40));
                this.executeTileAction(this.gameMap.getTile(position));
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
                this.gameData.currentMessage = `${currentPlayer.username} płaci podatek.`;
                this.gameData.availableActions = [
                    actions.payTax,
                    actions.redeemPropertyCard,
                    actions.mortgagePropertyCard,
                ];
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
            case chanceCardTypes.takeMoneyFromPlayers:
                break;
        }

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
            actions.redeemPropertyCard,
        ];
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
                this.gameData.currentMessage = `${currentPlayer.username} płaci podatek`;
                this.gameData.availableActions = [
                    actions.payTax,
                    actions.redeemPropertyCard,
                    actions.mortgagePropertyCard,
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
        loser.setData("lost", () => true);

        const possesions = [...loser.getData("ownerships")];

        if (opponent !== undefined) {
            for (const position of possesions) {
                this.removeOwnership(loser, position);
                this.setOwnership(opponent, position);
            }

            opponent.setData("mortgagedCards", (mortgagedCards) => {
                return new Set(
                    [...mortgagedCards],
                    [...loser.getData("mortgagedCards")],
                );
            });

            const loserOutOfJailCards = loser.getData("outOfJailCard");
            loser.setData("outOfJailCard", () => 0);
            opponent.setData(
                "outOfJailCard",
                (outOfJailCard) => outOfJailCard + loserOutOfJailCards,
            );

            const loserMoney = loser.getData("money");
            loser.setData("money", () => 0);
            opponent.setData("money", (money) => money + loserMoney);
            this.addLog(
                `${loser.username} zbankrutował na rzecz gracza ${opponent.username}.`,
            );
        } else {
            for (const position of possesions) {
                this.removeOwnership(loser, position);
            }

            loser.setData("outOfJailCard", () => 0);
            loser.setData("position", () => null);
            loser.setData("money", () => 0);

            this.addLog(`${loser.username} zbankrutował`);
        }

        this.leaderboard.unshift(loser.publicId);

        let playersLeft = 0;

        Object.entries(this.players).forEach(([, player]) => {
            if (!player.getData("lost")) playersLeft += 1;
        });

        if (playersLeft < 2) {
            this.nextTurn();
            this.leaderboard.unshift(this.getCurrentPlayerPublicId());
            this.gameData.currentMessage = `Wygrał ${this.getCurrentPlayer().username}`;
            clearInterval(this.intervalId);
            return [
                this.events.closeDialogs(),
                this.events.currentMessage(),
                this.events.playersData(),
                this.events.logs(),
                this.events.time(),
                this.events.endGame(),
            ];
        }

        this.gameData.availableActions = ["endTurn"];
        const targets = this.endTurn({ publicId: loser.publicId });
        this.gameData.availableActions = ["exit"];
        return targets;
    }
}
