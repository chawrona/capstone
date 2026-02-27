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

        this.gameData.message = "Odrzucanie kart";
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

    passCards() {
        for (const cardsToPass of this.passedCardsData) {
            const [publicId, ...cards] = cardsToPass;
            const playerIndex = this.game.playersQueue.indexOf(publicId);
            const nextPlayerIndex =
                (playerIndex + 1) % this.game.playersQueue.length;

            const nextPlayer = this.game.getPlayer(
                this.game.playersQueue[nextPlayerIndex],
            );

            nextPlayer.setData("cards", (oldCards) => [...oldCards, ...cards]);
        }

        this.passedCardsPlayerCount = 0;

        const passPhase = (this.passingPhase.current += 1);

        if (passPhase > this.passingPhase.total) {
            // Tutaj będziemy udawać, że cała faza gry przeszła i tylko resetować na ponowne wybieranie kart.

            this.players
                .values()
                .forEach((player) => player.setStatus("Gramy!"));

            this.passedCardsData = [];
            this.game.gameData.phases.current = "playing";

            // TESTUJEMY - remis w kościele, jedna osoba wygrywa małżeństwo
            let i = 0;
            for (const player of this.players.values()) {
                if (i === 0) player.setData("church", () => 10);
                else if (i === 1) player.setData("church", () => 8);
                else if (i === 2) player.setData("church", () => 3);
                console.log(
                    `${player.username} vikings: ${player.getData("vikings")}`,
                );
                i++;
            }

            // return this.game.marriages.marriagesPhaseEnd();
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
}
