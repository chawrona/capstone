import Game from "../Game.js";

export default class Ludo extends Game {
    constructor(players, endGame) {
        super(players, endGame);
    }

    initializeGameData() {
        this.gameData.gameMap = Array.from({ length: 40 }, () => 0);
        // [0,0,0,0,[pIdNiebieskiego,1],0,0,0]
        this.gameData.currentAction = "Rzut kością";
        this.gameData.startingPositionArea = this._setPawns("start");
        this.gameData.finishPositions = this._setPawns("finish");
        this.gameData.timesThrown = 0;
        this.gameData.diceThrowResult = 0;
        this.gameData.playersStartingPoints = this._setPlayersStartingPoints();
        this.gameData.anyPossibleMoves = false;
    }

    setGameMap(data) {
        this.gameData.gameMap = JSON.parse(data.map);
        return this._dataWithPlayersTarget();
    }

    setFinished(data) {
        this.gameData.finishPositions = JSON.parse(data.finished);
        return this._dataWithPlayersTarget();
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
            this.players.get(pId).setData("startingField", () => mapStartPoint);
        }
        return playersStartingPoints;
    }

    _newPosition(pawnId) {
        const publicId = this.playersQueue[this.currentPlayerIndex];
        let newPosition = null;
        let currentPosition = null;
        for (const element of this.gameData.gameMap) {
            if (!pawn) {
                if (element[0] === publicId && element[1] == pawnId) {
                    currentPosition = this.gameData.gameMap.indexOf(element);
                }
            }
        }
        if (currentPosition + this.gameData.diceThrowResult > 39) {
            newPosition = currentPosition + this.gameData.diceThrowResult - 40;
        } else {
            newPosition = currentPosition + this.gameData.diceThrowResult;
        }
        return newPosition;
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
        console.log("dataWithPlayersTarget");
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
                    yourPublicId: player.publicId,
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
                yourPublicId: publicId,
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

    rollDice(data) {
        console.log("DUPAROLLDICE");
        if (data.publicId != this.playersQueue[this.currentPlayerIndex]) {
            throw new Error("Poczekaj na swoją turę.");
        }
        if (this.gameData.currentAction != "Rzut kością") {
            throw new Error("Nieprawidłowa akcja.");
        }
        this.gameData.timesThrown += 1;
        if (this.gameData.timesThrown <= 3) {
            const currentPlayer = this._currentPlayer();
            const testing = Math.floor(Math.random() * 6) + 1;
            this.gameData.diceThrowResult = testing % 2 ? 6 : 5;
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
        const currentPlayerPublicId = this.playersQueue[this.currentPlayerIndex];
        this.gameData.anyPossibleMoves = false;
        let possibleMoves = [
            [], // "PionkiNaPlanszy"
            [], // "PionkiNaStarcie"
            [], // "PionkiNaFinishu"
        ];
        const currentPlayerMapStartPoint = this._getPlayerStartPoint(currentPlayerPublicId);
        const rollResult = this.gameData.diceThrowResult
        const pawnOnStartingField = this.gameData.gameMap[currentPlayerMapStartPoint]
        
        // Dodawanie pionków z bazy
        const thrownOneOrSix = rollResult === 6 || rollResult === 1
        const isStartingFieldClear = !pawnOnStartingField
        const isOurPawnOnStartingField = pawnOnStartingField[0] === currentPlayerPublicId
        if (thrownOneOrSix && (isStartingFieldClear || !isOurPawnOnStartingField)) {
            for (const [publicId, pawnId] of this.gameData.startingPositionArea) {
                if (publicId === currentPlayerPublicId) {
                    possibleMoves[1].push([publicId, pawnId])
                }
            }
        }

        // Dodawanie pionków z mapy
        this.gameData.gameMap.forEach((pawn, currentPosition) => {
            if (!Number.isInteger(pawn) && pawn[0] === currentPlayerPublicId) {
                const newPosition = this.gameData.diceThrowResult + currentPosition
                let lapDone = currentPosition < currentPlayerMapStartPoint && newPosition >= currentPlayerMapStartPoint
                // specjalny warunek dla startingPoint równe 0
                if (currentPlayerMapStartPoint === 0) {
                    lapDone = [39,38,37,36,35,34].includes(currentPosition) && newPosition >= currentPlayerMapStartPoint
                }
                
                if (lapDone) {
                    const finishPosition = newPosition - currentPlayerMapStartPoint - 1
                    for (const playerPawns of this.gameData.finishPositions) {
                        if (playerPawns[0][0] === currentPlayerPublicId) {
                            let isPawnOnFinishPosition = false
                            for (const finishPawn of playerPawns) {
                                if (finishPawn[1] === finishPosition) {
                                    isPawnOnFinishPosition = true
                                }
                            }
                            if (!isPawnOnFinishPosition) {
                                possibleMoves[0].push(pawn)
                            }
                        }
                    }
                } else {
                    const pawnOnNewPosition = this.gameData.gameMap[newPosition]
                    if (!pawnOnNewPosition || pawnOnNewPosition[0] !== currentPlayerPublicId) {
                        possibleMoves[0].push(pawn)
                    }
                }
            }
        });

        // Dodawanie pionków z finiszu
        if (![1,2,3].includes(rollResult)) return possibleMoves

        for (const playerPawns of this.gameData.finishPositions) {
            if (playerPawns[0][0] === currentPlayerPublicId) {
                for (const finishPawn of playerPawns) {
                    const currentFinishPosition = finishPawn[1]
                    const newFinishPosition = currentFinishPosition + rollResult

                    if (newFinishPosition < 4) {
                        let isPawnOnFinishPosition = false

                        for (const checkedFinishPawn of playerPawns) {
                            if (checkedFinishPawn[1] === newFinishPosition) {
                                isPawnOnFinishPosition = true
                            }
                        }

                        if (!isPawnOnFinishPosition) {
                            possibleMoves[2].push(finishPawn)
                        }
                    }
                }
            }
        }

        if (possibleMoves[0].length || possibleMoves[1].length || possibleMoves[2].length) return possibleMoves

        return false;
    }

    _possibleMovesFinish(possibleMoves) {
        const publicId = this.playersQueue[this.currentPlayerIndex];
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
                        console.log(pawns[index]);
                        possibleMoves[2].push(pawns[index]);
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
        const publicId = this.playersQueue[this.currentPlayerIndex];
        console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
        console.log(publicId);
        console.log(this._currentPlayer().publicId);
        console.log(this.playersQueue[this.currentPlayerIndex]);
        let wentPastLastMapIndex = false;
        console.log("DUPARUCHGRACZA3");
        for (const element of this.gameData.gameMap) {
            if (!Number.isInteger(element)) {
                if (element[0] === publicId) {
                    if(this.gameData.gameMap.indexOf(element) + this.gameData.diceThrowResult > 39){
                        wentPastLastMapIndex = true
                    }
                    else if (
                        this.gameData.gameMap.indexOf(element) +
                            this.gameData.diceThrowResult <
                        currentPlayerMapStartPoint
                    ) {
                        wentPastLastMapIndex = true;
                    }

                }
            }
        }
        for (const element of this.gameData.gameMap) {
            //sprawdzamy czy jest jakiś pionek na mapie za pomocą
            // porównania pierwszego indeksu tablicy pionka (pId) z publicznym Id gracza
            if (!Number.isInteger(element)) {
                console.log("CoSieTuOdpierdala.ExeDUPAV2");
                if (element[0] === publicId) {
                    console.log("CoSieTuOdpierdala.ExeDUPAV3");
                    console.log(this.gameData.gameMap.indexOf(element));
                    console.log(this.gameData.diceThrowResult);
                    let newPosition = this._newPosition(data.pawnId);
                    console.log(newPosition);
                    //jeżeli pionek jest na planszy to dodajemy go do możliwych ruchów.
                    if (
                        this.gameData.gameMap.indexOf(element) +
                            this.gameData.diceThrowResult >
                            currentPlayerMapStartPoint - 1 &&
                        wentPastLastMapIndex === true
                    ) {
                        let finishPosition = this.gameData.gameMap.indexOf(element) + this.gameData.diceThrowResult - currentPlayerMapStartPoint
                        if (finishPosition >= 0 && finishPosition <= 3) {
                            console.log("DupaHaloWidziszMnie?");
                            if (
                                this.gameData.finishPositions[
                                    this.currentPlayerIndex
                                ][finishPosition][1] === 0
                            ) {
                                console.log([element]);
                                possibleMoves[0].push([element]);
                                this.gameData.anyPossibleMoves = true;
                            }
                        } else if (
                            this.gameData.gameMap[
                                newPosition
                            ] != 0 // sprawdzamy czy na tym polu
                            // stoi jakiś pionek
                        ) {
                            console.log("DupaHaloWidziszMnie2?");
                            const spaceTaken =
                                this.gameData.gameMap[
                                    newPosition
                                ];
                            if (spaceTaken[0] != publicId) {
                                //sprawdzamy czy publiczne id jest różne od pId obecnego gracza,
                                // gdyby bylo takie samo to ten gracz nie moze wejsc na pole
                                // okupowane przez swoj wlasny pionek
                                console.log([element]);
                                possibleMoves[0].push([element]);
                                this.gameData.anyPossibleMoves = true;
                                //Tutaj następuje zbijanie pionka
                            }
                        } else {
                            console.log("DupaHaloWidziszMnie3?");
                            console.log([element]);
                            possibleMoves[0].push([element]);
                            this.gameData.anyPossibleMoves = true;
                        }
                    } else {
                        if (
                            this.gameData.gameMap[
                                newPosition
                            ] != 0 // sprawdzamy czy na tym polu 
                            // stoi jakiś pionek
                        ) {
                            console.log("DupaHaloWidziszMnie2?");
                            const spaceTaken =
                                this.gameData.gameMap[
                                    newPosition
                                ];
                            if (spaceTaken[0] != publicId) {
                                //sprawdzamy czy publiczne id jest różne od pId obecnego gracza,
                                // gdyby bylo takie samo to ten gracz nie moze wejsc na pole
                                // okupowane przez swoj wlasny pionek
                                console.log([element]);
                                possibleMoves[0].push([element]);
                                this.gameData.anyPossibleMoves = true;
                                //Tutaj następuje zbijanie pionka
                            }
                        } else {
                            console.log("DupaHaloWidziszMnie3?");
                            console.log([element]);
                            possibleMoves[0].push([element]);
                            this.gameData.anyPossibleMoves = true;
                        }
                    }
                }
            }
        }
    }

    _finishTurn(){
        console.log("DUPARUCHGRACZAFINISHTURN-----------------------------",);
        this.gameData.currentAction ="Rzut kością";
        if (this.gameData.diceThrowResult != 6) {
            this.nextTurn();
        }
        return this._dataWithPlayersTarget();
    }

    _getPlayerStartPoint(publicId){
        return this.players.get(publicId).getData("startingField")
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
        const publicId = this.playersQueue[this.currentPlayerIndex];
        if (data.publicId != publicId) {
            throw new Error("Poczekaj na swoją turę.");
        }
        if (this.gameData.currentAction != "Ruch pionka") {
            throw new Error("Nieprawidłowa akcja.");
        }
        let possiblePawnMoves = this._possibleMoves();
        let currentPawn = [];
        let pawnGroupIndex = 0; // 0 - plansza, 1 - start, 2 - finish
        const currentPlayerMapStartPoint = this._getPlayerStartPoint(publicId)
        let wentPastLastMapIndex = false;
        for (const element of this.gameData.gameMap) {
            if (!Number.isInteger(element)) {
                if (element[0] === publicId) {
                    if (
                        this.gameData.gameMap.indexOf(element) +
                            this.gameData.diceThrowResult <
                        currentPlayerMapStartPoint
                    ) {
                        wentPastLastMapIndex = true;
                    }
                }
            }
        }
        for (const pawnGroup of possiblePawnMoves) {
            for (const pawns of pawnGroup) {
                for (const pawn of pawns) {
                    if (pawn[0] === data.publicId && pawn[1] === data.pawnId) {
                        currentPawn.push(
                            pawn,
                            pawnGroupIndex,
                            wentPastLastMapIndex,
                        ); // [[publicId, pawnId], pawnGroupId, wentPastLastMapIndex]
                    }
                }
            }
            pawnGroupIndex += 1;
        }
        if (currentPawn.length === 0) {
            throw new Error("Nieprawidłowa akcja.");
        }
        let newPosition = this._newPosition(data.pawnId);
        if (currentPawn[1] === 0) {
            for (const element of this.gameData.gameMap) {
                if (!Number.isInteger(element)) {
                    if (
                        currentPawn[0][0] === element[0] &&
                        element[1] === currentPawn[0][1]
                    ) {
                        if (
                            this.gameData.gameMap.indexOf(element) +
                                this.gameData.diceThrowResult >
                                currentPlayerMapStartPoint - 1 &&
                            wentPastLastMapIndex === true
                        ) {
                            // sprawdzic czy moze wejsc na finisz
                           let finishPosition = this.gameData.gameMap.indexOf(element) + this.gameData.diceThrowResult - currentPlayerMapStartPoint
                            if (finishPosition >= 0 && finishPosition <= 3) {
                                if (
                                    this.gameData.finishPositions[
                                        this.currentPlayerIndex
                                    ][finishPosition][1] === 0
                                ) {
                                    this.gameData.finishPositions[
                                        this.currentPlayerIndex
                                    ][finishPosition][1] = currentPawn[0][1];
                                    this.gameData.gameMap[
                                        this.gameData.gameMap.indexOf(element)
                                    ] = 0;
                                    let howManyFinished = 0;
                                    for (const pawn of this.gameData
                                        .finishPositions[
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
                                    return this._finishTurn()
                                }
                            } else if (
                                this.gameData.gameMap[
                                    newPosition
                                    // this.gameData.gameMap.indexOf(element) +
                                    //     this.gameData.diceThrowResult
                                ] != 0 // sprawdzamy czy na tym polu stoi jakiś pionek
                            ) {
                                const otherPawn =
                                    this.gameData.gameMap[
                                        newPosition
                                    ];
                                if (otherPawn[0] != publicId) {
                                    //sprawdzamy czy publiczne id jest różne od pId obecnego gracza,
                                    // gdyby bylo takie samo to ten gracz nie moze wejsc na pole
                                    // okupowane przez swoj wlasny pionek
                                    //Tutaj następuje zbijanie pionka
                                    this.gameData.gameMap[
                                        newPosition
                                        // this.gameData.gameMap.indexOf(element) +
                                        //     this.gameData.diceThrowResult
                                    ] = element;
                                    this.gameData.gameMap[
                                        this.gameData.gameMap.indexOf(element)
                                    ] = 0;
                                    this.gameData.startingPositionArea.push(
                                        otherPawn,
                                    );
                                    return this._finishTurn()
                                }
                            } else {
                                this.gameData.gameMap[
                                    newPosition
                                    // this.gameData.gameMap.indexOf(element) +
                                    //     this.gameData.diceThrowResult
                                ] = element;
                                this.gameData.gameMap[
                                    this.gameData.gameMap.indexOf(element)
                                ] = 0;
                                return this._finishTurn()
                            }
                        } else {
                            if (
                                this.gameData.gameMap[
                                    newPosition
                                    // this.gameData.gameMap.indexOf(element) +
                                    //     this.gameData.diceThrowResult
                                ] != 0
                            ) {
                                const otherPawn =
                                    this.gameData.gameMap[
                                        newPosition
                                    ];
                                if (otherPawn[0] != publicId) {
                                    //sprawdzamy czy publiczne id jest różne od pId obecnego gracza,
                                    // gdyby bylo takie samo to ten gracz nie moze wejsc na pole
                                    // okupowane przez swoj wlasny pionek
                                    //Tutaj następuje zbijanie pionka
                                    this.gameData.gameMap[
                                        newPosition
                                        // this.gameData.gameMap.indexOf(element) +
                                        //     this.gameData.diceThrowResult
                                    ] = element;
                                    this.gameData.gameMap[
                                        this.gameData.gameMap.indexOf(element)
                                    ] = 0;
                                    this.gameData.startingPositionArea.push(
                                        otherPawn,
                                    );
                                    return this._finishTurn()
                                }
                            } else {
                                this.gameData.gameMap[
                                    newPosition
                                    // this.gameData.gameMap.indexOf(element) +
                                        // this.gameData.diceThrowResult
                                ] = element;
                                this.gameData.gameMap[
                                    this.gameData.gameMap.indexOf(element)
                                ] = 0;
                                return this._finishTurn()
                            }
                        }
                    }
                }
            }
        } else if (currentPawn[1] === 1) {
            const currentPlayerMapStartPoint = this._getPlayerStartPoint(publicId)
            let isAreaClear = true;
            let pawnToLeaveStart = null;
            let pawnToGoBackToStart = null;
            for (const pawn of this.gameData.startingPositionArea) {
                if (pawn[0] === publicId && pawn[1] === data.pawnId) {
                    if (
                        this.gameData.gameMap[currentPlayerMapStartPoint] === 0
                    ) {
                        isAreaClear = true;
                        pawnToLeaveStart = pawn;
                    } else if (
                        this.gameData.gameMap[currentPlayerMapStartPoint][0] !=
                        publicId
                    ) {
                        isAreaClear = false;
                        pawnToLeaveStart = pawn;
                        pawnToGoBackToStart =
                            this.gameData.gameMap[currentPlayerMapStartPoint];
                    }
                }
            }
            if (isAreaClear === true) {
                //sprawdzamy czy pole jest puste
                this.gameData.startingPositionArea.splice(
                    this.gameData.startingPositionArea.indexOf(
                        pawnToLeaveStart,
                    ),
                    1,
                ); // usuwa/wyciaga pionka
                //z obszaru startowego
                this.gameData.gameMap[currentPlayerMapStartPoint] =
                    pawnToLeaveStart;
                this.gameData.currentAction = "Rzut kością";
                this.nextTurn();
                return this._dataWithPlayersTarget();
            } else {
                //sprawdzamy czy tam jest pionek inny niż pionek obecnego gracza,
                // ponieważ tylko na taki może tam wejść
                this.gameData.startingPositionArea.splice(
                    this.gameData.startingPositionArea.indexOf(
                        pawnToLeaveStart,
                    ),
                    1,
                ); // usuwa/wyciaga pionka
                //z obszaru startowego
                this.gameData.gameMap[currentPlayerMapStartPoint] =
                    pawnToLeaveStart;
                this.gameData.startingPositionArea.push(pawnToGoBackToStart); //zbijanie pionka
                this.gameData.currentAction = "Rzut kością";
                this.nextTurn();
                return this._dataWithPlayersTarget();
            }
        } else {
            let index = 0;
            for (const pawn of this.gameData.finishPositions[
                this.currentPlayerIndex
            ]) {
                if (
                    pawn[0] === currentPawn[0][0] &&
                    pawn[1] === currentPawn[0][1]
                ) {
                    //tutaj
                    if (
                        index + this.gameData.diceThrowResult <=
                        this.gameData.finishPositions[this.currentPlayerIndex]
                            .length -
                            1
                    ) {
                        const targetIndex =
                            index + this.gameData.diceThrowResult;
                        if (
                            this.gameData.finishPositions[
                                this.currentPlayerIndex
                            ][targetIndex][1] === 0
                        ) {
                            this.gameData.finishPositions[
                                this.currentPlayerIndex
                            ][targetIndex][1] = pawn[1];
                            this.gameData.finishPositions[
                                this.currentPlayerIndex
                            ][index][1] = 0;
                        }
                    }
                }
                index += 1;
            }
            let howManyFinished = 0;
            for (const pawn of this.gameData.finishPositions[
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
            this.gameData.currentAction = "Rzut kością";
            this.nextTurn();
            return this._dataWithPlayersTarget();
        }
    }
}
