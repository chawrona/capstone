import Game from "../Game.js";

export default class Ludo extends Game {
    constructor(players, endGame) {
        super(players, endGame);
    }

    // na poczatku game data daje obiekt
    // przed nazwą funkcji _

    // dane ktore chcemy wyslac wszystkim to this.gameData

    initializeGameData() {
        this.gameData.gameMap = Array.from({ length: 40 }, () => 0);
        // [0,0,0,0,[pIdNiebieskiego,1],0,0,0]
        // this.gameData.currentPlayerIndex = this.currentPlayerIndex;
        // this.gameData.turn = playersQueue[0] //czy mogę tak
        // wziąść players queueue z klasy game? mam nadzieje ze tak
        this.gameData.currentAction = "Rzut kością";
        this.gameData.startingPositionArea = this._setPawns("start");
        this.gameData.finishPositions = this._setPawns("finish");
        this.gameData.timesThrown = 0;
        this.gameData.diceThrowResult = 0;
        this.gameData.playersStartingPoints = this._setPlayersStartingPoints();
        //     gameDataRequest(data) {  ------- gameDataRequest odsyla this.data (to jest
        //     nasze gameData). To oznacza, ze my po aktualizacji naszej daty w Ludo.js odrazu
        //     mamy gotową datę którą wyśle gameDataRequest na prośbę klienta albo wyślemy to
        //     manualnie w metodach

        //          return [this.dataWithPlayerTarget(data.publicId)];
        //     }
    }

    _setPlayersStartingPoints() {
        const playersStartingPoints = [];
        const mapStartPoint = 0;
        for (const pId of this.playersQueue) {
            //ustawiamy punkt startowy na który trafiają pionki gracza,
            // gracz pierwszy w kolejce ma indeks tablicy 0 tak więc
            // startuje na polu 0, drugi ma indeks 1 więc 10 itd.
            if (pId === this.currentPlayer.publicId) {
                mapStartPoint = this.playersQueue.indexOf(pId) * 10;
                playersStartingPoints.push([pId, mapStartPoint]);
            }
            return playersStartingPoints;
        }
    }

    gameDataRequest(data) {
        // bierze wszystkie dane dot. gry i odsyla
        return [
            this.dataWithPlayerTarget(data.publicId),
            {
                target: data.publicId,
                eventName: "players",
                data: this.getPlayersData(),
            },
        ];
    }

    getPlayersData() {
        // wyciaga instancje klasy player
        const players = [];
        for (const [, player] of this.players) {
            players.push(player.getPlayerData());
        }
        return players;
    }

    _setPawns(startOrFinish) {
        const pawns = [];
        if (startOrFinish === "start") {
            for (const [, player] of this.players) {
                let index = 0;
                while (index != 4) {
                    index++;
                    pawns.push([player.publicId, index]); // [[niebieski,1],
                    // [niebieski,2],...,[czerwony,1],...,[zolty,4]] - zamysl
                    // wyglada następująco. Na froncie pobierzesz sobie kolory
                    // tych pionków, zdefiniujesz sobie ze kolor niebieski to
                    // kolor miejsca startowego niebieskich, gdzies go ustawisz
                    // na mapie tam gdzie ci bedzie pasowac i te pionki rozmiescisz
                    // wedlug ich numerkow
                }
            }
            return pawns;
        } else {
            const tempPawns = [];
            const index = 4;
            for (const [player] of this.players) {
                tempPawns.push([player.publicId, 0]); // [[niebieski,0],
                // [czerwony,0],[zielony,0],[zolty,0]]
            }
            for (let i = 0; i < index; i++) {
                pawns.push([]);
                for (let j = 0; j < index; j++) {
                    pawns[i].push(tempPawns[0]);
                }
                // [
                // [[niebieski,0],[niebieski,0],[niebieski,0], [niebieski, 0]],
                // [[czerwony,0],[czerwony,0],[czerwony,0], [czerwony, 0]],
                // [[zielony,0],[zielony,0],[zielony,0], [zielony, 0]],
                // [[zolty,0],[zolty,0],[zolty,0], [zolty, 0]]
                // ]
                tempPawns.shift();
            }
            return pawns;
        }
    }

    _dataWithPlayersTarget() {
        const targets = [];
        // const possiblePawnMoves = _possibleMoves(this.playersQueue[this.currentPlayerIndex])
        for (const player of this.players) {
            targets.push({
                target: player.publicId,
                eventName: "gameData",
                data: {
                    ...this.gameData,
                    yourTurn:
                        player.publicId ===
                        this.playersQueue[this.currentPlayerIndex],
                    currentPlayerIndex: this.currentPlayerIndex
                    // possiblePawnMoves // pamiętać żeby zerować
                },
            });
        }
        return targets;
    }

