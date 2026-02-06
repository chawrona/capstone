import getRandomNumber from "../../../utils/getRandomNumber.js";
import Game from "../../Game.js";
import cards from "./config/cards.js";
import statuses from "./config/status.js";

export default class BrianBoru extends Game {
    constructor(players, endGame, lobbyId) {
        super(players, endGame, lobbyId);
        this.start();
    }

    initializeGameData() {
        this.gameData.vikings = [13, 11, 12, 13, 10, 9, 14, 13, 12];
        this.gameData.currentVikings = this.getCurrentVikings();

        this.gameData.cards = this.initalizeRandomCards();

        // Liczniki tur
        this.gameData.phases = {
            marriage: { current: 1, total: 4 },
            passing: { current: 1, total: 3 },
            playing: { current: 1, total: 4 },
        };

        // Przekazywanie kart
        this.gameData.passedCardsPlayerCount = 0;
        this.gameData.passedCardsData = [];

        // Status graczy - co robią

        // Śluby - pola od 1 do 9, bez zerowego
        // zapamiętać, ZAWSZE jak się ruszać to pytasz o dokupienie
        // potem nie ma możliwości, jak masz za mało to spadasz niżej
        // [PUBLICID, KOLOR]
        this.gameData.marriages = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    setPlayerData(player) {
        player.setData("church", () => 0);
        player.setData("points", () => 10);
        player.setData("vikings", () => 0);
        player.setData("suns", () => 1);
        player.setData("money", () => 5);
        player.setData("lockedCards", () => new Set());
        player.setData("cards", () => []);
        this.setPlayerStatus(player, statuses.REJECT_CARDS);
    }

    start() {
        this.giveCardsToPlayers();
    }

    getCurrentVikings() {
        const cardIndex = getRandomNumber(0, this.gameData.vikings);
        return this.gameData.vikings.splice(cardIndex, 1);
    }

    initalizeRandomCards() {
        return structuredClone(cards).sort(() => Math.random() - 0.5);
    }

    giveCardsToPlayers() {
        for (const player of this.players.values()) {
            player.setData("cards", () => {
                return this.gameData.cards.splice(0, 5);
            });
        }
    }

    resetCardDrawPhase() {
        for (const player of this.players.values()) {
            this.setPlayerStatus(player, statuses.REJECT_CARDS);
            player.setData("cards", () => []);
            player.setData("lockedCards", () => new Set());
        }

        this.initalizeRandomCards();
        this.giveCardsToPlayers();
        this.gameData.passedCardsPlayerCount = 0;
        this.gameData.passedCardsData = [];
        this.gameData.phases.passing.current += 1;
    }

    // @event
    selectCardsToPass(data) {
        const player = this.getPlayer(data.publicId);
        const cardsToPass = data.data;

        const lockedCards = player.getData("lockedCards");
        for (const card of cardsToPass) {
            if (lockedCards.includes(card)) {
                throw new Error(
                    `Nie możesz przekazać karty, którą dostałeś: ${card}`,
                );
            }
        }

        player.setData("cards", (oldCards) => {
            const newCards = oldCards.filter((card) => {
                for (const cardToPass of cardsToPass) {
                    if (cardToPass === card.id) return false;
                }
                return true;
            });

            return newCards;
        });

        this.gameData.passedCardsData.push = [data.publicId, ...cardsToPass];

        this.gameData.passedCardsPlayerCount++;
        if (this.gameData.passedCardsPlayerCount === this.players.size) {
            return this.passCards();
        } else {
            this.setPlayerStatus(player, statuses.REJECT_CARDS_WAITING);
            return this.generateGameData(data.publicId);
        }
    }

    passCards() {
        for (const cardsToPass of this.gameData.passedCardsData) {
            const [publicId, ...lockedCards] = cardsToPass;
            const playerIndex = this.playersQueue.indexOf(publicId);
            const nextPlayerIndex =
                (playerIndex + 1) % this.playersQueue.length;

            const nextPlayer = this.getPlayer(
                this.playersQueue[nextPlayerIndex],
            );

            nextPlayer.setData("lockedCard", (oldSet) => {
                lockedCards.forEach((card) => oldSet.add(card));
                return oldSet;
            });
        }

        this.gameData.passedCardsPlayerCount = 0;

        const passPhase = (this.gameData.phases.passing.current += 1);
        if (passPhase === this.gameData.phases.passing.total) {
            // Tutaj będziemy udawać, że cała faza gry przeszła i tylko resetować na ponowne wybieranie kart.

            return this.sendGameDataToAll();
        } else {
            for (const player of this.players.values()) {
                this.setPlayerStatus(player, statuses.REJECT_CARDS);
            }
            return this.sendGameDataToAll();
        }
    }

    // Odsyłanie danych

    generateChurchData() {
        const church = [];
        for (const player of this.players.values()) {
            for (let i = 0; i < player.getData("church"); i++) {
                church.push(player.color);
            }
        }
        return church;
    }

    generatePlayerData() {
        const data = [];

        for (const player of this.players.values()) {
            data.push({
                username: player.username,
                color: player.color,
                church: player.getData("church"),
                points: player.getData("points"),
                vikings: player.getData("vikings"),
                suns: player.getData("suns"),
                money: player.getData("money"),
            });
        }

        return data;
    }

    generateGameData(publicId) {
        return [
            {
                target: publicId,
                eventName: "gameData",
                data: {
                    // Karty gracza po lewej
                    cards: [
                        this.getPlayer(publicId).getData("cards"),
                        this.getPlayer(publicId).getData("lockedCards"),
                    ],

                    // Śluby na dole po lewej
                    marriages: this.gameData.marriages.map(
                        (object) => object.color,
                    ),

                    // Kościół na dole po prawej
                    church: this.generateChurchData(),

                    // Gracze po prawej u góry
                    players: this.generatePlayerData(),

                    // Wikingowie u góry po lewej
                    currentVikings: this.gameData.currentVikings,

                    status: this.getPlayerStatus(publicId),
                    phases: this.gameData.phases,
                },
            },
        ];
    }

    sendGameDataToAll() {
        const data = [];
        for (const publicId of this.players.keys()) {
            data.push(this.generateGameData(publicId)[0]);
        }
        return data;
    }

    gameDataRequest(data) {
        return this.generateGameData(data.publicId);
    }

    // Pomocnicze
    getPlayerStatus(publicId) {
        this.getPlayer(publicId).getData("status");
    }

    setPlayerStatus(player, status) {
        player.setData("status", () => status);
    }
}

// TO-DO:
/*
Pomijamy całkowicie fazę grania, chcemy zrobić gameplay loop i zakończenie bez używania kart
Po prostu zamiast tego odrzucimy wszystkim 4 losowe karty
Nie robimy mapy

Najpierw jednak jeszcze trzeba:
1. wpisać karty do jsona
2. Pomyśleć jak mają wyglądać interfejsy (wiadomości i dialogi) na etapie wybierania gry
3. Jak informować gracza o tym, że może coś teraz zrobić.

np. jeżeli faza wybieranie kart do odrzucenia to odsyłamy event z pokazaniem jaką kartę odrzuciłeś
Trzeba jakoś zaznaczyć których kart nie możesz odrzucić, bo już je odrzuciłeś.

*/

// DODATKOWY EVENT NA POINFORMOWANIE DIALOGIEM JAKIE KARTY OTRZYMAŁEŚ

// Animacja gdy wejdzie nowa faza wybierania kart, tak żeby ukryć że zmieniają się nagle bez dialogu
