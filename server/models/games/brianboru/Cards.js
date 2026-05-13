import cards from "./config/cards.js";
import dialogs from "./config/dialogs.js";
import statuses from "./config/statuses.js";

export default class Cards {
    constructor(game) {
        this.game = game;
        this.players = game.players;
        this.passedCardsPlayerCount = 0;
        this.passedCardsData = [];

        this.setPassingPhase();

        this.hideCards = true;

        this.chosenCards = [];

        this.cards = this.initalizeRandomCards();
        this.giveCardsToPlayers();
    }

    initalizeRandomCards() {
        return structuredClone(cards).sort(() => Math.random() - 0.5);
    }

    setPassingPhase() {
        const size = this.players.size;
        this.passingPhase = {
            current: 1,
            total: size === 5 ? 3 : size === 4 ? 3 : 4,
        };
        this.choosingCardsPhase = { current: 1, total: size };
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
        this.choosingCardsPhase.current = 1;
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

    startRejectPhase() {
        this.hideCards = false;
        this.game.setMessage("Odrzucanie kart");

        this.game.addDialogToPlayers(dialogs.FIRST_PLAYER);
        this.game.addDialogToPlayers(dialogs.VIKINGS);
        this.game.addDialogToPlayers(dialogs.MARRIAGE);
        this.game.addDialogToPlayers(dialogs.REJECT_CARDS);

        this.game.setPlayersStatus(statuses.REJECT_CARDS);

        return this.game.sendGameDataToAll();
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

        if (player.getStatus() === statuses.REJECT_CARDS_WAITING) {
            throw new Error("Już przekazałeś karty w tej rundzie.");
        }

        if (player.getStatus() !== statuses.REJECT_CARDS) {
            throw new Error("To nie jest faza odrzucania kart.");
        }

        const cardsIdToSave = data.data;

        if (
            (cardsIdToSave.length !== 2 &&
                this.passingPhase.current !== this.passingPhase.total) ||
            (this.players.size === 5 &&
                this.passingPhase.current === this.passingPhase.total &&
                cardsIdToSave.length !== 1)
        ) {
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

        if (player.getStatus() !== statuses.CHOOSE_FIRST_CARD) {
            throw new Error("To nie twoja kolej na wybór pierwszej karty.");
        }

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

        if (player.getStatus() !== statuses.CHOOSE_CARD) {
            throw new Error("To nie twoja kolej na wybór karty.");
        }

        const chosenCard = player
            .getData("cards")
            .find((card) => card.id === cardId);

        this.chosenCards.push([chosenCard, player]);

        player.setData("cards", (oldCards) => {
            return oldCards.filter((card) => card !== chosenCard);
        });

        player.setStatus(statuses.WAITING);

        if (this.choosingCardsPhase.current >= this.choosingCardsPhase.total) {
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
        if (player.getStatus() !== statuses.CHOOSE_CARD_EFFECT) {
            throw new Error("To nie twoja kolej na wybór efektu karty.");
        }

        if (data.data.chosenBottom === "top" && this.chosenCards.length > 1) {
            throw new Error(
                "Nie możesz wybrać górnej akcji, jeśli nie wygrałeś lewy.",
            );
        }

        if (this.chosenCards.length === 0) {
            throw new Error("Brak kart do rozpatrzenia.");
        }

        // { chosenBottom: 'top', buyAdditional: 0, buildCity: false }
        const [card, player] = this.chosenCards.shift();
        player.setStatus(statuses.WAITING);

        const { chosenBottom, buyAdditional, buildCity } = data.data;

        const effects = chosenBottom;

        let letterCount = 0;
        let churchCount = 0;
        let buildingCity = false;
        let removingVikings = false;
        let vikingsCount = 0;

        for (const effect of card[effects]) {
            switch (effect) {
                case "church":
                    churchCount++;
                    break;
                case "letter":
                    letterCount++;
                    break;
                case "axe":
                    vikingsCount++;
                    break;
                case "money_plus":
                    player.setData("money", (oldMoney) => oldMoney + 1);
                    break;
                case "triquetra_5":
                    if (buildCity) buildingCity = true;
                    break;
                case "money_minus":
                    if (player.getData("money")) {
                        player.setData("money", (oldMoney) => oldMoney - 1);
                    } else {
                        player.setData("points", (oldPoints) =>
                            Math.max(oldPoints - 2, 0),
                        );
                    }
                    break;
                case "viking_shield":
                    removingVikings = true;
                    break;
            }
        }

        if (churchCount) {
            player.setData(
                "church",
                (oldChurch) => oldChurch + churchCount + buyAdditional,
            );
        }

        if (vikingsCount) {
            const vikingsToGet = Math.min(
                player.getData("vikings") + vikingsCount + buyAdditional,
                this.game.vikings.currentVikings,
            );

            player.setData("vikings", () => vikingsToGet);

            this.game.vikings.currentVikings -= vikingsToGet;
        }

        if (letterCount) {
            this.game.marriages.setPlayerMarriage(
                player,
                letterCount + buyAdditional,
            );
        }

        if (buyAdditional) {
            player.setData("money", (oldMoney) => oldMoney - buyAdditional * 2);
        }

        if (removingVikings && this.game.regions.doesPlayerHasVikings(player)) {
            player.setStatus(statuses.REMOVE_VIKINGS);
            this.game.regions.setCitiesToRemoveVikings(player);
            this.game.setMessage(`${player.username} odbija miasto wikingom`);
            return this.game.sendGameDataToAll();
        }

        if (buildingCity) {
            if (player.getData("money") >= 5) {
                player.setData("money", (old) => old - 5);
                player.setStatus(statuses.BUILD_BOUGHT_CITY);

                this.game.regions.setCitiesToBuy(player);

                this.game.setMessage(
                    `${player.username} buduje zakupione miasto`,
                );

                return this.game.sendGameDataToAll();
            }
        }

        return this.nextCardEffect(player);
    }

    // @event
    nextCardEffect(player) {
        // player przekazany tylko z chooseCardEffect. W innych miejscach gdzie wywołuje się nextCardEffect nie dostarczamy gracza.
        // Nigdy nie ma potrzeby bo są to miejsca, gdzie robią się akcję unikalne tylko dla graczy, którzy nie wygrali
        // NIE OPERAĆ TUTAJ NA PLAYERZE
        if (this.chosenCards.length === 0) {
            return this.game.regions.buildAttackedCity(player);
        }

        const [, nextPlayer] = this.chosenCards[0];

        nextPlayer.setStatus(statuses.CHOOSE_CARD_EFFECT);

        this.game.setMessage(`${nextPlayer.username} wybiera efekt karty`);

        return this.game.sendGameDataToAll();
    }
}
