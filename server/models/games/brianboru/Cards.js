import cards from "./config/cards.js";
import dialogs from "./config/dialogs.js";
import statuses from "./config/statuses.js";

export default class Cards {
    constructor(game) {
        this.game = game;
        this.players = game.players;
        this.passedCardsPlayerCount = 0;
        this.passedCardsData = [];

        this.passingPhase = { current: 1, total: 3 };
        this.choosingCardsPhase = { current: 1, total: this.players.size };

        this.chosenCards = [];
        // this.chosenCards = [
        //     [
        //         {
        //             id: 21,
        //             bottom1: ["money_plus", "money_plus", "triquetra_5"],
        //             bottom2: [],
        //             top: ["money_minus", "triquetra"],
        //             type: "gray",
        //         },
        //         this.game.getCurrentPlayer(),
        //     ],

        //     [
        //         {
        //             id: 22,
        //             bottom1: ["money_plus", "money_plus", "triquetra_5"],
        //             bottom2: [],
        //             top: ["money_minus", "money_minus", "triquetra"],
        //             type: "gray",
        //         },
        //         this.game.getCurrentPlayer(),
        //     ],

        //     [
        //         {
        //             id: 23,
        //             bottom1: ["money_plus", "triquetra_5"],
        //             bottom2: ["letter", "letter", "letter"],
        //             top: ["money_minus", "money_minus", "triquetra"],
        //             type: "yellow",
        //         },
        //         this.game.getCurrentPlayer(),
        //     ],

        //     [
        //         {
        //             id: 24,
        //             bottom1: ["money_plus", "triquetra_5"],
        //             bottom2: ["axe", "axe", "axe"],
        //             top: ["money_minus", "money_minus", "triquetra"],
        //             type: "red",
        //         },
        //         this.game.getCurrentPlayer(),
        //     ],

        //     [
        //         {
        //             id: 25,
        //             bottom1: ["money_plus", "triquetra_5"],
        //             bottom2: ["church", "church", "church"],
        //             top: ["money_minus", "money_minus", "triquetra"],
        //             type: "blue",
        //         },
        //         this.game.getCurrentPlayer(),
        //     ],
        // ];

        this.cards = this.initalizeRandomCards();
        this.giveCardsToPlayers();
    }

    initalizeRandomCards() {
        return structuredClone(cards).sort(() => Math.random() - 0.5);
    }

    giveCardsToPlayers() {
        const playerCount = this.game.playersQueue.length;
        const cardsToGive = playerCount === 5 ? 5 : playerCount === 4 ? 6 : 8;
        for (const player of this.players.values()) {
            player.setData("cards", () => this.cards.splice(0, cardsToGive));
        }
    }

    resetCardDrawPhase() {
        for (const player of this.players.values()) {
            player.setStatus(statuses.REJECT_CARDS);
            player.addDialog(dialogs.REJECT_CARDS);
            player.setData("cards", () => []);
            player.setData("lockedCards", () => new Set());
        }

        this.game.setMessage("Odrzucanie kart");
        this.cards = this.initalizeRandomCards();
        this.giveCardsToPlayers();
        this.passedCardsPlayerCount = 0;
        this.passedCardsData = [];
        this.passingPhase.current = 1;
    }

    getPlayerCards(player) {
        return [
            player.getData("cards"),
            Array.from(player.getData("lockedCards")),
        ];
    }

    getChosenCards() {
        return this.chosenCards.map(([card, player]) => [
            card,
            player.getPlayerData(),
        ]);
    }

    passCards() {
        for (const cardsToPass of this.passedCardsData) {
            const [publicId, ...cards] = cardsToPass;

            const nextPlayer = this.game.getNextPlayer(publicId);

            nextPlayer.setData("cards", (oldCards) => [...oldCards, ...cards]);
        }

        this.passedCardsPlayerCount = 0;

        const passPhase = (this.passingPhase.current += 1);

        if (passPhase > this.passingPhase.total) {
            this.passedCardsData = [];

            this.game.startPlayingPhase();

            return this.game.sendGameDataToAll();
        } else {
            this.players.values().forEach((player) => {
                player
                    .setStatus(statuses.REJECT_CARDS)
                    .addDialog(dialogs.REJECT_CARDS);
            });

            this.passedCardsData = [];
            return this.game.sendGameDataToAll();
        }
    }

    // region Events