    _currentPlayer() {
        return this.players.get(this.playersQueue[this.currentPlayerIndex]);
    }

    // osobna funkcja dająca info o tym które pionki są dostępne do ruchu

    throwTheDice(data) {
        //zastanowic sie nad sprawdzaniem czy to tura gracza żeby zablokować;
        // rozbić to na ruch gracza; jezeli ktos wybierze nielegalna akcje
        // to error a nie na sztywno ustawianie co moze co nie moze
        if (data.publicId != this.playersQueue[currentPlayerIndex]) {
            throw new Error("Poczekaj na swoją turę.");
        }
        if (this.gameData.currentAction != "Rzut kością") {
            throw new Error("Nieprawidłowa akcja.");
        }
        this.gameData.timesThrown += 1;
        //bardzo wishfull myślenie, bo wiem ze to co robi wysyla w data
        // a nie gameData, ale zakladam, ze gdy uzytkownik kliknie pionka
        // wysle sie nam gameData.currentAction === "Ruch pionka", jezeli nie to do poprawki
        if (this.gameData.timesThrown < 4) {
            // Sprawdzamy ile razy jeden gracz rzucil koscia zeby mogl
            // rzucic maksymalnie 3 razy (na start gry, czy jest start gry sprawdzamy w kodzie)
            const currentPlayer = this._currentPlayer();

            this.gameData.diceThrowResult = Math.floor(Math.random() * 6) + 1;
            const possibleMoves = _possibleMoves(currentPlayer);

            if (
                this.gameData.diceThrowResult === 6 ||
                this.gameData.diceThrowResult === 1
            ) {
                this.gameData.timesThrown = 0; // reset ile razy wyrzucono kosci
                if (possibleMoves === false) {
                    // jezeli possibleMoves wynosi false to oznacza, ze gracz nie
                    // moze sie ruszyc zadnym pionkiem, nawet tymi na starcie,
                    // przez co traci ture, nie ma kolejnego rzutu bo to nie jest tura startowa
                    this.gameData.currentAction = "Rzut kością";
                    this.nextTurn();
                    return _dataWithPlayersTarget();
                } else {
                    this.gameData.currentAction = "Ruch pionka";
                    return _dataWithPlayersTarget();
                }
            } else {
                // rzut od 2 do 5
                if(possibleMoves[0].length > 1 || possibleMoves[2].length > 1){ // w tych tabelach długość ponad 1 oznacza, że są możliwe ruchy do wykonania
                    this.gameData.currentAction = "Ruch pionka";
                    this.gameData.timesThrown = 0;
                    return _dataWithPlayersTarget();    
                }
                const pawnsInStartingArea = 0;
                for (const pawn of this.startingPositionArea) {
                    if (pawn[0] === currentPlayer.publicId){
                        pawnsInStartingArea += 1
                    }
                }
                if(pawnsInStartingArea === 4){
                    this.gameData.currentAction = "Rzut kością";
                    return _dataWithPlayersTarget();
                }
                if(possibleMoves === false){
                    this.gameData.timesThrown = 0;
                    this.gameData.currentAction = "Rzut kością";
                    this.nextTurn();
                    return _dataWithPlayersTarget();
                }
            }                
        } else {
            // jeżeli użytkownik próbuje rzucić kością 4 raz to tura przechodzi do innego gracza
            this.gameData.timesThrown = 0;
            this.gameData.currentAction = "Rzut kością";
            this.nextTurn();
            return _dataWithPlayersTarget();
        }
    }

    _possibleMoves(currentPlayer) {
        const possibleMoves = [
            [], // "PionkiNaPlanszy"
            [], // "PionkiNaStarcie"
            [], // "PionkiNaFinishu"
        ]; // wygodniej byłoby na obiektach ale nie chcemy ich
        // przekazywać chyba, że będziemy je rozpakowywać?? Do ustalenia
        const anyPossibleMoves = false;
        const currentPlayerMapStartPoint = 0;
        for (const startingPoint of this.gameData.playersStartingPoints) {
            //znajdujemy punkt startowy obecnego gracza
            if (startingPoint[0] === currentPlayer.publicId) {
                currentPlayerMapStartPoint = startingPoint[1];
            }
        }
        if (
            this.gameData.diceThrowResult === 6 ||
            this.gameData.diceThrowResult === 1
        ) {
            if (this.gameData.diceThrowResult === 1) {
                _possibleMovesFinish(possibleMoves);
                anyPossibleMoves = true;
            }

            _possibleMovesMap(
                currentPlayer,
                currentPlayerMapStartPoint,
                possibleMoves,
            );

            for (const pawn of this.startingPositionArea) {
                //jeżeli pionek jest na starcie to dodajemy go do możliwych ruchów
                if (pawn[0] === currentPlayer.publicId)
                    possibleMoves[1].push([pawn]);
                anyPossibleMoves = true;
            }
        } else {
            if (this.gameData.diceThrowResult <= 3) {
                _possibleMovesFinish(possibleMoves);
                anyPossibleMoves = true;
            }

            _possibleMovesMap(
                currentPlayer,
                currentPlayerMapStartPoint,
                possibleMoves,
            );
            anyPossibleMoves = true;
        }
        if (anyPossibleMoves === true) {
            return possibleMoves;
        } else {
            return false;
        }
    }

