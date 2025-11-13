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
            // if (pId === this._currentPlayer().publicId) {
            if (this.playersQueue.length == 2) {
                mapStartPoint = this.playersQueue.indexOf(pId) * 20;
                playersStartingPoints.push([pId, mapStartPoint]);
            } else {
                mapStartPoint = this.playersQueue.indexOf(pId) * 10;
                playersStartingPoints.push([pId, mapStartPoint]);
            }
            // }
        }
        return playersStartingPoints;
    }

    gameDataRequest(data) {
        // bierze wszystkie dane dot. gry i odsyla
        return [
            this._dataWithPlayerTarget(data.publicId),
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
            players.push(player);
        }
        return players
            .sort((a, b) => {
                return a.getData("turnOrder") - b.getData("turnOrder");
            })
            .map((player) => {
                return player.getPlayerData();
            });
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
            const numberOfPlaces = 4;
            const numberOfPlayers = this.playersQueue.length;
            for (const [, player] of this.players) {
                tempPawns.push([player.publicId, 0]); // [[niebieski,0],
                // [czerwony,0],[zielony,0],[zolty,0]]
            }
            for (let i = 0; i < numberOfPlayers; i++) {
                pawns.push([]);
                for (let j = 0; j < numberOfPlaces; j++) {
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
        console.log("dataWithPlayersTarget")
        const targets = [];
        const possiblePawnMoves = this._possibleMoves();
        for (const [, player] of this.players) {
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

    _dataWithPlayerTarget(publicId) {
        const possiblePawnMoves = this._possibleMoves();

        return {
            target: publicId,
            eventName: "gameData",
            data: {
                ...this.gameData,
                yourTurn:
                    publicId === this.playersQueue[this.currentPlayerIndex],
                currentPlayerIndex: this.currentPlayerIndex,
                possiblePawnMoves,
            },
        };
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
        for (const [, player] of this.players) {
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
        console.log("DUPAROLLDICE");
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
        if (this.gameData.timesThrown <= 3) {
            // Sprawdzamy ile razy jeden gracz rzucil koscia zeby mogl
            // rzucic maksymalnie 3 razy (na start gry, czy jest start gry sprawdzamy w kodzie)
            const currentPlayer = this._currentPlayer();

            // this.gameData.diceThrowResult = Math.floor(Math.random() * 6) + 1;
            this.gameData.diceThrowResult = 6
            const possibleMoves = this._possibleMoves();

            if (
                this.gameData.diceThrowResult === 6 ||
                this.gameData.diceThrowResult === 1
            ) {
                console.log("DUPARZUT6LUB1");
                this.gameData.timesThrown = 0; // reset ile razy wyrzucono kosci
                if (possibleMoves === false) {
                    // jezeli possibleMoves wynosi false to oznacza, ze gracz nie
                    // moze sie ruszyc zadnym pionkiem, nawet tymi na starcie,
                    // przez co traci ture, nie ma kolejnego rzutu bo to nie jest tura startowa
                    console.log("DUPANIEMAMOZLIWYCHRUCHOW");
                    this.gameData.currentAction = "Rzut kością";
                    this.nextTurn();
                    return this._dataWithPlayersTarget();
                } else {
                    console.log("DUPARUCHPIONKA");
                    this.gameData.currentAction = "Ruch pionka";
                    return this._dataWithPlayersTarget();
                }
            } else {
                // rzut od 2 do 5
                console.log("DUPARZUTOD2DO5");
                console.log(possibleMoves);
                console.log("DUPA");
                if (
                    // possibleMoves[0].length > 1 ||
                    // possibleMoves[2].length > 1
                    possibleMoves != false
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
            console.log("DUPA");
            // jeżeli użytkownik próbuje rzucić kością 4 raz to tura przechodzi do innego gracza
            this.gameData.timesThrown = 0;
            this.gameData.currentAction = "Rzut kością";
            this.nextTurn();
            console.log("DUPARZUT4RAZY");
            return this._dataWithPlayersTarget();
        }
    }

    // _possibleMoves(currentPlayer) {
    _possibleMoves() {
        const publicId = this.playersQueue[this.currentPlayerIndex]
        console.log("DUPAPOSSIBLEMOVES");
        this.gameData.anyPossibleMoves = false;
        let possibleMoves = [
            [], // "PionkiNaPlanszy"
            [], // "PionkiNaStarcie"
            [], // "PionkiNaFinishu"
        ]; // wygodniej byłoby na obiektach ale nie chcemy ich
        // przekazywać chyba, że będziemy je rozpakowywać?? Do ustalenia
        // let anyPossibleMoves = false;
        let currentPlayerMapStartPoint = 0;
        console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
        for (const startingPoint of this.gameData.playersStartingPoints) {
            //znajdujemy punkt startowy obecnego gracza
            if (startingPoint[0] === publicId) {
                currentPlayerMapStartPoint = startingPoint[1];
            }
        }
        console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC");
        if (
            this.gameData.diceThrowResult === 6 ||
            this.gameData.diceThrowResult === 1
        ) {
            console.log("CoSieTuOdpierdala.ExeDUPA");
            if (this.gameData.diceThrowResult === 1) {
                this._possibleMovesFinish(possibleMoves);
                // anyPossibleMoves = true;
            }
            console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
            this._possibleMovesMap(
                currentPlayerMapStartPoint,
                possibleMoves,
            );
            console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            for (const pawn of this.gameData.startingPositionArea) {
                //jeżeli pionek jest na starcie to dodajemy go do możliwych ruchów
                if (pawn[0] === publicId) {
                    if (
                        this.gameData.gameMap[currentPlayerMapStartPoint] === 0
                    ) {
                        //sprawdzamy czy pole jest puste
                        console.log(pawn)
                        possibleMoves[1].push([pawn]);
                        this.gameData.anyPossibleMoves = true;
                        console.log(
                            "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
                        );
                    } else if (
                        this.gameData.gameMap[currentPlayerMapStartPoint][0] !=
                        // this._currentPlayer().publicId
                        publicId
                    ) {
                        //sprawdzamy czy tam jest pionek inny niż pionek obecnego gracza,
                        // ponieważ tylko na taki może tam wejść
                        console.log(pawn)
                        possibleMoves[1].push([pawn]);
                        this.gameData.anyPossibleMoves = true;
                        console.log(
                            "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
                        );
                    }
                }
            }
        } else {
            if (
                this.gameData.diceThrowResult <= 3 &&
                this.gameData.diceThrowResult >= 1
            ) {
                this._possibleMovesFinish(possibleMoves);
                // anyPossibleMoves = true;
                console.log(
                    "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH",
                );
            }

            this._possibleMovesMap(
                currentPlayerMapStartPoint,
                possibleMoves,
            );
            // anyPossibleMoves = true;
        }
        if (this.gameData.anyPossibleMoves === true) {
            console.log("IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
            return possibleMoves;
        } else {
            console.log("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ");
            return false;
        }
    }

    _possibleMovesFinish(possibleMoves) {
        const publicId = this.playersQueue[this.currentPlayerIndex]
        console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK");
        let index = 0;
        for (const pawns of this.gameData.finishPositions /*[
            this.currentPlayerIndexIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
        ]*/) {
            if (pawns[0][0] === publicId) {
                console.log("dupa_possibleMovesFinish1");
                if (
                    index + this.gameData.diceThrowResult <=
                    this.gameData.finishPositions[this.currentPlayerIndex]
                        .length -
                        1
                ) {
                    console.log("dupa_possibleMovesFinish2");
                    if (
                        pawns[index][1] != 0 &&
                        pawns[index + this.gameData.diceThrowResult][1] === 0
                    ) {
                        console.log("dupa_possibleMovesFinish3");
                        console.log(pawns[index])
                        possibleMoves[0].push(pawns[index]);
                        this.gameData.anyPossibleMoves = true;
                    }
                    console.log("dupa_possibleMovesFinish4");
                }
                index += 1;
                console.log("dupa_possibleMovesFinish5");
            }
        }
    }

    _possibleMovesMap(currentPlayerMapStartPoint, possibleMoves) {
        const publicId = this.playersQueue[this.currentPlayerIndex]
        console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
        console.log(publicId)
        console.log(this._currentPlayer().publicId)
        console.log(this.playersQueue[this.currentPlayerIndex])
        for (const element of this.gameData.gameMap) {
            //sprawdzamy czy jest jakiś pionek na mapie za pomocą
            // porównania pierwszego indeksu tablicy pionka (pId) z publicznym Id gracza
            if (!Number.isInteger(element)) {
                console.log("CoSieTuOdpierdala.ExeDUPAV2")
                if (element[0] === publicId) {
                    console.log("CoSieTuOdpierdala.ExeDUPAV3")
                    console.log(this.gameData.gameMap.indexOf(element))
                    console.log(this.gameData.diceThrowResult)
                    console.log(currentPlayerMapStartPoint - 1)
                    //jeżeli pionek jest na planszy to dodajemy go do możliwych ruchów.
                    if(currentPlayerMapStartPoint == 0 && this.gameData.gameMap.indexOf(element) +
                        this.gameData.diceThrowResult > 39){
                        // sprawdzic czy moze wejsc na finisz
                        let result =
                            this.gameData.gameMap.indexOf(element) +
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
                        if(result >= 0 && result <= 3){
                            if (
                                this.gameData.finishPositions[
                                    this.currentPlayerIndex
                                ][result][1] === 0
                            ) {
                                console.log([element])
                                possibleMoves[0].push([element]);
                                this.gameData.anyPossibleMoves = true;
                            }
                        }
                    }
                    else if (
                        this.gameData.gameMap.indexOf(element) < currentPlayerMapStartPoint &&
                        this.gameData.gameMap.indexOf(element) +
                            this.gameData.diceThrowResult >
                        currentPlayerMapStartPoint - 1
                    ) {
                        // sprawdzic czy moze wejsc na finisz
                        let result =
                            this.gameData.gameMap.indexOf(element) +
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
                        if(result >= 0 && result <= 3){
                            if (
                                this.gameData.finishPositions[
                                    this.currentPlayerIndex
                                ][result][1] === 0
                            ) {
                                console.log([element])
                                possibleMoves[0].push([element]);
                                this.gameData.anyPossibleMoves = true;
                            }
                        }
                    } else if (
                        this.gameData.gameMap[
                            this.gameData.gameMap.indexOf(element) +
                                this.gameData.diceThrowResult
                        ] != 0 // sprawdzamy czy na tym polu stoi jakiś pionek
                    ) {
                        const spaceTaken =
                            this.gameData.gameMap[
                                this.gameData.gameMap.indexOf(element) +
                                    this.gameData.diceThrowResult
                            ];
                        if (spaceTaken[0] != publicId) {
                            //sprawdzamy czy publiczne id jest różne od pId obecnego gracza,
                            // gdyby bylo takie samo to ten gracz nie moze wejsc na pole
                            // okupowane przez swoj wlasny pionek
                            console.log([element])
                            possibleMoves[0].push([element]);
                            this.gameData.anyPossibleMoves = true;
                            //Tutaj następuje zbijanie pionka
                        }
                    } else {
                        console.log([element])
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
        console.log(data.pawnId)
        const publicId = this.playersQueue[this.currentPlayerIndex]
        console.log("DUPARUCHGRACZA");
        if (data.publicId != publicId) {
            throw new Error("Poczekaj na swoją turę.");
        }
        if (this.gameData.currentAction != "Ruch pionka") {
            throw new Error("Nieprawidłowa akcja.");
        }
        let currentPlayer = this._currentPlayer();
        console.log("DUPARUCHGRACZA1");
        let possiblePawnMoves = this._possibleMoves();
        console.log(possiblePawnMoves)
        console.log(this._possibleMoves())
        console.log("DUPARUCHGRACZA2");
        let currentPawn = [];
        let pawnGroupIndex = 0; // 0 - plansza, 1 - start, 2 - finish
        let currentPlayerMapStartPoint = 0;
        console.log("DUPARUCHGRACZA3");
        for (const startingPoint of this.gameData.playersStartingPoints) {
            //znajdujemy punkt startowy obecnego gracza
            if (startingPoint[0] === publicId) {
                currentPlayerMapStartPoint = startingPoint[1];
            }
        }
        console.log("DUPARUCHGRACZA4");
        console.log(possiblePawnMoves)
        for (const pawnGroup of possiblePawnMoves) {
            console.log("DUPARUCHGRACZAWCHODZIDOFUNKCJIFOR");
            console.log(pawnGroup)
            for (const pawns of pawnGroup) {
                console.log(pawns)
                for (const pawn of pawns) {
                    console.log(pawn);
                    console.log(data.publicId);
                    console.log("Dupa-----------------------------------------------------")
                    console.log(data.pawnId);
                    console.log("Dupa-----------------------------------------------------")
                    console.log(pawn[0] === data.publicId);
                    console.log(pawn[1] === data.publicId);
                    if (pawn[0] === data.publicId && pawn[1] === data.pawnId) {
                        currentPawn.push(pawn, pawnGroupIndex); // [[publicId, pawnId], pawnGroupId]
                    }
                }
            }
            pawnGroupIndex += 1;
        }
        console.log("DUPARUCHGRACZA5");
        console.log(currentPawn);
        console.log("DUPARUCHGRACZA5");
        if (currentPawn[1] === 0) {
            console.log("DUPARUCHGRACZA6");
            for (const element of this.gameData.gameMap) {
                if (!Number.isInteger(element)) {
                    console.log("DUPARUCHGRACZA7");
                    if (currentPawn[0][0] === element[0] && element[1] === currentPawn[0][1]) {
                        console.log("DUPARUCHGRACZA8");
                        if (
                            this.gameData.gameMap.indexOf(element) +
                                this.gameData.diceThrowResult >
                            currentPlayerMapStartPoint - 1
                        ) {
                            console.log("DUPARUCHGRACZA9");
                            // sprawdzic czy moze wejsc na finisz
                            let result =
                                this.gameData.gameMap.indexOf(element) +
                                this.gameData.diceThrowResult;
                            if (currentPlayerMapStartPoint != 0) {
                                console.log("DUPARUCHGRACZA10");
                                result = result - currentPlayerMapStartPoint;
                            } else {
                                console.log("DUPARUCHGRACZA11");
                                result = result - 40;
                            }
                            if(result >= 0 && result <= 3){
                                if (
                                    this.gameData.finishPositions[
                                        this.currentPlayerIndex
                                    ][result][1] === 0
                                ) {
                                    console.log("DUPARUCHGRACZA12");
                                    this.gameData.finishPositions[
                                        this.currentPlayerIndex
                                    ][result][1] = currentPawn[0][1];
                                    this.gameData.gameMap[
                                        this.gameData.gameMap.indexOf(element)
                                    ] = 0;
                                    let howManyFinished = 0;
                                    for (const pawn of this.gameData.finishPositions[
                                        this.currentPlayerIndex
                                    ]) {
                                        console.log("DUPARUCHGRACZA13");
                                        if (pawn[0] != 0) {
                                            howManyFinished += 1;
                                        }
                                    }
                                    if (howManyFinished == 4) {
                                        console.log("DUPARUCHGRACZA14");
                                        return this._gameEndWithTarget();
                                    } else {
                                        console.log("DUPARUCHGRACZA15");
                                        howManyFinished = 0;
                                    }
                                    if (this.gameData.diceThrowResult == 6) {
                                        console.log("DUPARUCHGRACZA16-------------------------------------------------------------------------------------------------------------------------------------------------------");
                                        this.gameData.currentAction = "Rzut kością";
                                        return this._dataWithPlayersTarget();
                                    } else {
                                        console.log("DUPARUCHGRACZA17-------------------------------------------------------------------------------------------------------------------------------------------------------");
                                        this.gameData.currentAction = "Rzut kością";
                                        this.nextTurn();
                                        return this._dataWithPlayersTarget();
                                    }
                                }
                            } else if (
                                this.gameData.gameMap[
                                    this.gameData.gameMap.indexOf(element) +
                                        this.gameData.diceThrowResult
                                ] != 0 // sprawdzamy czy na tym polu stoi jakiś pionek
                            ) {
                                console.log("DUPARUCHGRACZA18");
                                const otherPawn =
                                    this.gameData.gameMap[
                                        this.gameData.gameMap.indexOf(element) +
                                            this.gameData.diceThrowResult
                                    ];
                                if (otherPawn[0] != publicId) {
                                    console.log("DUPARUCHGRACZA19");
                                    //sprawdzamy czy publiczne id jest różne od pId obecnego gracza,
                                    // gdyby bylo takie samo to ten gracz nie moze wejsc na pole
                                    // okupowane przez swoj wlasny pionek
                                    //Tutaj następuje zbijanie pionka
                                    this.gameData.gameMap[
                                        this.gameData.gameMap.indexOf(element) +
                                            this.gameData.diceThrowResult
                                    ] = element;
                                    this.gameData.gameMap[
                                        this.gameData.gameMap.indexOf(element)
                                    ] = 0;
                                    this.gameData.startingPositionArea.push(
                                        otherPawn,
                                    );
                                    if (this.gameData.diceThrowResult == 6) {
                                        console.log("DUPARUCHGRACZA20-------------------------------------------------------------------------------------------------------------------------------------------------------");
                                        this.gameData.currentAction =
                                            "Rzut kością";
                                        return this._dataWithPlayersTarget();
                                    } else {
                                        console.log("DUPARUCHGRACZA21-------------------------------------------------------------------------------------------------------------------------------------------------------");
                                        this.gameData.currentAction =
                                            "Rzut kością";
                                        this.nextTurn();
                                        return this._dataWithPlayersTarget();
                                    }
                                }
                            } else {
                                console.log("DUPARUCHGRACZA22");
                                this.gameData.gameMap[
                                    this.gameData.gameMap.indexOf(element) +
                                        this.gameData.diceThrowResult
                                ] = element;
                                this.gameData.gameMap[
                                    this.gameData.gameMap.indexOf(element)
                                ] = 0;
                                if (this.gameData.diceThrowResult == 6) {
                                    console.log("DUPARUCHGRACZA23-------------------------------------------------------------------------------------------------------------------------------------------------------");
                                    this.gameData.currentAction = "Rzut kością";
                                    return this._dataWithPlayersTarget();
                                } else {
                                    console.log("DUPARUCHGRACZA24-------------------------------------------------------------------------------------------------------------------------------------------------------");
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
            console.log("DUPARUCHGRACZA25");
            let currentPlayerMapStartPoint = 0;
            for (const startingPoint of this.gameData.playersStartingPoints) {
                if (startingPoint[0] === publicId) {
                    console.log("DUPARUCHGRACZA26");
                    currentPlayerMapStartPoint = startingPoint[1];
                }
            }
            let isAreaClear = true
            let pawnToLeaveStart = null
            let pawnToGoBackToStart = null 
            for (const pawn of this.gameData.startingPositionArea) {
                console.log("DUPARUCHGRACZA27");
                if (pawn[0] === publicId && pawn[1] === data.pawnId) {
                    console.log("DUPARUCHGRACZA28");
                    if (
                        this.gameData.gameMap[currentPlayerMapStartPoint] === 0
                    ) {
                        isAreaClear = true
                        pawnToLeaveStart = pawn
                    } else if (
                        this.gameData.gameMap[currentPlayerMapStartPoint][0] !=
                        publicId
                    ) {
                        isAreaClear = false
                        pawnToLeaveStart = pawn
                        pawnToGoBackToStart =
                            this.gameData.gameMap[currentPlayerMapStartPoint];
                    }
                }
            }
            if(isAreaClear === true){
                console.log("DUPARUCHGRACZA29-------------------------------------------------------------------------------------------------------------------------------------------------------");
                //sprawdzamy czy pole jest puste
                console.log(publicId)
                console.log(this.gameData.startingPositionArea)
                this.gameData.startingPositionArea.splice(this.gameData.startingPositionArea.indexOf(pawnToLeaveStart),1); // usuwa/wyciaga pionka
                //z obszaru startowego
                console.log(this.gameData.startingPositionArea)
                this.gameData.gameMap[currentPlayerMapStartPoint] =
                    pawnToLeaveStart;
                this.gameData.currentAction = "Rzut kością";
                this.nextTurn();
                return this._dataWithPlayersTarget();
            } else{
                console.log("DUPARUCHGRACZA30-------------------------------------------------------------------------------------------------------------------------------------------------------");
                //sprawdzamy czy tam jest pionek inny niż pionek obecnego gracza,
                // ponieważ tylko na taki może tam wejść
                console.log(publicId)
                console.log(this.gameData.startingPositionArea)
                this.gameData.startingPositionArea.splice(this.gameData.startingPositionArea.indexOf(pawnToLeaveStart),1); // usuwa/wyciaga pionka
                //z obszaru startowego
                console.log(this.gameData.startingPositionArea)
                this.gameData.gameMap[currentPlayerMapStartPoint] =
                    pawnToLeaveStart;
                this.gameData.startingPositionArea.push(pawnToGoBackToStart); //zbijanie pionka
                this.gameData.currentAction = "Rzut kością";
                this.nextTurn();
                return this._dataWithPlayersTarget();
            }
        } else {
            console.log("DUPARUCHGRACZA31");
            let index = 0;
            for (const pawn of this.gameData.finishPositions[
                this.currentPlayerIndex
            ]) {
                console.log("DUPARUCHGRACZA32");
                if(pawn[0] === currentPawn[0][0] && pawn[1] === currentPawn[0][1]){
                    if (
                        index + this.gameData.diceThrowResult <=
                        this.gameData.finishPositions[this.currentPlayerIndex]
                            .length -
                            1
                    ) {
                        console.log("DUPARUCHGRACZA33");
                        const targetIndex = index + this.gameData.diceThrowResult
                        if (
                            this.gameData.finishPositions[this.currentPlayerIndex][targetIndex][1] === 0
                        ) {
                            this.gameData.finishPositions[this.currentPlayerIndex][targetIndex][1] = pawn[1];
                            this.gameData.finishPositions[this.currentPlayerIndex][
                                index
                            ][1] = 0;
                        }
                    }
                }
                index += 1;
            }
            console.log("DUPARUCHGRACZA34");
            let howManyFinished = 0;
            for (const pawn of this.gameData.finishPositions[this.currentPlayerIndex]) {
                if (pawn[0] != 0) {
                    howManyFinished += 1;
                }
            }
            if (howManyFinished == 4) {
                console.log("DUPARUCHGRACZA35");
                return this._gameEndWithTarget();
            } else {
                console.log("DUPARUCHGRACZA36");
                howManyFinished = 0;
            }
            console.log("DUPARUCHGRACZA37-------------------------------------------------------------------------------------------------------------------------------------------------------");
            this.gameData.currentAction = "Rzut kością";
            this.nextTurn();
            return this._dataWithPlayersTarget();
        }
    }
}