    // @event
    selectCardsToPass(data) {
        const player = this.game.getPlayer(data.publicId);
        const cardsIdToSave = data.data;

        // Test
        if (cardsIdToSave.length !== 1) {
            // if (cardsIdToSave.length !== 4 - this.passingPhase.current) {
            throw new Error(
                `Przekazałeś niewłaściwą ilość kart: ${cardsIdToSave.length} zamiast ${4 - this.passingPhase.current}`,
            );
        }

        // To w ogóle do wywalenia, bo lockedCards to SET kart, a nie ID
        const lockedCards = player.getData("lockedCards");
        const lockedCardsIds = Array.from(lockedCards).map((card) => card.id);
        for (const card of lockedCardsIds) {
            if (lockedCards.has(card)) {
                throw new Error(
                    `Nie możesz przekazać karty, którą dostałeś: ${card}`,
                );
            }
        }

        const cardsToPass = player
            .getData("cards")
            .filter(
                (card) =>
                    !cardsIdToSave.includes(card.id) &&
                    !lockedCardsIds.includes(card.id),
            );

        player.setData("cards", (oldCards) => {
            return oldCards.filter(
                (card) =>
                    cardsIdToSave.includes(card.id) ||
                    lockedCardsIds.includes(card.id),
            );
        });

        player.setData("lockedCards", (oldSet) => {
            player.getData("cards").forEach((card) => oldSet.add(card));
            return oldSet;
        });

        this.passedCardsData.push([data.publicId, ...cardsToPass]);

        this.passedCardsPlayerCount++;

        if (this.passedCardsPlayerCount === this.players.size) {
            return this.passCards();
        } else {
            player.setStatus(statuses.REJECT_CARDS_WAITING);
            return this.game.generateGameData(data.publicId);
        }
    }

    // @event
    chooseFirstCard(data) {
        const cardId = data.data;
        const cardType = cards[cardId - 1].type; // cards to tablica, nie mapa
        const player = this.game.getPlayer(data.publicId);

        console.log(`${player.username} wybrał pierwszą kartę`);

        if (
            cardType !== "gray" &&
            cardType !== this.game.regions.cityUnderAttackType
        )
            throw new Error(
                "Wybierz szarą kartę lub o typie atakowanego miasta",
            );

        const chosenCard = player
            .getData("cards")
            .find((card) => card.id === cardId);

        this.chosenCards.push([chosenCard, player]);

        player.setData("cards", (oldCards) => {
            return oldCards.filter((card) => card !== chosenCard);
        });

        player.setStatus(statuses.WAITING);
        this.choosingCardsPhase.current++;

        this.game.nextTurn(); // zwiększamy indeks aktualnego gracza o 1, dzięki temu
        // getCurrentPlayer zwróci następnego w kolejce gracza.
        // Pierwszym graczem na początku gry jest ten ze wskaźnikiem pierwszego gracza
        // Trzeba będzie potem ustawić ten index na tego gracza, który wygrał

        const nextPlayer = this.game.getCurrentPlayer();
        nextPlayer.setStatus(statuses.CHOOSE_CARD);

        this.game.setMessage(`${nextPlayer.username} wybiera kartę`);

        return this.game.sendGameDataToAll();
    }

    // @event
    chooseCard(data) {
        const cardId = data.data;
        const player = this.game.getPlayer(data.publicId);

        const chosenCard = player
            .getData("cards")
            .find((card) => card.id === cardId);

        this.chosenCards.push([chosenCard, player]);

        player.setData("cards", (oldCards) => {
            return oldCards.filter((card) => card !== chosenCard);
        });

        player.setStatus(statuses.WAITING);

        if (this.choosingCardsPhase.current === this.choosingCardsPhase.total) {
            // Sortowanie kart
            this.chosenCards.sort(([cardA], [cardB]) => {
                return cardA.id - cardB.id;
            });

            // Największa karta o danym typie lub szara na sam koniec
            let winCardIndex = null;
            let winCardId = undefined;

            this.chosenCards.forEach(([card], index) => {
                if (
                    card.type === "gray" ||
                    card.type === this.game.regions.cityUnderAttackType
                ) {
                    if (winCardIndex === null) {
                        winCardIndex = index;
                        winCardId = card.id;
                    } else if (card.id > winCardId) {
                        winCardIndex = index;
                        winCardId = card.id;
                    }
                }
            });

            const [element] = this.chosenCards.splice(winCardIndex, 1);
            this.chosenCards.push(element);

            const [, nextPlayer] = this.chosenCards[0];
            nextPlayer.setStatus(statuses.CHOOSE_CARD_EFFECT);
            this.game.setMessage(`${nextPlayer.username} wybiera efekt karty`);

            return this.game.sendGameDataToAll();
        } else {
            this.choosingCardsPhase.current++;
            this.game.nextTurn();

            const nextPlayer = this.game.getCurrentPlayer();

            nextPlayer.setStatus(statuses.CHOOSE_CARD);

            this.game.setMessage(`${nextPlayer.username} wybiera kartę`);
        }

        return this.game.sendGameDataToAll();
    }

    // @event
    chooseCardEffect(data) {
        const [, player] = this.chosenCards.shift();
        player.setStatus(statuses.WAITING);

        console.log(data.data);

        if (this.chosenCards.length === 0) {
            player.setStatus(statuses.BUILD_ATTACKED_CITY);
            this.game.setMessage(`${player.username} buduje miasto`);
            return this.game.sendGameDataToAll();
        }

        const [, nextPlayer] = this.chosenCards[0];

        nextPlayer.setStatus(statuses.CHOOSE_CARD_EFFECT);
        this.game.setMessage(`${nextPlayer.username} wybiera efekt karty`);

        return this.game.sendGameDataToAll();
    }
}