    _possibleMovesFinish(possibleMoves){
        const index = 0;
        for(const pawns of this.finishPositions[this.currentPlayerIndex]){
            if(index + this.gameData.diceThrowResult <= (this.finishPositions[this.currentPlayerIndex].length - 1)){
                if(pawns[index][1] != 0 && pawns[index + this.gameData.diceThrowResult][1] === 0){
                    possibleMoves[0].push(pawns[index]);    
                }
            }
            index += 1;
        }
    }

    _possibleMovesMap(
        currentPlayer,
        currentPlayerMapStartPoint,
        possibleMoves,
    ) {
        for (const element of this.gameMap) {
            //sprawdzamy czy jest jakiś pionek na mapie za pomocą
            // porównania pierwszego indeksu tablicy pionka (pId) z publicznym Id gracza
            if (!element.isInteger()) {
                if (element[0] === currentPlayer.publicId) {
                    //jeżeli pionek jest na planszy to dodajemy go do możliwych ruchów.
                    if (
                        indexOf(element) + this.gameData.diceThrowResult >
                        currentPlayerMapStartPoint - 1
                    ) {
                        // sprawdzic czy moze wejsc na finisz
                        const result =
                            indexOf(element) + this.gameData.diceThrowResult;
                        if(currentPlayerMapStartPoint != 0){
                            result = result - currentPlayerMapStartPoint;  
                        }else{
                            result = result - 40;
                        }
                        // nie odejmujemy już 1 ponieważ tablica
                        // pionków na finiszu rozpoczyna się od 0, tak więc
                        // jeżeli tutaj result wyjdzie równy
                        // 0 to będzie to odpowiadać pierwszemu miejscu na tablicy finiszy
                        if(this.finishPositions[this.currentPlayerIndex][result][1] === 0){
                            possibleMoves[0].push([element]);
                        }
                    } else if (
                        this.gameMap[
                            indexOf(element) + this.gameData.diceThrowResult
                        ] != 0 // sprawdzamy czy na tym polu stoi jakiś pionek
                    ) {
                        const spaceTaken =
                            this.gameMap[
                                indexOf(element) + this.gameData.diceThrowResult
                            ];
                        if (spaceTaken[0] != currentPlayer.publicId) {
                            //sprawdzamy czy publiczne id jest różne od pId obecnego gracza,
                            // gdyby bylo takie samo to ten gracz nie moze wejsc na pole
                            // okupowane przez swoj wlasny pionek
                            possibleMoves[0].push([element]);
                            //Tutaj następuje zbijanie pionka
                        }
                    } else {
                        possibleMoves[0].push([element]);
                    }
                }
            }
        }
    }

    // 1. Znalezc pionek na podstawie publicId i pawnId.
    // 2. Znalezc pozycje na ktora ten pionek ma isc.
    // 3. Przeniesc dane pionka z jednej pozycji na druga.
    // 4. Co zrobic jezeli na drugiej pozycji cos juz jest.
    // 5. Refaktoryzacja (np. rozbic pawnMovement na mniejsze funkcje)
    // 6. Sprawdzic czy gra dziala dla x osob (np. miejsca startowe)
    // 7. Zakonczenie gry (obiekt z informacja kto wygral, kto ma drugie miejsce itd)
    // 8. Dodac config
    
    pawnMovement(data) {
        if (data.publicId != this.playersQueue[currentPlayerIndex]) {
            throw new Error("Poczekaj na swoją turę.");
        }
        if (this.gameData.currentAction != "Rzut kością") {
            throw new Error("Nieprawidłowa akcja.");
        }
        const currentPlayer = this.currentPlayer();
        const possiblePawnMoves = _possibleMoves(currentPlayer.publicId);
        const currentPawn = []
        const pawnGroupIndex = 0; // 0 - plansza, 1 - start, 2 - finish
        for(const pawnGroup of possiblePawnMoves){
            for(const pawn of pawnGroup){
                if(pawn[0] === data.publicId && data.pawnId){
                    currentPawn.push(pawn, pawnGroupIndex); // [[publicId, pawnId], pawnGroupId]
                }
            }
            pawnGroupIndex += 1;
        }
        // //wychodzimy pionkiem na mape, usuwamy go z pozycji startowej
    }
}
