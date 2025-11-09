import Game from "../Game.js";

export default class Ludo extends Game {
    constructor(players, endGame) {
        super(players, endGame);
    }

    // na poczatku game data daje obiekt
    // przed nazwą funkcji _

    // dane ktore chcemy wyslac wszystkim to this.gameData

    initializeGameData() {
        // SPRAWDZIC CZY POWINNISMY PISAC gameData
        // ODWOLUJAC SIE DO TYCH ZMIENNYCH!!!!!!!!!!!!!!!!!!!!!
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
        this.gameData.anyPossibleMoves = false;
        //     gameDataRequest(data) {  ------- gameDataRequest odsyla this.data (to jest
        //     nasze gameData). To oznacza, ze my po aktualizacji naszej daty w Ludo.js odrazu
        //     mamy gotową datę którą wyśle gameDataRequest na prośbę klienta albo wyślemy to
        //     manualnie w metodach

        //          return [this.dataWithPlayerTarget(data.publicId)];
        //     }
    }

    _setPlayersStartingPoints() {
        const playersStartingPoints = [];
        let mapStartPoint = 0;
        for (const pId of this.playersQueue) {
            //ustawiamy punkt startowy na który trafiają pionki gracza,
            // gracz pierwszy w kolejce ma indeks tablicy 0 tak więc
            // startuje na polu 0, drugi ma indeks 1 więc 10 itd.
            if (pId === this._currentPlayer().publicId) {
                if (this.playersQueue.length == 2) {
                    mapStartPoint = this.playersQueue.indexOf(pId) * 20;
                    playersStartingPoints.push([pId, mapStartPoint]);
                } else {
                    mapStartPoint = this.playersQueue.indexOf(pId) * 10;
                    playersStartingPoints.push([pId, mapStartPoint]);
                }
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
                data: {
                    players: this.getPlayersData(),
                    ...this.gameData,
                    currentPlayerIndex: this.currentPlayerIndex,
                },
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
        const possiblePawnMoves = this._possibleMoves(
            this.playersQueue[this.currentPlayerIndex],
        );
        for (const player of this.players) {
            targets.push({
                target: player.publicId,
                eventName: "gameData",
                data: {
                    ...this.gameData,
                    yourTurn:
                        player.publicId ===
                        this.playersQueue[this.currentPlayerIndex],
                    currentPlayerIndex: this.currentPlayerIndex,
                    possiblePawnMoves, // pamiętać żeby zerować
                },
            });
        }
        return targets;
    }

    _gameEndWithTarget() {
        const gameEndStats = [];
        for (const pawns of this.gameData.finishPositions) {
            let howManyFinished = 0;
            for (const pawn of pawns) {
                if (pawn[1] != 0) {
                    howManyFinished += 1;
                }
            }
            gameEndStats.push([pawns[0][0], howManyFinished]);
        }
        gameEndStats.sort((a, b) => b[1] - a[1]);
        const targets = [];
        for (const player of this.players) {
            targets.push({
                target: player.publicId,
                eventName: "gameEnd",
                data: {
                    ...gameEndStats,
                },
            });
        }
        return targets;
    }

    _currentPlayer() {
        return this.players.get(this.playersQueue[this.currentPlayerIndex]);
    }

    // osobna funkcja dająca info o tym które pionki są dostępne do ruchu

    rollDice(data) {
        //zastanowic sie nad sprawdzaniem czy to tura gracza żeby zablokować;
        // rozbić to na ruch gracza; jezeli ktos wybierze nielegalna akcje
        // to error a nie na sztywno ustawianie co moze co nie moze
        if (data.publicId != this.playersQueue[this.currentPlayerIndex]) {
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
            const possibleMoves = this._possibleMoves(currentPlayer);

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
                    return this._dataWithPlayersTarget();
                } else {
                    this.gameData.currentAction = "Ruch pionka";
                    return this._dataWithPlayersTarget();
                }
            } else {
                // rzut od 2 do 5
                if (
                    possibleMoves[0].length > 1 ||
                    possibleMoves[2].length > 1
                ) {
                    // w tych tabelach długość ponad 1 oznacza, że są możliwe ruchy do wykonania
                    this.gameData.currentAction = "Ruch pionka";
                    this.gameData.timesThrown = 0;
                    return this._dataWithPlayersTarget();
                }
                let pawnsInStartingArea = 0;
                for (const pawn of this.gameData.startingPositionArea) {
                    if (pawn[0] === currentPlayer.publicId) {
                        pawnsInStartingArea += 1;
                    }
                }
                if (pawnsInStartingArea === 4) {
                    this.gameData.currentAction = "Rzut kością";
                    return this._dataWithPlayersTarget();
                }
                if (possibleMoves === false) {
                    this.gameData.timesThrown = 0;
                    this.gameData.currentAction = "Rzut kością";
                    this.nextTurn();
                    return this._dataWithPlayersTarget();
                }
            }
        } else {
            // jeżeli użytkownik próbuje rzucić kością 4 raz to tura przechodzi do innego gracza
            this.gameData.timesThrown = 0;
            this.gameData.currentAction = "Rzut kością";
            this.nextTurn();
            return this._dataWithPlayersTarget();
        }
    }

