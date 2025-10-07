import getRandomNumber from "../../utils/getRandomNumber.js";
import Game from "../Game.js";

export default class Chinczyk extends Game {
    constructor(players, endGame) {
        super(players, endGame);

        this.fieldCount = 40;
    }

    setPlayerData(player) {
        player.setData("pawns", () => ({
            1: "base",
            2: "base",
            3: "base",
            4: "base",
        }));

        player.setData("firstField", () => (player.getData("order") - 1) * 10);
    }

    throwDice() {
        const dice = getRandomNumber(1, 6);
        if (dice === 1 || dice === 6) {
            console.log(dice);
        } else {
            console.log(dice);
        }
    }
}

/*
Gracz rzuca kością
Losujemy rzut kością. 
Zmieniamy aktualnie wyrzuconą wartość kości i przesyłamy do wszystkich w lobby.
Sprawdzamy jaką ilością pionków może się ruszyć gracz.
1. Zero - następna tura
2. Jeden - automatyczny ruch
3. Więcej - Wysyłamy event z możliwością wyboru, którym pionkiem może się ruszyć. Gracz wybiera pionek i on wykonuje ruch.
Sprawdzamy czy pionek ruszył się na pole, na którym ktoś już był i nie był to pionek własny.
1. Jeżeli tak to sprawdzamy czy był na swoim bezpiecznym polu.
1a. Jeżeli był na bezpiecznym polu - tura następnego gracza
1b. Jeżeli nie był na bezpiecznym polu - pionek innego gracza zostaje zwrócony do bazy
2. Jeżeli nie to tura następnego gracza



1. Animacja rzucania kością
2. Zanim wykona się animacja chodzenia pionków czekamy na koniec animacji ruchu
3. Zanim nastąpi następna tura to czekamy, aż wykona się animacja chodzenia pionków


Jak przechowujemy informację o pionkach graczy?

[
gracz1: {
    zielony
    [baza, baza, 13, 36]
}


]


}


MAPA - 72 POLA
gracz ma info gdzie jego pionek jest
dla każdego gracza będą tablice na jaki numer ma wyjść pionek z bazy i po jakim polu ma wejść do domu, a nie lecieć dalej
ale ogólnie po ostatnim polu robimy loopa

*/
