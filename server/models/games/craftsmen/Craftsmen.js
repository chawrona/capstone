import getRandomNumber from "../../../utils/getRandomNumber.js";
import Game from "../../Game.js";
import actions from "./config.js/actions.js";
import contracts from "./config.js/contracts.js";
import Craftsman from "./Craftsman.js";

export default class Craftsmen extends Game {
    constructor(players, endGame, lobbyId, playerClass) {
        super(players, endGame, lobbyId, playerClass);

        // Informacja o turze
        this.round = 0;
        this.turn = 1;
        this.maxTurn = 1;

        // Obrót i pozycja kółek
        this.innerCircleRotation = 0;
        this.outerCircleRotation = 0;

        this.availableActions = [
            // actions.NEW_TURN,
            // actions.BUY_CART,
            // actions.ROTATE,
            actions.MOVE_CRAFTSMAN,
            actions.PLACE_CRAFTSMAN,
        ];

        // Plansza - pionki
        this.availableMovement = {
            0: {
                inner: [false, false, false],
                outer: [true, true, true, true, true, true, true, true],
            },
        };

        this.guilds = {
            inner: [null, null, null],
            outer: [null, null, null, null, null, null, null, null],
        };

        this.craftsmenOwners = new Map(); // publicId -> new Set(id rzemieślnika)
        this.craftsmen = new Map(); // id -> rzemieślnik
        this.movedCraftsmen = new Set();
        /* 
            id
            fieldId
            ringType
            owner {
                color
            }
        */

        this.outerPathCraftsmen = new Map([
            [0, new Set()],
            [1, new Set()],
            [2, new Set()],
            [3, new Set()],
            [4, new Set()],
            [5, new Set()],
            [6, new Set()],
            [7, new Set()],
        ]);

        this.innerPathCraftsmen = new Map([
            [0, new Set()],
            [1, new Set()],
            [2, new Set()],
        ]);

        // region Config
        this.maxPlayersInventorySpace = 9;
        this.rotateCost = {
            resources: [["iron", 1]],
            coins: 2,
        };
        this.maxCraftsman = 3;
        this.outerFieldsResourcesAmount = [1, 2, 2, 1, 1, 2, 1, 2];
        this.innerFieldsResourcesAmount = [1, 1, 2];
        this.innerFieldMovementWheatCost = 2;
        this.rerollCost = 3;
        this.tradeUnlockCost = [["silk", 3]];

        //
        this.AVAILABLE_ID = 0;
        this.resetedTrader = false;
        this.tradeCount = {
            fieldNumber: undefined,
            currentSell: 0,
            currentBuy: 0,
        };

        this.COMMON_RESOURCES = ["wheat", "wood", "stone", "brick", "iron"];
        this.LUXURY_RESOURCES = ["silk", "glass", "amber"];

        this.initialSetup();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // region INITIAL SETUP
    initialSetup() {
        const innerKeys = ["glass", "silk", "amber"];
        const outerKeys = ["brick", "gold", "iron", "stone", "wheat", "wood"];

        const additionalOuterKeys = [
            "stone_wheat",
            "wood_wheat",
            "iron_wheat",
            "brick_wheat",
        ];

        this.shuffleArray(additionalOuterKeys);

        outerKeys.push(
            additionalOuterKeys.shift(),
            additionalOuterKeys.shift(),
        );

        this.shuffleArray(innerKeys);
        this.shuffleArray(outerKeys);

        this.innerPositions = Object.fromEntries(
            innerKeys.map((k, i) => [k, i]),
        );
        this.outerPositions = Object.fromEntries(
            outerKeys.map((k, i) => [k, i]),
        );
        this.innerPositionsIds = Object.fromEntries(
            innerKeys.map((k, i) => [i, k]),
        );
        this.outerPositionsIds = Object.fromEntries(
            outerKeys.map((k, i) => [i, k]),
        );

        // Stwórz po jednym craftsmanie dla każdego gracza
        // Ustawiamy własności
        for (const [publicId, player] of this.players) {
            const craftsmanId = this.AVAILABLE_ID++;
            const craftsman = new Craftsman(
                publicId,
                player.color,
                craftsmanId,
            );

            this.craftsmen.set(craftsmanId, craftsman);
            this.craftsmenOwners.set(publicId, new Set());
            this.craftsmenOwners.get(publicId).add(craftsmanId);
        }

        // Pierwszy gracz ustawia pionka
        this.availableMovement = {
            0: {
                inner: [false, false, false],
                outer: [true, true, true, true, true, true, true, true],
            },
        };

        this.initializeContracts();
    }

    // region HELPERS 1

    initializeContracts() {
        this.currentContracts = [];

        this.contracts = structuredClone(contracts);

        // Pierwsza karta
        this.currentContracts = this.contracts[0].splice(
            getRandomNumber(0, 11),
            1,
        );

        console.log("CURRENT CONTRACTS 1", this.currentContracts);

        // Druga karta
        let index = getRandomNumber(0, 10) % 2 ? 0 : 1;
        console.log("INDEX 1", index);

        this.currentContracts.push(
            ...this.contracts[index].splice(getRandomNumber(0, 10), 1),
        );

        // Druga karta
        index =
            getRandomNumber(0, 2) === 0
                ? 0
                : getRandomNumber(0, 10) % 2
                  ? 1
                  : 2;

        console.log("INDEX 2", index);
        this.currentContracts.push(
            ...this.contracts[index].splice(getRandomNumber(0, 9), 1),
        );

        this.contracts = [
            ...this.contracts[0],
            ...this.contracts[1],
            ...this.contracts[2],
        ];

        console.log(this.currentContracts);

        this.shuffleArray(this.contracts);
    }

    drawSingleContract(index) {
        this.currentContracts[index] = this.contracts.splice(
            getRandomNumber(0, this.contracts.length - 1),
            1,
        )[0];
    }

    reroll(index) {
        console.log("ILE JEST KART: ", this.contracts.length);

        const oldCard = this.currentContracts[index];
        const newIndex = getRandomNumber(0, this.contracts.length - 1);
        console.log("NOWY INDEX: ", newIndex);

        const newCard = this.contracts.splice(newIndex, 1)[0];
        this.currentContracts[index] = newCard;
        this.contracts.push(oldCard);
        // console.log("AKTUALNE: ", this.currentContracts);
    }

    setPlayerData(player) {
        player.initalizeData();
    }

    serializeInnerPathCraftsmen() {
        const innerPath = {};
        for (const [fieldId, craftsmenSet] of this.innerPathCraftsmen) {
            innerPath[fieldId] = [...craftsmenSet].map((craftsmanId) => {
                return this.craftsmen.get(craftsmanId).getCraftsmanData();
            });
        }
        return innerPath;
    }

    serializeOuterPathCraftsmen() {
        const outerPath = {};
        for (const [fieldId, craftsmenSet] of this.outerPathCraftsmen) {
            outerPath[fieldId] = [...craftsmenSet].map((craftsmanId) => {
                return this.craftsmen.get(craftsmanId).getCraftsmanData();
            });
        }
        return outerPath;
    }

    // region GENERATE DATA

    generateGameData(publicId) {
        const player = this.getPlayer(publicId);

        return {
            target: publicId,
            eventName: "gameData",
            data: {
                currentPlayer: this.getPlayer(
                    this.playersQueue[this.currentPlayerIndex],
                ),
                round: this.round,
                turn: this.turn,
                currentPlayerIndex: this.currentPlayerIndex,
                guilds: this.guilds,
                contracts: this.currentContracts,
                rerollCost: this.rerollCost,
                innerCircleRotation: this.innerCircleRotation,
                outerCircleRotation: this.outerCircleRotation,
                innerPathCraftsmen: this.serializeInnerPathCraftsmen(),
                outerPathCraftsmen: this.serializeOuterPathCraftsmen(),
                availableMovement: this.availableMovement,
                innerPositions: this.innerPositions,
                outerPositions: this.outerPositions,
                players: this.getPlayersData(),
                tradeUnlockCost: this.tradeUnlockCost,
                canReroll: this.contracts[0].length > 0,
                availableActions:
                    publicId === this.playersQueue[this.currentPlayerIndex]
                        ? this.availableActions
                        : [],
                you: player.getPlayerData(),
                lobbyId: this.lobbyId,
                isYourTurn:
                    publicId === this.playersQueue[this.currentPlayerIndex],
            },
        };
    }

    // region HELPERS 2

    resetCircle() {
        this.outerCircleRotation += getRandomNumber(1, 9);
        this.innerCircleRotation += getRandomNumber(1, 3);
    }

    payWithAmber(player, costArray) {
        const inventory = player.getData("inventory");
        let missingResources = 0;

        for (const [resource, cost] of costArray) {
            const available = inventory[resource] || 0;
            if (available < cost) {
                missingResources += cost - available;
            }
        }

        if (missingResources > inventory.amber) {
            throw new Error("Nie masz wystarczająco surowców.");
        }

        player.setData("inventory", (inv) => {
            for (const [resource, cost] of costArray) {
                if (inv[resource] >= cost) {
                    inv[resource] -= cost;
                } else {
                    const deficit = cost - inv[resource];
                    inv[resource] = 0;
                    inv.amber -= deficit;
                    player.setData("stats", (stats) => {
                        stats.amberSpent += deficit;
                        return stats;
                    });
                }
            }

            return inv;
        });
    }

    pay(player, costArray) {
        const inventory = player.getData("inventory");

        for (const [resource, cost] of costArray) {
            if (resource === "coins") {
                if (player.getData("coins") < cost) {
                    throw new Error("Nie masz wystarczająco monet");
                }
            } else {
                const available = inventory[resource] || 0;
                if (available < cost) {
                    throw new Error("Nie masz wystarczająco surowców.");
                }
            }
        }

        player.setData("inventory", (inv) => {
            for (const [resource, cost] of costArray) {
                if (resource === "coins") {
                    player.setData("coins", (c) => c - cost);
                } else {
                    inv[resource] -= cost;
                }
            }

            return inv;
        });
    }

    getOuterGuild(physicalFieldId) {
        const baseIndex =
            (physicalFieldId - (this.outerCircleRotation % 8) + 8) % 8;
        return this.guilds.outer[baseIndex];
    }

    gameDataRequest(data) {
        const dataToSend = this.generateGameData(data.publicId);

        // dataToSend.data = {
        //     ...dataToSend.data,
        // };

        return [dataToSend];
    }

    sendGameDataToAll() {
        const data = [];
        for (const publicId of this.players.keys()) {
            data.push(this.generateGameData(publicId));
        }
        return data;
    }

    isYourTurn(publicId) {
        return publicId === this.playersQueue[this.currentPlayerIndex];
    }

    isActionAvailable(action) {
        return this.availableActions.includes(action);
    }

    eventChecker(publicId, action) {
        if (!this.isYourTurn(publicId)) {
            throw new Error("Zaczekaj na swoją kolej");
        }
        if (!this.isActionAvailable(action)) {
            throw new Error("Nie możesz wykonać teraz tej akcji");
        }
    }

    //region AVAILABLE ACTIONS
    setDefaultActions() {
        this.availableActions = [
            actions.NEW_TURN,
            actions.BUY_CART,
            actions.ROTATE,
            actions.MOVE_CRAFTSMAN,
            actions.BUY_CRAFTSMAN,
            actions.BUILD_GUILD,
            actions.REROLL_CONTRACT,
            actions.COMPLETE_CONTRACT,
            actions.TRADE,
            actions.BUY_TRADER,
            actions.SELL_INVENTORY,
        ];
    }

    aggregateEndGameStats() {
        const result = {};

        for (const [publicId, player] of this.players) {
            const stats = player.getData("stats");
            const contracts = player.getData("contracts");
            const username = player.username;

            result[publicId] = {
                username,
                color: player.color,
                contracts,
                stats: {
                    resourcesGained: { ...stats.resourcesGained },
                    coinsFromGuild: stats.coinsFromGuild,
                    coinsFromStanding: stats.coinsFromStanding,
                    coinsPaidToOthers: stats.coinsPaidToOthers,
                    rotations: stats.rotations,
                    rerolls: stats.rerolls,
                    amberSpent: stats.amberSpent,
                    tradesBought: stats.tradesBought,
                    tradesBoughtAmount: stats.tradesBoughtAmount,
                    tradesSold: stats.tradesSold,
                    tradeSoldAmount: stats.tradeSoldAmount,
                    coins: player.getData("coins"),
                    hiddenTask: player.getData("hiddenTask").title,
                },
            };
        }

        // Statystyki globalne całej gry
        result.global = {
            totalTurns: this.round * this.maxTurn + this.turn,
            totalWheatTaking: this.round,
            mostValuableResource: (() => {
                const totals = {};
                for (const { stats } of Object.values(result)) {
                    if (!stats) continue;
                    for (const [res, val] of Object.entries(
                        stats.resourcesGained,
                    )) {
                        totals[res] = (totals[res] || 0) + val;
                    }
                }
                return Object.entries(totals).sort(
                    (a, b) => b[1] - a[1],
                )[0]?.[0];
            })(),
        };

        return result;
    }

    // region DOSTĘPNE RUCHY
    setAvailableMovementsForCraftsman(craftsmanId, reset = false) {
        if (reset) this.availableMovement = {};
        if (this.movedCraftsmen.has(craftsmanId)) return;
        console.log("nowy gracz");

        const craftsman = this.craftsmen.get(craftsmanId);
        const currentField = craftsman.getFieldId();
        const owner = this.getPlayer(craftsman.publicId);

        // Stawiamy craftsmana
        if (currentField === null) {
            this.availableMovement[craftsmanId] = {
                inner: [false, false, false],
                outer: [true, true, true, true, true, true, true, true],
            };
            return;
        }

        // Normalnie wyliczamy jego dostępne pola
        this.availableMovement[craftsmanId] = {
            inner: [false, false, false],
            outer: [false, false, false, false, false, false, false, false],
        };

        // region pionek na outer
        if (craftsman.ringType === "outer" && craftsman.type !== "trader") {
            // Wyliczamy indeks pola po lewej (Clock Wise) i po prawej (Counter Clock Wise)
            const goClockWise = currentField === 0 ? 7 : currentField - 1;
            const goCounterClockWise =
                currentField === 7 ? 0 : currentField + 1;

            // Wyliczamy indeksy pól w środku, na które gracz może iść
            const availableInnerFields =
                currentField === 2
                    ? [0, 1]
                    : currentField === 5
                      ? [1, 2]
                      : currentField < 2
                        ? [0]
                        : currentField < 5
                          ? [1]
                          : [2];

            // Sprawdzamy czy można iść na pole po lewej (Clock Wise)
            // Wyliczamy wymagane pieniądze
            let moneyToPay = 0;
            // [id, new Set()]
            let localCraftsmenIds = this.outerPathCraftsmen.get(goClockWise);
            for (const localCraftsmanId of localCraftsmenIds) {
                const localCraftsman = this.craftsmen.get(localCraftsmanId);
                const craftsmanOwner = this.getPlayer(localCraftsman.publicId);
                const craftsmanOwnerCraftsmanCount =
                    craftsmanOwner.getData("craftsmen");

                if (
                    localCraftsman.publicId === owner.publicId &&
                    localCraftsman.type !== "trader"
                ) {
                    moneyToPay = 0;
                    break;
                }

                if (owner.getData("craftsmen") < craftsmanOwnerCraftsmanCount) {
                    moneyToPay += 0;
                    console.log(
                        "MOŻESZ SIĘ RUSZYĆ, BO GOŚĆ MA WIĘCEJ RZEMIEŚLNIKÓW",
                    );
                    console.log(
                        owner.getData("craftsmen"),
                        craftsmanOwnerCraftsmanCount,
                    );
                } else if (
                    localCraftsman.publicId !== owner.publicId &&
                    localCraftsman.type !== "trader"
                ) {
                    moneyToPay += 1;
                }
            }

            // @HERE

            let rotatedIndex = goClockWise - (this.outerCircleRotation % 8);
            rotatedIndex = rotatedIndex < 0 ? 8 + rotatedIndex : rotatedIndex;
            let fieldType = this.outerPositionsIds[rotatedIndex];

            if (fieldType === "gold") {
                moneyToPay = 0;
            }

            if (moneyToPay <= owner.getData("coins")) {
                this.availableMovement[craftsmanId].outer[goClockWise] = true;
            }

            // Sprawdzamy czy można iść na pole po prawej (Counter Clock Wise)
            // Wyliczamy wymagane pieniądze
            moneyToPay = 0;
            // [id, new Set()]
            localCraftsmenIds = this.outerPathCraftsmen.get(goCounterClockWise);
            for (const localCraftsmanId of localCraftsmenIds) {
                const localCraftsman = this.craftsmen.get(localCraftsmanId);
                const craftsmanOwner = this.getPlayer(localCraftsman.publicId);
                const craftsmanOwnerCraftsmanCount =
                    craftsmanOwner.getData("craftsmen");

                if (
                    localCraftsman.publicId === owner.publicId &&
                    localCraftsman.type !== "trader"
                ) {
                    moneyToPay = 0;
                    break;
                }

                if (owner.getData("craftsmen") < craftsmanOwnerCraftsmanCount) {
                    moneyToPay += 0;
                    console.log(
                        "MOŻESZ SIĘ RUSZYĆ, BO GOŚĆ MA WIĘCEJ RZEMIEŚLNIKÓW",
                    );
                    console.log(
                        owner.getData("craftsmen"),
                        craftsmanOwnerCraftsmanCount,
                    );
                } else if (
                    localCraftsman.publicId !== owner.publicId &&
                    localCraftsman.type !== "trader"
                ) {
                    moneyToPay += 1;
                }
            }

            rotatedIndex = goCounterClockWise - (this.outerCircleRotation % 8);
            rotatedIndex = rotatedIndex < 0 ? 8 + rotatedIndex : rotatedIndex;
            fieldType = this.outerPositionsIds[rotatedIndex];

            if (fieldType === "gold") {
                moneyToPay = 0;
            }

            if (moneyToPay <= owner.getData("coins")) {
                this.availableMovement[craftsmanId].outer[goCounterClockWise] =
                    true;
            }

            // Jeżeli ma zboże

            for (const innerField of availableInnerFields) {
                if (
                    owner.getData("inventory").wheat >=
                    this.innerFieldMovementWheatCost +
                        (innerField === 2 ? 1 : 0)
                ) {
                    this.availableMovement[craftsmanId].inner[innerField] =
                        true;
                }
            }
        }

        // region pionek na inner
        if (craftsman.ringType === "inner" && craftsman.type !== "trader") {
            const goClockWise =
                currentField === 0 ? 2 : currentField === 1 ? 0 : 1;
            const goCounterClockWise =
                currentField === 0 ? 1 : currentField === 1 ? 2 : 0;

            const availableOuterFields =
                currentField === 0
                    ? [0, 1, 2]
                    : currentField === 1
                      ? [2, 3, 4, 5]
                      : [5, 6, 7];

            // Czy ktoś tam stoi i ma kasę
            if (
                owner.getData("inventory").wheat >=
                this.innerFieldMovementWheatCost
            ) {
                this.availableMovement[craftsmanId].inner[goClockWise] = true;
            }
            if (
                owner.getData("inventory").wheat >=
                this.innerFieldMovementWheatCost
            ) {
                this.availableMovement[craftsmanId].inner[goCounterClockWise] =
                    true;
            }

            // Jeżeli ma zboże

            for (const outerField of availableOuterFields) {
                let moneyToPay = 0;
                let hasOtherCraftsman = false;
                let localCraftsmenIds = this.outerPathCraftsmen.get(outerField);
                for (const localCraftsmanId of localCraftsmenIds) {
                    const localCraftsman = this.craftsmen.get(localCraftsmanId);
                    if (
                        localCraftsman.publicId === owner.publicId &&
                        localCraftsman.type !== "trader"
                    ) {
                        hasOtherCraftsman = true;
                        moneyToPay = 0;
                        break;
                    }

                    if (
                        localCraftsman.publicId !== owner.publicId &&
                        localCraftsman.type !== "trader"
                    ) {
                        moneyToPay += 1;
                    }
                }

                if (this.getOuterGuild(outerField)) {
                    if (
                        this.getOuterGuild(outerField).publicId !==
                            owner.publicId &&
                        !hasOtherCraftsman
                    ) {
                        moneyToPay++;
                    } else {
                        moneyToPay = 0;
                    }
                }

                if (moneyToPay <= owner.getData("coins")) {
                    this.availableMovement[craftsmanId].outer[outerField] =
                        true;
                }
            }
        }

        if (craftsman.type === "trader") {
            if (craftsman.ringType === "outer") {
                const goClockWise = currentField === 0 ? 7 : currentField - 1;
                const goCounterClockWise =
                    currentField === 7 ? 0 : currentField + 1;

                const availableInnerFields =
                    currentField === 2
                        ? [0, 1]
                        : currentField === 5
                          ? [1, 2]
                          : currentField < 2
                            ? [0]
                            : currentField < 5
                              ? [1]
                              : [2];

                this.availableMovement[craftsmanId].outer[goClockWise] = true;
                this.availableMovement[craftsmanId].outer[goCounterClockWise] =
                    true;

                for (const innerField of availableInnerFields) {
                    this.availableMovement[craftsmanId].inner[innerField] =
                        true;
                }
            }

            if (craftsman.ringType === "inner") {
                const goClockWise =
                    currentField === 0 ? 2 : currentField === 1 ? 0 : 1;
                const goCounterClockWise =
                    currentField === 0 ? 1 : currentField === 1 ? 2 : 0;

                const availableOuterFields =
                    currentField === 0
                        ? [0, 1, 2]
                        : currentField === 1
                          ? [2, 3, 4, 5]
                          : [5, 6, 7];

                this.availableMovement[craftsmanId].inner[goClockWise] = true;
                this.availableMovement[craftsmanId].inner[goCounterClockWise] =
                    true;

                for (const outerField of availableOuterFields) {
                    this.availableMovement[craftsmanId].outer[outerField] =
                        true;
                }
            }
        }
    }

    setAvailableMovementsForCraftsmen(publicId) {
        const playersCraftsMan = this.craftsmenOwners.get(publicId);

        this.availableMovement = {};
        playersCraftsMan.forEach((craftsmanId) => {
            this.setAvailableMovementsForCraftsman(craftsmanId);
        });
    }

    // region NEW TURN
    // @event
    newTurn({ publicId }, omitCheck) {
        if (!omitCheck) this.eventChecker(publicId, actions.NEW_TURN);

        this.currentPlayerIndex++;

        if (this.currentPlayerIndex >= this.playersQueue.length) {
            this.currentPlayerIndex = 0;
            this.turn++;
            this.outerCircleRotation += 1;
            this.innerCircleRotation += 1;

            if (this.round === 0) {
                this.availableMovement = {};
                this.availableMovement[this.currentPlayerIndex] = {
                    inner: [false, false, false],
                    outer: [true, true, true, true, true, true, true, true],
                };
            }
        }

        if (this.turn > this.maxTurn) {
            this.turn = 1;
            this.round++;

            // Zabieramy zboża graczom.

            if (this.round === 1) {
                this.maxTurn = 6;
                this.resetCircle();
            }
        }

        // region killing craftsman

        // region setting next player
        if (this.round !== 0) {
            this.movedCraftsmen.clear();
            this.setDefaultActions();
            this.setAvailableMovementsForCraftsmen(
                this.playersQueue[this.currentPlayerIndex],
            );
            // usuwamy zakaz odnawiania tradera, aktualizujemy tradera,
            // na trade undefined i potem znowu ustawiamy, że można go odświeżyć.
            // to dlatego, że reset w updaeTrader blokuje potem odświeżanie tradera
            // mechanika przewidziana dla obracania planszy
            // ale reset jest również w przypadku nowej tury
            // i tam nie powinno być resetedTrader na true

            this.resetedTrader = false;
            this.updateTrader({
                publicId: this.playersQueue[this.currentPlayerIndex],
                reset: true,
            });
            this.resetedTrader = false;
            this.tradeCount = {
                fieldNumber: undefined,
                currentSell: 0,
                currentBuy: 0,
            };
        }

        const player = this.getPlayer(publicId);
        if (player.getData("points") >= 12) {
            this.endGame();
            return [
                {
                    target: "lobby",
                    eventName: "endGame",
                    data: this.aggregateEndGameStats(),
                },
                ...this.sendGameDataToAll(),
            ];
        }

        return this.sendGameDataToAll();
    }

    // region ROTATE
    // @event
    rotate({ publicId }) {
        this.eventChecker(publicId, actions.ROTATE);
        const player = this.getPlayer(publicId);

        this.pay(player, this.rotateCost.resources);

        const randomChance = getRandomNumber(0, 10);

        if (randomChance === 1) {
            this.resetCircle();
            player.setData("stats", (stats) => {
                stats.superRotations += 1;
                return stats;
            });
        } else {
            this.innerCircleRotation += 1;
            this.outerCircleRotation += 1;
        }

        player.setData("stats", (stats) => {
            stats.rotations += 1;
            return stats;
        });

        this.updateTrader({ publicId, reset: true });

        return this.sendGameDataToAll();
    }

    // region UPDATE TRADER
    updateTrader({ publicId, ringType, fieldId, reset }) {
        const player = this.getPlayer(publicId);
        let newTrade;
        if (this.resetedTrader) {
            return;
        }
        if (reset) {
            newTrade = {
                buyAmount: 0,
                sellAmount: 0,
                allowBuying: false,
                allowSelling: false,
                resource: "undefined",
            };
            this.resetedTrader = true;
        } else {
            if (!ringType || fieldId === undefined) {
                const craftsmen = this.craftsmenOwners.get(publicId);
                for (const craftstmanId of craftsmen) {
                    const craftsman = this.craftsmen.get(craftstmanId);
                    if (craftsman.type === "trader") {
                        fieldId = craftsman.fieldId;
                        ringType = craftsman.ringType;
                        break;
                    }
                }
            }

            if (!ringType || fieldId === undefined) {
                this.log("Nie znaleziono handlarza");
                console.error("Nie znaleziono handlarza");
                return;
            }

            let resource;

            if (ringType === "outer") {
                let rotatedIndex = fieldId - (this.outerCircleRotation % 8);
                rotatedIndex =
                    rotatedIndex < 0 ? 8 + rotatedIndex : rotatedIndex;
                resource = this.outerPositionsIds[rotatedIndex].split("_")[0];
            } else {
                resource =
                    this.innerPositionsIds[
                        (this.innerCircleRotation + fieldId) % 3
                    ];
            }

            if (resource === "gold") {
                newTrade = {
                    buyAmount: 0,
                    sellAmount: 0,
                    allowBuying: false,
                    allowSelling: false,
                    resource: "coins",
                };
            } else {
                const blockSell =
                    this.tradeCount.currentSell >= this.tradeCount.fieldNumber;
                const blockBuy =
                    this.tradeCount.currentBuy >= this.tradeCount.fieldNumber;

                let buyAmount = 3;
                let sellAmount = 2;

                if (ringType === "inner") {
                    buyAmount = 6;
                    sellAmount = 4;

                    if (resource === "glass") {
                        sellAmount = 5;
                    }

                    if (resource === "amber") {
                        sellAmount = 2;
                    }
                }

                const canBuy =
                    player.getData("coins") >= buyAmount && !blockBuy;

                const canSell =
                    player.getData("inventory")[resource] > 0 && !blockSell;

                newTrade = {
                    buyAmount,
                    sellAmount,
                    allowBuying: canBuy,
                    allowSelling: canSell,
                    resource,
                };
            }
        }
        player.setData("trading", () => newTrade);
    }

    // region BUY CART
    // @event

    buyCart({ publicId }) {
        this.eventChecker(publicId, actions.BUY_CART);
        const player = this.getPlayer(publicId);

        if (
            player.getData("maxInventorySpace") >= this.maxPlayersInventorySpace
        ) {
            throw new Error("Nie możesz dokupić więcej wózków");
        }

        const previousCartCost = player.getData("cartCost");

        this.pay(player, previousCartCost);

        player.setData("maxInventorySpace", (oldMax) => oldMax + 1);

        const newMax = player.getData("maxInventorySpace");

        if (newMax === this.maxPlayersInventorySpace) {
            player.setData("canBuyCart", () => false);
        }

        const commonResources = ["wheat", "wood", "stone", "brick", "iron"];
        const luxuryResources = ["silk", "glass", "amber"];
        const nextSlot = newMax + 1;

        player.setData("cartCost", () => {
            switch (nextSlot) {
                case 6: {
                    const pool = [...commonResources];
                    const aIdx = Math.floor(Math.random() * pool.length);
                    const a = pool.splice(aIdx, 1)[0];
                    const b = pool[Math.floor(Math.random() * pool.length)];
                    return [
                        [a, 2],
                        [b, 1],
                    ];
                }

                case 7: {
                    const resource =
                        luxuryResources[
                            Math.floor(Math.random() * luxuryResources.length)
                        ];
                    return [[resource, 1]];
                }

                case 8: {
                    const previousResource = previousCartCost?.[0]?.[0];
                    const pool = luxuryResources.filter(
                        (res) => res !== previousResource,
                    );

                    return [
                        [pool[0], 1],
                        [pool[1], 1],
                    ];
                }
                case 9: {
                    return [["coins", 10]];
                }

                default:
                    return [["wood", 2]];
            }
        });

        return this.sendGameDataToAll();
    }

    // region MOVE CRAFTSMAN
    // @event
    moveCraftsman({ publicId, data }) {
        this.eventChecker(publicId, actions.MOVE_CRAFTSMAN);
        const player = this.getPlayer(publicId);

        const trackGain = (resource, amount) => {
            player.setData("stats", (stats) => {
                stats.resourcesGained[resource] =
                    (stats.resourcesGained[resource] || 0) + amount;
                return stats;
            });
        };

        let { ringType, fieldId, craftsmanId } = data;
        console.log("DANE Z KLIENTA: ", ringType, fieldId);

        // Jak nie zaznaczony to znajdź takiego co ostatnio się go dodało.
        if (craftsmanId === null) {
            const craftsmen = this.craftsmenOwners.get(publicId);
            craftsmanId = Math.max(...craftsmen);
        }

        const craftsman = this.craftsmen.get(craftsmanId);
        const isTrader = craftsman.type === "trader";
        const isNotTrader = craftsman.type !== "trader";

        console.log("CZY JEST HANDLARZEM?", isTrader);

        if (craftsman.getFieldId() !== null) {
            if (craftsman.ringType === "outer")
                this.outerPathCraftsmen
                    .get(craftsman.getFieldId())
                    .delete(craftsman.id);
            if (craftsman.ringType === "inner")
                this.innerPathCraftsmen
                    .get(craftsman.getFieldId())
                    .delete(craftsman.id);
        }

        if (ringType === "outer" && isNotTrader) {
            // Opłata za gildie
            console.log("Zewnętrzne Koło");

            // Sprawdzamy czy stoisz na swojej gildii
            let playersGuild = false;
            if (
                this.getOuterGuild(fieldId) &&
                this.getOuterGuild(fieldId).publicId === publicId
            ) {
                playersGuild = true;
            }

            // Sprawdzamy czy są tam pionki innych graczy
            // [id, new Set()]
            let playersCraftsmanPresent = false;
            let localCraftsmenIds = this.outerPathCraftsmen.get(fieldId);
            for (const localCraftsmanId of localCraftsmenIds) {
                const localCraftsman = this.craftsmen.get(localCraftsmanId);
                if (
                    localCraftsman.publicId === publicId &&
                    localCraftsman.type !== "trader"
                ) {
                    playersCraftsmanPresent = true;
                    console.log(
                        "Gracz ma innego rzemieślnika na polu na które idzie",
                    );
                    break;
                }
            }

            let isGold = false;

            if (ringType === "outer") {
                let rotatedIndex = fieldId - (this.outerCircleRotation % 8);
                rotatedIndex =
                    rotatedIndex < 0 ? 8 + rotatedIndex : rotatedIndex;

                const fieldType = this.outerPositionsIds[rotatedIndex];
                isGold = fieldType === "gold";
            }

            if (!playersCraftsmanPresent && !playersGuild && !isGold) {
                console.log("pobieramy monety");
                let index = 1;

                for (const localCraftsmanId of localCraftsmenIds) {
                    console.log("Pionek innego gracza nr: #", index++);

                    const localCraftsman = this.craftsmen.get(localCraftsmanId);
                    const craftsmanOwner = this.getPlayer(
                        localCraftsman.publicId,
                    );
                    const craftsmanOwnerCraftsmanCount =
                        craftsmanOwner.getData("craftsmen");

                    if (
                        player.getData("craftsmen") <
                        craftsmanOwnerCraftsmanCount
                    ) {
                        console.log(
                            "POMIJAMY PŁACENIE, BO MA WIĘCEJ RZEMIEŚLNIKÓW",
                        );
                        console.log(
                            player.getData("craftsmen"),
                            craftsmanOwnerCraftsmanCount,
                        );

                        continue;
                    }

                    // Nie pobieramy monety, gdy jest to handlarz
                    if (localCraftsman.type === "trader") continue;

                    console.log(`Gracz ${publicId} ma zabraną monetę`);
                    console.log("PRZED: ", player.getData("coins"));
                    player.setData("coins", (coins) => coins - 1);
                    player.setData("stats", (stats) => {
                        stats.coinsPaidToOthers += 1;
                        return stats;
                    });
                    console.log("PO: ", player.getData("coins"));

                    console.log(
                        `Gracz ${localCraftsman.publicId} otrzymuje monetę`,
                    );
                    const localCraftsmanOwner = this.getPlayer(
                        localCraftsman.publicId,
                    );
                    console.log(
                        "PRZED: ",
                        localCraftsmanOwner.getData("coins"),
                    );
                    localCraftsmanOwner.setData("coins", (coins) => coins + 1);
                    localCraftsmanOwner.setData("stats", (stats) => {
                        stats.coinsFromStanding += 1;
                        return stats;
                    });
                    console.log("PO: ", localCraftsmanOwner.getData("coins"));
                }
            }
        } else if (isNotTrader) {
            console.log(
                "Gracz porusza się po wewnętrznym kole. Zabieramy mu zboże w wysokości: ",
                this.innerFieldMovementWheatCost,
            );

            player.setData("inventory", (inventory) => {
                inventory.wheat -= this.innerFieldsResourcesAmount[fieldId] + 1;
                return inventory;
            });

            console.log("PO: ", player.getData("inventory").wheat);
        }

        if (ringType === "outer") {
            this.outerPathCraftsmen.get(fieldId).add(craftsmanId);
        } else {
            this.innerPathCraftsmen.get(fieldId).add(craftsmanId);
        }

        craftsman.setPosition(fieldId, ringType);

        /*  
            const resources = {
                wood: 1,
                stone: 0,
                wheat: 2,
                brick: 0,
                iron: 5,
                glass: 0,
                amber: 0,
                silk: 0,
            }; 
        */

        // Otrzymanie surowca
        // region move - surowce
        if (
            !this.availableActions.includes(actions.PLACE_CRAFTSMAN) &&
            isNotTrader
        ) {
            if (ringType !== "outer") {
                let rotatedIndex = (this.innerCircleRotation + fieldId) % 3;
                let amount = Math.min(
                    this.innerFieldsResourcesAmount[fieldId],
                    player.getFreeInventorySpace(),
                );

                amount = Math.max(0, amount);

                rotatedIndex =
                    rotatedIndex === 3
                        ? 0
                        : rotatedIndex === 4
                          ? 1
                          : rotatedIndex;
                player.setData("inventory", (inv) => {
                    inv[this.innerPositionsIds[rotatedIndex]] += amount;
                    trackGain(this.innerPositionsIds[rotatedIndex], amount);
                    return inv;
                });
            } else {
                let rotatedIndex = fieldId - (this.outerCircleRotation % 8);
                rotatedIndex =
                    rotatedIndex < 0 ? 8 + rotatedIndex : rotatedIndex;

                const fieldType = this.outerPositionsIds[rotatedIndex];
                let amount = Math.min(
                    this.outerFieldsResourcesAmount[fieldId],
                    player.getFreeInventorySpace(),
                );

                amount = Math.max(0, amount);

                if (fieldType === "gold") {
                    player.setData(
                        "coins",
                        (oldCoins) =>
                            oldCoins +
                            this.outerFieldsResourcesAmount[fieldId] +
                            1,
                    );
                } else {
                    const resourceMap = {
                        brick: { brick: amount },

                        stone_wheat: {
                            stone: amount === 0 ? 0 : amount < 3 ? 1 : 2,
                            ...(amount > 1 && { wheat: 1 }),
                        },
                        wood_wheat: {
                            wood: amount === 0 ? 0 : amount < 3 ? 1 : 2,
                            ...(amount > 1 && { wheat: 1 }),
                        },
                        iron_wheat: {
                            iron: amount === 0 ? 0 : amount < 3 ? 1 : 2,
                            ...(amount > 1 && { wheat: 1 }),
                        },
                        brick_wheat: {
                            brick: amount === 0 ? 0 : amount < 3 ? 1 : 2,
                            ...(amount > 1 && { wheat: 1 }),
                        },
                    };

                    const gains = resourceMap[fieldType] ?? {
                        [fieldType]: amount,
                    };

                    player.setData("inventory", (inv) => {
                        for (const [resource, value] of Object.entries(gains)) {
                            inv[resource] += value;
                        }
                        for (const [resource, value] of Object.entries(gains)) {
                            trackGain(resource, value);
                        }
                        return inv;
                    });
                }
            }
        }

        // Rzemieślnik nie może się już ruszać
        delete this.availableMovement[craftsmanId];
        this.movedCraftsmen.add(craftsmanId);

        if (this.round === 0) {
            return this.newTurn({ publicId }, true);
        }

        // region move - trade
        if (isTrader) {
            // Zaaktualizuj bank
            const fieldNumber =
                ringType === "outer"
                    ? this.outerFieldsResourcesAmount[fieldId]
                    : this.innerFieldsResourcesAmount[fieldId];

            this.tradeCount = {
                fieldNumber,
                currentSell: 0,
                currentBuy: 0,
            };
            this.updateTrader({ publicId, ringType, fieldId });
        }

        if (this.availableActions.includes(actions.PLACE_CRAFTSMAN)) {
            this.setDefaultActions();
        }

        this.setAvailableMovementsForCraftsmen(publicId);

        return this.sendGameDataToAll();
    }

    // region BUY CRAFTSMAN
    // @event
    buyCraftsman({ publicId }) {
        this.eventChecker(publicId, actions.BUY_CRAFTSMAN);
        const player = this.getPlayer(publicId);
        const canBuyCraftsmann = player.getData("canBuyCraftsman");

        if (!canBuyCraftsmann)
            throw new Error("Osiągnięto maksymalną liczbę rzemieślników");

        const craftsmanCost = player.getData("craftsmanCost");

        this.pay(player, craftsmanCost);

        // Dodanie craftsman'a
        let craftsmanId = this.AVAILABLE_ID++;
        const craftsman = new Craftsman(publicId, player.color, craftsmanId);
        this.craftsmen.set(craftsmanId, craftsman);
        this.craftsmenOwners.get(publicId).add(craftsmanId);

        player.setData("craftsmen", (old) => old + 1);

        if (player.getData("craftsmen") >= this.maxCraftsman) {
            player.setData("canBuyCraftsman", () => false);
        }

        player.setData("craftsmanCost", () => {
            return [
                ["wheat", 3],
                ["iron", 2],
                ["glass", 1],
            ];
        });

        this.availableActions = [
            actions.PLACE_CRAFTSMAN,
            actions.MOVE_CRAFTSMAN,
        ];

        this.setAvailableMovementsForCraftsmen(publicId);
        return this.sendGameDataToAll();
    }

    // region BUY TRADER
    // @event
    buyTrader({ publicId }) {
        this.eventChecker(publicId, actions.BUY_CRAFTSMAN);
        const player = this.getPlayer(publicId);
        const hasTrader = player.getData("trader");

        if (hasTrader)
            throw new Error("Możesz posiadać tylko jednego handlarza");

        this.pay(player, this.tradeUnlockCost);

        const traderId = this.AVAILABLE_ID++;
        const trader = new Craftsman(
            publicId,
            player.color,
            traderId,
            "trader",
        );
        this.craftsmen.set(traderId, trader);
        this.craftsmenOwners.get(publicId).add(traderId);

        player.setData("trader", () => true);

        this.availableActions = [
            actions.PLACE_CRAFTSMAN,
            actions.MOVE_CRAFTSMAN,
        ];

        /*

        gold jest na pozycji indeksi 4 [0-7]

        11 obrotu = 7

        */
        const goldResourceIndex = this.outerPositions["gold"];
        const visibleGoldField =
            (goldResourceIndex + (this.outerCircleRotation % 8)) % 8;

        return this.moveCraftsman({
            publicId,
            data: {
                ringType: "outer",
                fieldId: visibleGoldField,
                craftsmanId: traderId,
            },
        });
    }

    // region BUILD GUILD
    // @event

    buildGuild({ publicId, data }) {
        this.eventChecker(publicId, actions.BUILD_GUILD);
        const { ringType, fieldId } = data;

        if (this.guilds[ringType][fieldId]) {
            throw new Error("W tej dzielnicy już znajduje się gildia");
        }

        const player = this.getPlayer(publicId);

        this.pay(player, player.getData("guildCost"));

        this.guilds[ringType][fieldId] = { hex: player.color.hex, publicId };

        this.availableActions = this.availableActions.filter(
            (action) => action !== actions.BUILD_GUILD,
        );

        player.setData("guildCost", (oldGuildCost) => {
            return [
                [
                    "stone",
                    oldGuildCost[0][1] === 1
                        ? oldGuildCost[0][1] + 2
                        : oldGuildCost[0][1] + 1,
                ],
                ["brick", oldGuildCost[1][1] + 1],
            ];
        });

        this.log(
            `Gracz [${player.username}] w okręgu [${ringType}] na polu [${fieldId}] wybudował gildię.
            \nJest to dzielnica [${ringType === "outer" ? this.outerPositionsIds[fieldId] : this.innerPositionsIds[fieldId]}]`,
        );
        this.log(`
            Aktualne gildie:
            Inner: ${this.guilds.inner.map((v, index) => (v ? "ID-" + index + ": " + v : "ID: empty")).join(", ")}
            Outer: ${this.guilds.outer.map((v, index) => (v ? "ID-" + index + ": " + v : "ID: empty")).join(", ")}
        `);

        return this.sendGameDataToAll();
    }

    // region CONTRACTS
    // @event
    completeContract({ publicId, data: contractId }) {
        this.eventChecker(publicId, actions.COMPLETE_CONTRACT);

        const contract = this.currentContracts[contractId];
        const player = this.getPlayer(publicId);
        if (!contract.available) {
            throw new Error("Ten kontrakt został już wypełniony");
        }

        const contractCost = contract.requirements;

        this.payWithAmber(player, contractCost);

        player.setData("contracts", (contracts) => contracts + 1);

        if (contract.points === 1) {
            player.setData("contracts1", (contracts) => contracts + 1);
        } else if (contract.points === 2) {
            player.setData("contracts2", (contracts) => contracts + 1);
        } else {
            player.setData("contracts3", (contracts) => contracts + 1);
        }

        player.setData("points", (points) => points + contract.points);

        this.drawSingleContract(contractId);

        if (player.getData("points") >= 12) {
            this.endGame();
            return [
                {
                    target: "lobby",
                    eventName: "endGame",
                    data: this.aggregateEndGameStats(),
                },
                ...this.sendGameDataToAll(),
            ];
        }

        return this.sendGameDataToAll();
    }

    //@event
    // region REROLL
    rerollContract({ publicId, data: contractId }) {
        this.eventChecker(publicId, actions.REROLL_CONTRACT);
        const contract = this.currentContracts[contractId];

        if (!contract.available) {
            throw new Error("Ten kontrakt został już wypełniony");
        }

        const player = this.getPlayer(publicId);

        if (player.getData("coins") < this.rerollCost) {
            throw new Error("Nie masz wystarczająco pieniędzy.");
        }

        player.setData("coins", (coins) => coins - 3);

        this.reroll(contractId);

        player.setData("stats", (stats) => {
            stats.rerolls += 1;
            return stats;
        });

        this.setAvailableMovementsForCraftsmen(publicId);
        return this.sendGameDataToAll();
    }

    //@event
    // region sellInventoryItem
    sellInventoryItem({ publicId, data: resource }) {
        this.eventChecker(publicId, actions.SELL_INVENTORY);

        const player = this.getPlayer(publicId);

        if (player.getData("inventory")[resource] < 1) {
            throw new Error("Nie posiadasz surowca do sprzedania");
        }

        player.setData("inventory", (inv) => {
            inv[resource] -= 1;
            return inv;
        });

        let additionalCoins = 1;

        if (resource === "silk") {
            additionalCoins = 2;
        }

        if (resource === "glass") {
            additionalCoins = 3;
        }

        player.setData("coins", (coins) => coins + additionalCoins);

        player.setData("stats", (stats) => {
            stats.tradeSoldAmount += 1;
            stats.tradesSold += 1;
            return stats;
        });

        this.updateTrader({ publicId });
        this.setAvailableMovementsForCraftsmen(publicId);
        return this.sendGameDataToAll();
    }

    // @event
    // region BUY RESOURCR
    buyTrade({ publicId }) {
        this.eventChecker(publicId, actions.TRADE);
        const player = this.getPlayer(publicId);
        const currentTrade = player.getData("trading");

        if (!player.getData("trader")) {
            throw new Error("Nie możesz handlować bez handlarza");
        }

        if (!player.getFreeInventorySpace()) {
            throw new Error("Nie masz wystarczająco miejsca");
        }

        if (!currentTrade.allowBuying) {
            throw new Error("Nie możesz kupować");
        }

        if (player.getData("coins") < currentTrade.buyAmount)
            throw new Error("Nie masz wystarczająco pieniędzy");

        // kup
        player.setData("coins", (coins) => coins - currentTrade.buyAmount);
        player.setData("inventory", (inventory) => {
            inventory[currentTrade.resource] += 1;
            return inventory;
        });

        player.setData("stats", (stats) => {
            stats.tradesBought += 1;
            stats.tradesBoughtAmount += currentTrade.buyAmount;
            return stats;
        });

        this.tradeCount.currentBuy++;

        this.updateTrader({ publicId });
        this.setAvailableMovementsForCraftsmen(publicId);
        return this.sendGameDataToAll();
    }
    // @event
    // region SELL RESOURCR
    sellTrade({ publicId }) {
        this.eventChecker(publicId, actions.TRADE);
        const player = this.getPlayer(publicId);
        const currentTrade = player.getData("trading");

        if (!player.getData("trader")) {
            throw new Error("Nie możesz handlować bez handlarza");
        }

        if (!player.getData("trading").allowSelling) {
            throw new Error("Nie możesz sprzedawać");
        }

        if (player.getData("inventory")[currentTrade.resource] <= 0) {
            throw new Error("Nie masz wymaganego surowca");
        }

        // sprzedaj
        player.setData("coins", (coins) => coins + currentTrade.sellAmount);
        player.setData("inventory", (inventory) => {
            inventory[currentTrade.resource] -= 1;
            return inventory;
        });

        player.setData("stats", (stats) => {
            stats.tradesSold += 1;
            stats.tradeSoldAmount += currentTrade.sellAmount;
            return stats;
        });

        this.tradeCount.currentSell++;

        this.updateTrader({ publicId });
        this.setAvailableMovementsForCraftsmen(publicId);
        return this.sendGameDataToAll();
    }
}