    _possibleMoves(currentPlayer) {
        const possibleMoves = [
            [], // "PionkiNaPlanszy"
            [], // "PionkiNaStarcie"
            [], // "PionkiNaFinishu"
        ]; // wygodniej byłoby na obiektach ale nie chcemy ich
        // przekazywać chyba, że będziemy je rozpakowywać?? Do ustalenia
        // let anyPossibleMoves = false;
        let currentPlayerMapStartPoint = 0;
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
                this._possibleMovesFinish(possibleMoves);
                // anyPossibleMoves = true;
            }

            this._possibleMovesMap(
                currentPlayer,
                currentPlayerMapStartPoint,
                possibleMoves,
            );

            for (const pawn of this.gameData.startingPositionArea) {
                //jeżeli pionek jest na starcie to dodajemy go do możliwych ruchów
                if (pawn[0] === currentPlayer.publicId) {
                    if (
                        this.gameData.gameMap[currentPlayerMapStartPoint] === 0
                    ) {
                        //sprawdzamy czy pole jest puste
                        possibleMoves[1].push([pawn]);
                        this.gameData.anyPossibleMoves = true;
                    } else if (
                        this.gameData.gameMap[currentPlayerMapStartPoint][0] !=
                        this._currentPlayer().publicId
                    ) {
                        //sprawdzamy czy tam jest pionek inny niż pionek obecnego gracza,
                        // ponieważ tylko na taki może tam wejść
                        possibleMoves[1].push([pawn]);
                        this.gameData.anyPossibleMoves = true;
                    }
                }
            }
        } else {
            if (this.gameData.diceThrowResult <= 3) {
                this._possibleMovesFinish(possibleMoves);
                // anyPossibleMoves = true;
            }

            this._possibleMovesMap(
                currentPlayer,
                currentPlayerMapStartPoint,
                possibleMoves,
            );
            // anyPossibleMoves = true;
        }
        if (this.gameData.anyPossibleMoves === true) {
            return possibleMoves;
        } else {
            return false;
        }
    }

    _possibleMovesFinish(possibleMoves) {
        let index = 0;
        for (const pawns of this.gameData.finishPositions[
            this.currentPlayerIndex
        ]) {
            if (
                index + this.gameData.diceThrowResult <=
                this.gameData.finishPositions[this.currentPlayerIndex].length -
                    1
            ) {
                if (
                    pawns[index][1] != 0 &&
                    pawns[index + this.gameData.diceThrowResult][1] === 0
                ) {
                    possibleMoves[0].push(pawns[index]);
                    this.gameData.anyPossibleMoves = true;
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
        for (const element of this.gameData.gameMap) {
            //sprawdzamy czy jest jakiś pionek na mapie za pomocą
            // porównania pierwszego indeksu tablicy pionka (pId) z publicznym Id gracza
            if (!Number.isInteger(element)) {
                if (element[0] === currentPlayer.publicId) {
                    //jeżeli pionek jest na planszy to dodajemy go do możliwych ruchów.
                    if (
                        this.gameData.gameMap.indexof(element) +
                            this.gameData.diceThrowResult >
                        currentPlayerMapStartPoint - 1
                    ) {
                        // sprawdzic czy moze wejsc na finisz
                        let result =
                            this.gameData.gameMap.indexof(element) +
                            this.gameData.diceThrowResult;
                        if (currentPlayerMapStartPoint != 0) {
                            result = result - currentPlayerMapStartPoint;
                        } else {
                            result = result - 40;
                        }
                        // nie odejmujemy już 1 ponieważ tablica
                        // pionków na finiszu rozpoczyna się od 0, tak więc
                        // jeżeli tutaj result wyjdzie równy
                        // 0 to będzie to odpowiadać pierwszemu miejscu na tablicy finiszy
                        if (
                            this.gameData.finishPositions[
                                this.currentPlayerIndex
                            ][result][1] === 0
                        ) {
                            possibleMoves[0].push([element]);
                            this.gameData.anyPossibleMoves = true;
                        }
                    } else if (
                        this.gameData.gameMap[
                            this.gameData.gameMap.indexof(element) +
                                this.gameData.diceThrowResult
                        ] != 0 // sprawdzamy czy na tym polu stoi jakiś pionek
                    ) {
                        const spaceTaken =
                            this.gameData.gameMap[
                                this.gameData.gameMap.indexof(element) +
                                    this.gameData.diceThrowResult
                            ];
                        if (spaceTaken[0] != currentPlayer.publicId) {
                            //sprawdzamy czy publiczne id jest różne od pId obecnego gracza,
                            // gdyby bylo takie samo to ten gracz nie moze wejsc na pole
                            // okupowane przez swoj wlasny pionek
                            possibleMoves[0].push([element]);
                            this.gameData.anyPossibleMoves = true;
                            //Tutaj następuje zbijanie pionka
                        }
                    } else {
                        possibleMoves[0].push([element]);
                        this.gameData.anyPossibleMoves = true;
                    }
                }
            }
        }
    }

    // 1. Znalezc pionek na podstawie publicId i pawnId. JEST
    // 2. Znalezc pozycje na ktora ten pionek ma isc. JEST
    // 3. Przeniesc dane pionka z jednej pozycji na druga. JEST
    // 4. Co zrobic jezeli na drugiej pozycji cos juz jest. JEST
    // 5. Refaktoryzacja (np. rozbic pawnMovement na mniejsze funkcje) NIE
    // 6. Sprawdzic czy gra dziala dla x osob (np. miejsca startowe) NIE
    // 7. Zakonczenie gry (obiekt z informacja kto wygral,
    // kto ma drugie miejsce itd) TAK
    // 8. Sprawdzic czy mamy zaimplementowane kilka rzutow koscia,
    // gdy uzytkownik wyrzuca ciagle 6. TAK
    // 9. UWAGA: przy wychodzeniu pionkiem ze startu,
    // pionek laduje na swoim polu startowym, w momencie gdy uzytkownik
    // drugi raz wylosuje 6 lub 1, musimy sprawdzic czy na polu startowym
    // nie znajduje sie juz jego pionek, jezeli tak to zablokowac
    // mu wyjscie pionkiem na plansze i zmusic do ruchu pionkiem na plansze. TAK
    // 10. Dodac config

    pawnMovement(data) {
        if (data.publicId != this.playersQueue[this.currentPlayerIndex]) {
            throw new Error("Poczekaj na swoją turę.");
        }
        if (this.gameData.currentAction != "Rzut kością") {
            throw new Error("Nieprawidłowa akcja.");
        }
        const currentPlayer = this._currentPlayer();
        const possiblePawnMoves = this._possibleMoves(currentPlayer.publicId);
        const currentPawn = [];
        let pawnGroupIndex = 0; // 0 - plansza, 1 - start, 2 - finish
        let currentPlayerMapStartPoint = 0;
        for (const startingPoint of this.gameData.playersStartingPoints) {
            //znajdujemy punkt startowy obecnego gracza
            if (startingPoint[0] === currentPlayer.publicId) {
                currentPlayerMapStartPoint = startingPoint[1];
            }
        }
        for (const pawnGroup of possiblePawnMoves) {
            for (const pawn of pawnGroup) {
                if (pawn[0] === data.publicId && data.pawnId) {
                    currentPawn.push(pawn, pawnGroupIndex); // [[publicId, pawnId], pawnGroupId]
                }
            }
            pawnGroupIndex += 1;
        }
        const currentPawnPlayerPublicId = currentPawn[0][0];
        if (currentPawn[1] === 0) {
            for (const element of this.gameData.gameMap) {
                if (!Number.isInteger(element)) {
                    if (currentPawnPlayerPublicId === element[0]) {
                        if (
                            this.gameData.gameMap.indexof(element) +
                                this.gameData.diceThrowResult >
                            currentPlayerMapStartPoint - 1
                        ) {
                            // sprawdzic czy moze wejsc na finisz
                            let result =
                                this.gameData.gameMap.indexof(element) +
                                this.gameData.diceThrowResult;
                            if (currentPlayerMapStartPoint != 0) {
                                result = result - currentPlayerMapStartPoint;
                            } else {
                                result = result - 40;
                            }
                            if (
                                this.gameData.finishPositions[
                                    this.currentPlayerIndex
                                ][result][1] === 0
                            ) {
                                this.gameData.finishPositions[
                                    this.currentPlayerIndex
                                ][result][1] = currentPawn[0][1];
                                this.gameData.gameMap[
                                    this.gameData.gameMap.indexof(element)
                                ] = 0;
                                let howManyFinished = 0;
                                for (const pawn of this.finishPositions[
                                    this.currentPlayerIndex
                                ]) {
                                    if (pawn[0] != 0) {
                                        howManyFinished += 1;
                                    }
                                }
                                if (howManyFinished == 4) {
                                    return this._gameEndWithTarget();
                                } else {
                                    howManyFinished = 0;
                                }
                                if (this.gameData.diceThrowResult == 6) {
                                    this.gameData.currentAction = "Rzut kością";
                                    return this._dataWithPlayersTarget();
                                } else {
                                    this.gameData.currentAction = "Rzut kością";
                                    this.nextTurn();
                                    return this._dataWithPlayersTarget();
                                }
                            } else if (
                                this.gameData.gameMap[
                                    this.gameData.gameMap.indexof(element) +
                                        this.gameData.diceThrowResult
                                ] != 0 // sprawdzamy czy na tym polu stoi jakiś pionek
                            ) {
                                const otherPawn =
                                    this.gameData.gameMap[
                                        this.gameData.gameMap.indexof(element) +
                                            this.gameData.diceThrowResult
                                    ];
                                if (otherPawn[0] != currentPlayer.publicId) {
                                    //sprawdzamy czy publiczne id jest różne od pId obecnego gracza,
                                    // gdyby bylo takie samo to ten gracz nie moze wejsc na pole
                                    // okupowane przez swoj wlasny pionek
                                    //Tutaj następuje zbijanie pionka
                                    this.gameData.gameMap[
                                        this.gameData.gameMap.indexof(element) +
                                            this.gameData.diceThrowResult
                                    ] = currentPawn[0][1];
                                    this.gameData.gameMap[
                                        this.gameData.gameMap.indexof(element)
                                    ] = 0;
                                    this.gameData.startingPositionArea.push(
                                        otherPawn,
                                    );
                                    if (this.gameData.diceThrowResult == 6) {
                                        this.gameData.currentAction =
                                            "Rzut kością";
                                        return this._dataWithPlayersTarget();
                                    } else {
                                        this.gameData.currentAction =
                                            "Rzut kością";
                                        this.nextTurn();
                                        return this._dataWithPlayersTarget();
                                    }
                                }
                            } else {
                                this.gameData.gameMap[
                                    this.gameData.gameMap.indexof(element) +
                                        this.gameData.diceThrowResult
                                ] = currentPawn[0][1];
                                this.gameData.gameMap[
                                    this.gameData.gameMap.indexof(element)
                                ] = 0;
                                if (this.gameData.diceThrowResult == 6) {
                                    this.gameData.currentAction = "Rzut kością";
                                    return this._dataWithPlayersTarget();
                                } else {
                                    this.gameData.currentAction = "Rzut kością";
                                    this.nextTurn();
                                    return this._dataWithPlayersTarget();
                                }
                            }
                        }
                    }
                }
            }
        } else if (currentPawn[1] === 1) {
            let currentPlayerMapStartPoint = 0;
            for (const startingPoint of this.gameData.playersStartingPoints) {
                if (startingPoint[0] === currentPlayer.publicId) {
                    currentPlayerMapStartPoint = startingPoint[1];
                }
            }
            for (const pawn of this.gameData.startingPositionArea) {
                if (pawn[0] === currentPlayer.publicId) {
                    if (
                        this.gameData.gameMap[currentPlayerMapStartPoint] === 0
                    ) {
                        //sprawdzamy czy pole jest puste
                        this.gameData.startingPositionArea.pop(pawn); // usuwa/wyciaga pionka
                        //z obszaru startowego
                        this.gameData.gameMap[currentPlayerMapStartPoint] =
                            pawn;
                        this.gameData.currentAction = "Rzut kością";
                        this.nextTurn();
                        return this._dataWithPlayersTarget();
                    } else if (
                        this.gameData.gameMap[currentPlayerMapStartPoint][0] !=
                        this._currentPlayer().publicId
                    ) {
                        //sprawdzamy czy tam jest pionek inny niż pionek obecnego gracza,
                        // ponieważ tylko na taki może tam wejść
                        const otherPawn =
                            this.gameData.gameMap[currentPlayerMapStartPoint];
                        this.gameData.startingPositionArea.pop(pawn); // usuwa/wyciaga pionka
                        //z obszaru startowego
                        this.gameData.gameMap[currentPlayerMapStartPoint] =
                            pawn;
                        this.gameData.startingPositionArea.push(otherPawn); //zbijanie pionka
                        this.gameData.currentAction = "Rzut kością";
                        this.nextTurn();
                        return this._dataWithPlayersTarget();
                    }
                }
            }
        } else {
            let index = 0;
            for (const pawns of this.gameData.finishPositions[
                this.currentPlayerIndex
            ]) {
                if (
                    index + this.gameData.diceThrowResult <=
                    this.gameData.finishPositions[this.currentPlayerIndex]
                        .length -
                        1
                ) {
                    if (
                        pawns[index][1] != 0 &&
                        pawns[index + this.gameData.diceThrowResult][1] === 0
                    ) {
                        this.gameData.finishPositions[this.currentPlayerIndex][
                            index + this.gameData.diceThrowResult
                        ][1] = pawns[index][1];
                        this.gameData.finishPositions[this.currentPlayerIndex][
                            index
                        ][1] = 0;
                    }
                }
                index += 1;
            }
            let howManyFinished = 0;
            for (const pawn of this.finishPositions[this.currentPlayerIndex]) {
                if (pawn[0] != 0) {
                    howManyFinished += 1;
                }
            }
            if (howManyFinished == 4) {
                return this._gameEndWithTarget();
            } else {
                howManyFinished = 0;
            }
            this.gameData.currentAction = "Rzut kością";
            this.nextTurn();
            return this._dataWithPlayersTarget();
        }
    }
}
