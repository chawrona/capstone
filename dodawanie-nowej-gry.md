# Jak dodać nową grę

Załóżmy, że nowa gra nazywa się **catan**

## 1. Dodaj grę w `server/config/games.json`

```json
{
  "title": "catan",
  "polishTitle": "Catan",
  "maxPlayers": 4,
  "minPlayers": 3,
  "description": "Krótki opis gry po polsku.",
  "time": "45-60 min.",
  "difficulty": "Średni",
  "colors": [ // Kolory, które mogą gracze wybrać dla siebie w danej grze
    { "name": "red", "hex": "#ef4444" },
    { "name": "blue", "hex": "#2563eb" }
  ]
}
```

`title` musi być bez spacji, po angielsku, bo z niego zbudują się ścieżki, nazwy plików i folderów. 
Jeśli gra nie przypisuje kolorów graczom, `colors` może być `null`.

## 2. Podgladowe grafiki gry
Stwórz dwie grafiki za pomocą https://ripolas.org/van-gogh-filter/ .
Jedną wrzuć do `client/public/assets/games/gamePreviews/catan_preview.png`, 
a drugą do `client/public/assets/games/selectedGames/catan.png`.
Nazwy grafik są ważne, w jednym przypadku to nazwaGry.png, a w drugim nazwaGry_preview.png

## 3. Silnik gry

Stwórz folder dla gry: `server/models/games/catan/`, a następnie plik **`Catan.js`**.
Jest to klasa dziedzicząca po `server/models/Game.js`. 
Tu będzie pisana cała logika gry. 

Tworzenie gry polega na zasadzie Akcja -> Reakcja. Gracz wysyła akcję o nazwie X, wywołuje się funkcja o nazwie X, a następnie do wszystkich w pokoju lub tylko do tego jednego gracza odsyłany jest aktualny stan gry.

Przykładowa akcja. Klient wysyła akcję "Zbuduj drogę" wraz z informacją o ID pola, na którym droga ma zostać wybudowana.
```json
{
eventName: "buildRoad",
roadId: 1,
}
```
Następnie GameEvents dodaje do tego obiektu pole `publicId` i przekazuje go do klasy `Catan` do funkcji `processGameData` dziedziczoną z klasy `Game`.
Funkcja ta bierze pole `eventName` i wywołuje funkcję w danej klasie o tej samej nazwie przekazując do niej dane.

Tak więc obiekt z `eventName` `buildRoad` wywoła funkcję w klasie `Catan` o nazwie `buildRoad`, a przekazanym parametem będzie obiekt złożony z pola `publicId`, aby gra wiedziała który gracz wywołał akcję, oraz innymi danymi przekazanymi początkowo przez klienta.

Aby uprościć przechowywanie danych dla konkretnego gracza można też stworzyć nową klasę dla graczy dla konkretnej gry, która dziedziczy po `server/models/Player.js`. 

## 4. Rejestracja gry w `server/models/Lobby.js`

Zaimportuj stworzoną przez siebie klasę gry oraz klasę gracza.

```js
import Catan from "./games/catan/Catan.js";
import CatanPlayer from "./games/catan/CatanPlayer.js";
```

Następnie na wzór innych gier dodaj pole w switchu z nową grą.
Nazwa przypadku w switchu musi odpowiadać nazwie gry z `server/config/games.json`.
```js
case "catan":
    this.game = new Catan(players, () => this.endGame(), this.id, CatanPlayer);
    break;
```

## 5. Routing na froncie

W `client/src/router/index.js` dodaj wpis analogiczny do reszty gier.
Ważne, aby komponent nazywał się `NazwaGryPage.vue`, a nazwa i ścieżka odpowiadały nazwie gry z `server/config/games.json`.
```js
{
    component: () => import("@/pages/games/CatanPage.vue"),
    name: "catan",
    path: "/:id/catan",
},
```
## 6. Strona gry i komponenty
Następnie w `client/src/pages/games utwórz `CatanPage.vue`. Jedynym zadaniem tego komponentu jest importować właściwy komponent gry.
W `client/src/games/` utwórz folder z nazwą gry taką jak w `server/config/games.json`, a w środku główny komponent z grą - `Catan.vue`.

## 7. Co powinien zawierać komponent z grą
Najlepiej spojrzeć na grę `BrianBoru.vue`, aby zobaczyć jak tego użyć.

W `<script>`:
- Ścieżkę do ścieżki dźwiękowej dla danej gry `const SOUNDTRACK_URL = "/sounds/catan/catan_soundtrack.opus"`;
- Użyty `usePageSounds` z przekazanymi plikami dźwiękowymi.
- Do informacji o rozmiarze gry `const { scale } = useGameResize();`
- Do obsługi stanu gry `const { gameData } = useGameData();`

W `template`:
- Ustawienia dźwięków i możliwość zakończenia gry `<GameSettings />`
- Kontener musi wyglądać w następujący sposób:
```html
<div class="background">
        <div
            v-if="gameData"
            class="game"
            :style="{ transform: `scale(${scale}) translate(-50%, -50%)` }"
        >
            <!-- Komponenty gry -->
        </div>
</div>
```

W `<style>`:
- Tego nie można tykać. Można dodatkowo zaimportować czcionki np. z Google Fonts oraz zmienić tło gry, ale nic poza tym.
```css
.background {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: rgb(0, 0, 0);
    overflow: hidden;
    background-image: url("/src/assets/games/gameAssets/brianboru/sea.webp");
}

.game {
    position: absolute;
    top: 50%;
    left: 50%;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 1920px;
    height: 950px;

    margin-block: auto;
    transform-origin: top left;
    font-family: "Open sans";
    overflow: hidden;

    * {
        user-select: none;
    }
}
```

## 9. Style CSS i ścieżki do assetów w grze.
Możesz stworzyć w `client/src/styles` plik nazwaGry.scss i go zaimportować.

Jeżeli chodzi o ścieżki w `<style>` używamy następujących ścieżek:
`/src/assets/games/gameAssets/catan/nazwaPliku.png`.
Pliki te znajdują się dokładnie w tej ścieżce.

W przypadku importu obrazków bezpośrednio do `<script>`, aby użyć ich potem w `<template>` korzystamy ze ścieżek:
`@/assets/games/gameAssets/catan/nazwaPliku.png`

## 10. Wysyłanie eventów na backend
Proponowanym rozwiązaniem jest wzór użyty w `client\src\games\craftsmen\composables_craftsmen\useGameActions.js`.
Tam również można zobaczyć przykład używania dźwięków.
Natomiast równie dobrze można używać store.emit w dowolnym miejscu