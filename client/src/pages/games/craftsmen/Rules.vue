<script setup>
import { ref } from "vue";

import Rules from "@/assets/games/gameAssets/craftsmen/book.png";

import { soundBus } from "../../../audio/soundBus";

const dialogOpened = ref(false);

const toggleDialog = () => {
    if (!dialogOpened.value) soundBus.playEffect("openBook");
    dialogOpened.value = !dialogOpened.value;
};
</script>

<template>
    <div v-if="dialogOpened" class="dialog">
        <h1>Rzemieślnicy - Instrukcja</h1>

        <h2>1. Cel gry</h2>
        <p>
            Celem gry jest wykonanie 10 kontraktów (reprezentowanych przez karty
            kontraktów) oraz wypełnienie ukrytego celu. Kontrakty wykonuje się,
            oddając wymaganą liczbę surowców. Ukryte zadanie jest losowane na
            początku gry osobno dla każdego gracza i pozostaje tajemnicą dla
            pozostałych. Podgląd postępu ukrytego zadania możesz w każdej chwili
            sprawdzić, klikając na panel z jego nazwą.
        </p>

        <p>Gracz wygrywa w jednym z dwóch przypadków:</p>
        <ul>
            <li>
                W momencie wykonania ostatniego, dziesiątego kontraktu spełnia
                również warunki ukrytego celu.
            </li>
            <li>
                Wykonał już 10 kontraktów, a następnie w jednej z kolejnych tur
                spełni warunki ukrytego celu i zakończy turę.
            </li>
        </ul>

        <h2>2. Kategorie zasobów</h2>
        <p>W grze występują trzy kategorie zasobów.</p>

        <h3>Surowce zwykłe</h3>
        <ul>
            <li>Drewno</li>
            <li>Kamień</li>
            <li>Żelazo</li>
            <li>Cegły</li>
            <li>Zboże</li>
        </ul>

        <h3>Surowce luksusowe</h3>
        <p>
            Surowców luksusowych nie można kupić. Zapewniają one większy zysk
            przy sprzedaży u handlarza:
        </p>
        <ul>
            <li>Jedwab</li>
            <li>Bursztyn – zastępuje dowolny inny surowiec.</li>
            <li>Szkło – daje dodatkową monetę przy sprzedaży.</li>
        </ul>

        <h3>Środek płatniczy</h3>
        <ul>
            <li>Monety</li>
        </ul>

        <h2>3. Plansza</h2>
        <p>Plansza składa się z 4 pierścieni (licząc od środka):</p>
        <ul>
            <li>Pierścień wewnętrznej ścieżki (2, 2, 1) – 3 pola</li>
            <li>
                Pierścień wewnętrznych dzielnic (Kolory złoty, fioletowy,
                niebieski) – 3 dzielnice
            </li>
            <li>
                Pierścień zewnętrznej ścieżki (2, 1, 2, 2, 1, 1, 2, 1) – 8 pól
            </li>
            <li>Pierścień zewnętrznych dzielnic (Dużo kolorów) – 8 dzielnic</li>
        </ul>

        <h2>4. Poruszanie się i zbiory</h2>
        <ul>
            <li>
                <strong>Ścieżki:</strong> Pola, po których poruszają się pionki.
                Ilość pól na ścieżce odpowiada ilości pól dzielnic w przyległym
                pierścieniu.
            </li>
            <li>
                <strong>Dzielnice:</strong> Określają, jaki surowiec można
                otrzymać, wchodząc na przyległe pole. Na zewnętrznej ścieżce
                otrzymuje się surowce z zewnętrznych dzielnic, a na wewnętrznej
                z wewnętrznych.
            </li>
            <li>
                <strong>Zbiory:</strong> Numer pola na ścieżce informuje, ile
                danego surowca otrzymasz.
            </li>
            <li>
                <strong>Dzielnice mieszane („surowiec-zboże”):</strong> Na polu
                nr 1 gracz otrzymuje 1 surowiec. Na polu nr 2 otrzymuje 1
                surowiec i 1 pszenicę.
            </li>
        </ul>

        <h2>5. Zasady ruchu</h2>
        <ul>
            <li>Zakres ruchu to jedno pole w dowolnym kierunku.</li>
            <li>
                Gracz może przechodzić między wewnętrzną i zewnętrzną ścieżką.
            </li>
            <li>
                Z zewnętrznej ścieżki można wejść tylko na sąsiadujące pole
                wewnętrznej ścieżki (i vice versa). Na podglądzie pola ścieżek
                zewnętrznych i wewnętrznych są zaznaczone podobnym odcieniem
                szarości, żeby wiadomo było z którego pola można zmienić ścieżkę
                na które pole.
            </li>
            <li>
                <strong>Koszt wejścia:</strong> Każdy ruch, który stawia
                rzemieślnika na polu wewnętrznej ścieżki (w tym ruch
                wewnątrz-wewnątrz), kosztuje 2 pszenicy.
            </li>
        </ul>

        <h2>6. Obrót planszy</h2>
        <p>
            Po wykonaniu ruchu przez wszystkich graczy, plansza zmienia swoje
            położenie:
        </p>
        <ul>
            <li>
                <strong>Zewnętrzne dzielnice:</strong> przesuwają się o 1 pole
                zgodnie z ruchem wskazówek zegara.
            </li>
            <li>
                <strong>Wewnętrzne dzielnice:</strong> przesuwają się o 1 pole w
                przeciwnym kierunku.
            </li>
        </ul>
        <p>
            <strong>Ręczny obrót:</strong> W swojej turze gracz może wydać 1
            żelazo, aby manualnie obrócić planszę według powyższego schematu.
            Można to robić dowolną ilość razy.
        </p>
        <p>
            Istnieje 10% szansy na to, że po ręcznym obrocie plansza obróci się
            w sposób losowy. Osoba z ukrytym zadaniem "Bóg RNG" posiada 20%
            szans na to.
        </p>
        <p>
            <em
                >Dla podglądu oznaczyłem dzielnice dodatkowo literkami.
                Zauważcie, że ścieżki i liczby się nie zmieniają, tylko
                dzielnice.</em
            >
        </p>

        <h2>7. Pobór zboża</h2>
        <p>
            Co 6 tur gra pobiera od gracza zboże w ilości odpowiadającej liczbie
            jego pionków (Rzemieślników i handlarzy) na mapie.
        </p>
        <ul>
            <li>Licznik tur do poboru widnieje w prawym górnym rogu ekranu.</li>
            <li>
                Liczba wymaganego zboża znajduje się w ekwipunku obok ilości
                monet.
            </li>
        </ul>
        <p>
            <strong>Brak zboża:</strong> Jeżeli gracz nie ma wystarczających
            zapasów, jego pionki są usuwane z planszy (zaczynając od handlarza,
            aż do wyrównania braków). Gracz nigdy nie traci swojego pierwszego,
            pierwotnego Rzemieślnika.
        </p>

        <h2>8. Inwentarz</h2>
        <p>
            Miejsce w ekwipunku jest limitowane. Surowce przekraczające limit
            przepadają.
        </p>

        <table border="1">
            <thead>
                <tr>
                    <th>Cecha</th>
                    <th>Wartość</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Limit startowy</td>
                    <td>6 miejsc</td>
                </tr>
                <tr>
                    <td>Maksymalny limit</td>
                    <td>18 miejsc</td>
                </tr>
                <tr>
                    <td>Progresywny koszt powiększenia</td>
                    <td>
                        Miejsca 7-12: 1 Drewno = 1 miejsce<br />
                        Miejsca 13-18: 2 Drewno = 1 miejsce
                    </td>
                </tr>
                <tr>
                    <td>Szybka sprzedaż</td>
                    <td>
                        Dowolny surowiec można w każdej chwili sprzedać z
                        ekwipunku za 1 monetę.
                    </td>
                </tr>
            </tbody>
        </table>

        <h2>9. Rzemieślnicy</h2>
        <ul>
            <li>
                W trakcie gry można dokupować kolejnych rzemieślników. Koszt
                jest progresywny.
            </li>
            <li>
                Nowy rzemieślnik pojawia się na dowolnie wybranym miejscu w
                zewnętrznym pierścieniu.
            </li>
            <li>Każdy nowy rzemieślnik podnosi wymóg poboru zboża o 1.</li>
            <li>
                <strong>Zbieranie surowców:</strong> Rzemieślnicy muszą się
                ruszyć, aby zebrać surowce. Nie mogą zebrać surowców z pola, na
                którym stali w poprzedniej turze.
            </li>
        </ul>

        <h2>10. Karty kontraktów</h2>
        <p>
            Kontrakty dzielą się na 3 grupy (po 12 kart): Łatwe, Średnie i
            Trudne.
        </p>
        <p><strong>Pula i dobieranie:</strong></p>
        <ul>
            <li>
                <strong>Start:</strong> 3 losowe kontrakty z puli łatwej.
                Początkowa pula do dobierania to 12 łatwych kontraktów.
            </li>
            <li>
                Gdy gracz wykona łatwy kontrakt, do puli dobierania trafia 1
                kontrakt średni.
            </li>
            <li>
                Gdy skończą się kontrakty średnie, do puli zaczynają trafiać
                kontrakty trudne.
            </li>
            <li>
                <strong>Odświeżanie:</strong> Wykupiony kontrakt nie jest od
                razu zastępowany. Dopiero gdy wszystkie 3 widoczne kontrakty
                znikną, pojawiają się 3 nowe.
            </li>
            <li>
                <strong>Wymiana:</strong> Gracz może zapłacić 3 monety, aby
                wylosować inny kontrakt z dostępnej puli.
            </li>
        </ul>

        <h2>11. Opłaty (Zasada wchodzenia na pola)</h2>
        <p>
            Aby wejść rzemieślnikiem na pole zajęte przez obcego rzemieślnika,
            musisz zapłacić. Nie możesz wykonać ruchu, jeśli nie stać Cię na
            opłatę. Opłata dotyczy również stawiania rzemieślnika, na zajętym
            polu, na początku gry lub jak dokupujesz kolejnego.
        </p>
        <ul>
            <li>
                <strong>1 obcy rzemieślnik:</strong> płacisz 1 monetę jego
                właścicielowi.
            </li>
            <li>
                <strong>2 rzemieślników różnych graczy:</strong> płacisz po 1
                monecie każdemu z nich.
            </li>
            <li>
                <strong>2 rzemieślników tego samego gracza:</strong> płacisz 2
                monety temu graczowi.
            </li>
            <li>
                <strong>Twój rzemieślnik na polu:</strong> jeśli na polu stoi
                obcy rzemieślnik, ale również Twój, nie ponosisz żadnych opłat.
            </li>
        </ul>
        <p>Handlarze nie biorą udziału w opłatach i nie chronią przed nimi.</p>
        <p>
            Na wewnętrznej ścieżce nie ma żadnych opłat za stawanie na tym samym
            polu co inny gracz.
        </p>

        <h2>12. Gildie</h2>
        <ul>
            <li>
                Gildię można wybudować na dowolnej dzielnicy w zewnętrznym
                pierścieniu.
            </li>
            <li>Można wybudować jedną gildię na turę</li>
            <li>
                Gildia porusza się razem z dzielnicą (nie jest przypisana do
                konkretnego pola ścieżki).
            </li>
            <li>
                W kwestii opłat gildia jest traktowana jak rzemieślnik:
                <ul>
                    <li>Wchodząc na własną gildię, nie płacisz nic.</li>
                    <li>
                        Inni gracze muszą zapłacić Ci 1 monetę, stając na polu z
                        Twoją gildią.
                    </li>
                    <li>
                        Jeśli Twój rzemieślnik stoi na polu z cudzą gildią,
                        wejście tam drugim rzemieślnikiem jest darmowe.
                    </li>
                </ul>
            </li>
        </ul>

        <h3>Cennik budowy gildii</h3>
        <table border="1">
            <thead>
                <tr>
                    <th>Kolejna gildia gracza</th>
                    <th>Wymagany Kamień</th>
                    <th>Wymagane Cegły</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Pierwsza gildia</td>
                    <td>1</td>
                    <td>2</td>
                </tr>
                <tr>
                    <td>Druga gildia</td>
                    <td>3</td>
                    <td>3</td>
                </tr>
                <tr>
                    <td>Trzecia gildia</td>
                    <td>4</td>
                    <td>4</td>
                </tr>
            </tbody>
        </table>
        <p>Handlarze nie biorą udziału w opłatach i nie chronią przed nimi.</p>

        <h2>13. Handlarze</h2>
        <p>
            Handlarze to specjalny pionek odblokowywany za 3 jedwabiu. Do jego
            utrzymania wymagane jest 1 zboże podczas poboru.
        </p>
        <p><strong>Cechy Handlarza:</strong></p>
        <ul>
            <li>Pojawia się zawsze w dzielnicy handlowej.</li>
            <li>Jest całkowicie zwolniony z opłat za zajmowanie pól.</li>
            <li>Wchodzi na wewnętrzną ścieżkę bez płacenia zbożem.</li>
            <li>
                Może handlować surowcem przypisanym do dzielnicy przy jego
                aktualnym polu.
            </li>
            <li>
                Może kupić oraz sprzedać surowiec tyle razy, ile wynosi cyfra
                przypisana do tego pola. Przykładowo, na polu 2 może 2 razy
                sprzedać i 2 razy kupić. Limit sprzedaży i kupna jest osobny.
            </li>
            <li>
                Handel odbywa się dopiero PO ruchu. Obrót planszy odbiera mu
                możliwość handlu w danej turze jeżeli już się ruszył.
            </li>
            <li>
                Sprzedaż surowca podczas handlu z handlarzem odświeża dostępne
                ruchy.
            </li>
        </ul>

        <table border="1">
            <thead>
                <tr>
                    <th>Pierścień</th>
                    <th>Numer Pola</th>
                    <th>Koszt Kupna</th>
                    <th>Zysk ze Sprzedaży</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Zewnętrzny (Zwykłe)</td>
                    <td>1</td>
                    <td>3 monety</td>
                    <td>2 monety</td>
                </tr>
                <tr>
                    <td>Zewnętrzny (Zwykłe)</td>
                    <td>2</td>
                    <td>2 monety</td>
                    <td>2 monety</td>
                </tr>
                <tr>
                    <td>Wewnętrzny (Luksusowe)</td>
                    <td>1</td>
                    <td>Niedostępne</td>
                    <td>6 monet (Szkło: 7)</td>
                </tr>
                <tr>
                    <td>Wewnętrzny (Luksusowe)</td>
                    <td>2</td>
                    <td>Niedostępne</td>
                    <td>4 monety (Szkło: 5)</td>
                </tr>
            </tbody>
        </table>

        <p>
            <em
                >(Wzory matematyczne z oryginału dla dociekliwych: Kupno na
                zewnątrz to 4 minus numer pola, sprzedaż luksusowych wewnątrz to
                8 minus 2 razy numer pola + 1 jeżeli szkło)</em
            >
        </p>

        <h2>14. Ukryte zadania</h2>
        <p>
            Każdy gracz na początku gry losuje swój ukryty cel. Wymaga on
            spełnienia konkretnych założeń, aby zapewnić zwycięstwo. Ukryte cele
            mogą się powtarzać.
        </p>
        <ul>
            <li>
                <strong>Baron Logistyki:</strong> Zdobądź maksymalny poziom
                udźwigu.
            </li>
            <li>
                <strong>Szara Eminencja:</strong> Wybuduj 3 Gildie lub 8 gildii
                będzie na planszy.
            </li>
            <li>
                <strong>Kolekcjoner Luksusów:</strong> Wydaj 12 bursztynu w
                ramach innego surowca.
            </li>
            <li>
                <strong>Król Kupców:</strong> Wydaj na kupno surowców 40 monet.
            </li>
            <li><strong>Bóg RNG:</strong> Super-obróć planszę 4 razy.</li>
        </ul>
    </div>

    <img :src="Rules" alt="" class="rules" @click="toggleDialog" />
</template>

<style scoped>
.dialog {
    position: absolute;
    inset: 0;
    place-self: center;
    width: 45rem;
    height: 55rem;
    overflow-y: scroll;
    background-color: red;
    padding: 2rem 4rem;
    margin-right: 6rem;
    scrollbar-width: none;

    background-size: contain;
    background-position: center;
    z-index: 100;
    border-radius: 0.5rem;
    line-height: 1.4;
    color: white;
    background-image: url("/src/assets/games/gameAssets/craftsmen/black1.jpg");

    h1 {
        text-align: center;
    }

    h2 {
        margin-top: 1rem;
        margin-bottom: 0.25rem;
    }

    table {
        width: 100%;
        margin-block: 1rem;
    }

    ul {
        margin-block: 0.75rem;
    }

    p {
        margin-block: 0.3rem;
    }

    li {
        margin-left: 1.25rem;
    }
}

.rules {
    padding: 1rem;
    position: absolute;
    bottom: 11.5rem;
    cursor: pointer;
    left: 4.25rem;
    width: 18rem;
    z-index: 10;
    filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.534));

    &:hover {
        filter: brightness(1.1) drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.534));
    }
}
</style>
