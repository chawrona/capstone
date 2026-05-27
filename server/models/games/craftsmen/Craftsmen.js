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
        this.maxPlayersInventorySpace = 18;
        this.rotateCost = {
            resources: [["iron", 1]],
            coins: 2,
        };
        this.maxCraftsman = 3;
        this.outerFieldsResourcesAmount = [1, 2, 2, 1, 1, 2, 1, 2];
        this.innerFieldsResourcesAmount = [1, 1, 2];
        this.guildCost = {
            outer: [
                ["stone", 2],
                ["brick", 2],
            ],
            inner: [
                ["stone", 3],
                ["brick", 3],
            ],
        };
        this.rerollCost = 3;
        this.tradeUnlockCost = [["silk", 3]];

        this.initialSetup();
    }

    // region INITIAL SETUP
    initialSetup() {
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        const innerKeys = ["glass", "silk", "amber"];
        const outerKeys = ["bricks", "gold", "iron", "stone", "wheat", "wood"];

        const additionalOuterKeys = [
            "stone_wheat",
            "wood_wheat",
            "iron_wheat",
            "bricks_wheat",
        ];

        shuffleArray(additionalOuterKeys);

        outerKeys.push(
            additionalOuterKeys.shift(),
            additionalOuterKeys.shift(),
        );

        shuffleArray(innerKeys);
        shuffleArray(outerKeys);

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
        let id = 0;
        for (const [publicId, player] of this.players) {
            const craftsmanId = id++;
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
        this.currentContracts = this.contracts[0].splice(0, 3);
        let elementsNeeded = 3;
        const fromSecondSubarray = this.contracts[1].splice(0, elementsNeeded);
        this.contracts[0].push(...fromSecondSubarray);
        elementsNeeded -= fromSecondSubarray.length;
        if (elementsNeeded > 0) {
            const fromThirdSubarray = this.contracts[2].splice(
                0,
                elementsNeeded,
            );
            this.contracts[0].push(...fromThirdSubarray);
        }
    }

    drawContracts() {
        this.currentContracts = this.contracts[0].splice(0, 3);
        let elementsNeeded = 3;
        const fromSecondSubarray = this.contracts[1].splice(0, elementsNeeded);
        this.contracts[0].push(...fromSecondSubarray);
        elementsNeeded -= fromSecondSubarray.length;
        if (elementsNeeded > 0) {
            const fromThirdSubarray = this.contracts[2].splice(
                0,
                elementsNeeded,
            );
            this.contracts[0].push(...fromThirdSubarray);
        }
    }

    reroll(index) {
        if (this.contracts[0].length === 0) {
            throw new Error("Nie ma już kart do podmienienia");
        }

        const oldCard = this.currentContracts[index];
        const newCard = this.contracts[0].shift();
        this.currentContracts[index] = newCard;
        this.contracts[0].push(oldCard);
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

    // region GENERATE START

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
                guildCost: this.guildCost,
                tradeUnlockCost: this.tradeUnlockCost,
                canReroll: this.contracts[0].length > 0,
                availableActions:
                    publicId === this.playersQueue[this.currentPlayerIndex]
                        ? this.availableActions
                        : [],
                you: player.getPlayerData(),
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
        ];
    }

    setAvailableMovementsForCraftsman(craftsmanId, reset = false) {
        if (reset) {
            this.availableMovement = {};
        }

        if (this.craftsmen.get(craftsmanId).getFieldId() === null) {
            this.availableMovement[craftsmanId] = {
                inner: [false, false, false],
                outer: [true, true, true, true, true, true, true, true],
            };
        } else {
            // Normalnie wyliczamy jego dostępne pola
            // koszt gildii, koszt innych graczy, koszt luksuwowej dzielnicy, czy już stoi tam gdzie stoi
            this.availableMovement[craftsmanId] = {
                inner: [false, false, false],
                outer: [true, true, true, true, true, true, true, true],
            };
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
                this.maxTurn = 4;
                this.resetCircle();
            }
        }

        if (this.round !== 0) {
            this.setDefaultActions();
            this.setAvailableMovementsForCraftsmen(publicId);
        }

        return this.sendGameDataToAll();
    }

    // region ROTATE
    // @event
    rotate({ publicId }) {
        this.eventChecker(publicId, actions.ROTATE);
        const player = this.getPlayer(publicId);
        const inventory = player.getData("inventory");

        for (const [resource, cost] of this.rotateCost.resources) {
            if (inventory[resource] < cost) {
                throw new Error("Nie masz wystarczająco surowców");
            }
        }

        player.setData("inventory", (oldResources) => {
            for (const [resource, cost] of this.rotateCost.resources) {
                oldResources[resource] -= cost;
            }
            return oldResources;
        });

        const randomChance = getRandomNumber(0, 10);
        if (randomChance === 1) {
            this.resetCircle();
        } else {
            this.innerCircleRotation += 1;
            this.outerCircleRotation += 1;
        }

        return this.sendGameDataToAll();
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

        const inventory = player.getData("inventory");

        for (const [resource, cost] of player.getData("cartCost")) {
            if (inventory[resource] < cost) {
                throw new Error("Nie masz wystarczająco surowców");
            }
        }

        player.setData("inventory", (oldResources) => {
            for (const [resource, cost] of player.getData("cartCost")) {
                oldResources[resource] -= cost;
            }
            return oldResources;
        });

        player.setData("maxInventorySpace", (oldMax) => oldMax + 1);

        if (
            player.getData("maxInventorySpace") ===
            this.maxPlayersInventorySpace
        ) {
            player.setData("canBuyCart", () => false);
        }

        return this.sendGameDataToAll();
    }

    // region MOVE CRAFTSMAN
    // @event
    moveCraftsman({ publicId, data }) {
        this.eventChecker(publicId, actions.MOVE_CRAFTSMAN);
        const player = this.getPlayer(publicId);

        let { ringType, fieldId, craftsmanId } = data;
        console.log("DANE Z KLIENTA: ", ringType, fieldId);

        // Jak nie zaznaczony to znajdź takiego co ostatnio się go dodało.
        if (craftsmanId === null) {
            const craftsmen = this.craftsmenOwners.get(publicId);
            craftsmanId = Math.max(...craftsmen);
        }

        const craftsman = this.craftsmen.get(craftsmanId);

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

        if (ringType === "outer") {
            // złoto jak ktoś tam stoi lub gildia
            this.outerPathCraftsmen.get(fieldId).add(craftsmanId);
        } else {
            // 2 zboża za wejście rzemieślnikiem
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
        // region SUROWCE
        if (!this.availableActions.includes(actions.PLACE_CRAFTSMAN)) {
            if (ringType !== "outer") {
                let rotatedIndex = (this.innerCircleRotation % 3) + fieldId;
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
                            oldCoins + this.outerFieldsResourcesAmount[fieldId],
                    );
                } else {
                    const resourceMap = {
                        bricks: { brick: amount },

                        stone_wheat: {
                            stone: amount < 3 ? 1 : 2,
                            ...(amount > 1 && { wheat: 1 }),
                        },
                        wood_wheat: {
                            wood: amount < 3 ? 1 : 2,
                            ...(amount > 1 && { wheat: 1 }),
                        },
                        iron_wheat: {
                            iron: amount < 3 ? 1 : 2,
                            ...(amount > 1 && { wheat: 1 }),
                        },
                        bricks_wheat: {
                            brick: amount < 3 ? 1 : 2,
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
                        return inv;
                    });
                }
            }
        }

        // Rzemieślnik nie może się już ruszać
        delete this.availableMovement[craftsmanId];

        if (this.round === 0) {
            return this.newTurn({ publicId }, true);
        }

        if (this.availableActions.includes(actions.PLACE_CRAFTSMAN)) {
            this.setDefaultActions();
        }

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

        const playerResources = player.getData("inventory");
        const craftsmanCost = player.getData("craftsmanCost");

        for (const [resource, cost] of craftsmanCost) {
            if (playerResources[resource] < cost)
                throw new Error("Nie masz wystarczająco surowców.");
        }

        for (const [resource, cost] of craftsmanCost) {
            playerResources[resource] -= cost;
        }

        // Dodanie craftsman'a
        const craftsmanId = this.craftsmen.size + 1;
        const craftsman = new Craftsman(publicId, player.color, craftsmanId);
        this.craftsmen.set(craftsmanId, craftsman);
        this.craftsmenOwners.get(publicId).add(craftsmanId);

        player.setData("craftsmen", (old) => old + 1);

        if (player.getData("craftsmen") >= this.maxCraftsman) {
            player.setData("canBuyCraftsman", () => false);
        }

        this.availableActions = [
            actions.PLACE_CRAFTSMAN,
            actions.MOVE_CRAFTSMAN,
        ];
        return this.sendGameDataToAll();
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
        const playerResources = player.getData("inventory");

        for (const [resource, cost] of this.guildCost[ringType]) {
            if (playerResources[resource] < cost)
                throw new Error("Nie masz wystarczająco surowców.");
        }

        for (const [resource, cost] of this.guildCost[ringType]) {
            playerResources[resource] -= cost;
        }

        this.guilds[ringType][fieldId] = { hex: player.color.hex };

        this.availableActions = this.availableActions.filter(
            (action) => action !== actions.BUILD_GUILD,
        );

        return this.sendGameDataToAll();
    }

    // region CONTRACTS
    // @event
    completeContract({ publicId, data: contractId }) {
        this.eventChecker(publicId, actions.COMPLETE_CONTRACT);

        const contract = this.currentContracts[contractId];

        if (!contract.available) {
            throw new Error("Ten kontrakt został już wypełniony");
        }

        const player = this.getPlayer(publicId);
        const playerResources = player.getData("inventory");
        const contractCost = contract.requirements;

        for (const [resource, cost] of contractCost) {
            if (playerResources[resource] < cost)
                throw new Error("Nie masz wystarczająco surowców.");
        }

        for (const [resource, cost] of contractCost) {
            playerResources[resource] -= cost;
        }

        player.setData("contracts", (contracts) => contracts + 1);

        if (player.getData("contracts") >= 10) {
            console.log("KONIEC GRY");
        }

        contract.available = false;

        if (
            !this.currentContracts[0].available &&
            !this.currentContracts[1].available &&
            !this.currentContracts[2].available
        ) {
            this.drawContracts();
        }

        return this.sendGameDataToAll();
    }

    //@event
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

        return this.sendGameDataToAll();
    }
}
