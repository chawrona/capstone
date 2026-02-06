import getRandomNumber from "../../../utils/getRandomNumber.js";
import Game from "../../Game.js";
import cards from "./cards.js";

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

    // @event
    selectCardsToPass() {
        // id1, id2, będą w data.data
        // zabierz graczowi 2 karty które wybrał
        // wrzuć je do tablicy [karta, karta, indeksGracza]
        // dodaj tablicę do danych
        // jak był to ostatni gracz to uruchom funkcję
        this.passCards();
    }

    passCards() {
        // Weź dane z passedCardsData i przekaż je graczom
        // zmień fazę wybierania na następną lub na granie
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
        return {
            // Karty gracza po lewej
            cards: this.getPlayer(publicId).getData("cards"),

            // Śluby na dole po lewej
            marriages: this.gameData.marriages.map((object) => object.color),

            // Kościół na dole po prawej
            church: this.generateChurchData(),

            // Gracze po prawej u góry
            players: this.generatePlayerData(),

            // Wikingowie u góry po lewej
            currentVikings: this.gameData.currentVikings,
        };
    }

    gameDataRequest(data) {
        return [
            {
                target: data.publicId,
                eventName: "gameData",
                data: this.generateGameData(data.publicId),
            },
        ];
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
