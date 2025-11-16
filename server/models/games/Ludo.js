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
            if (!element) {
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
                if (possibleMoves != false) {
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
        const currentPlayerPublicId =
            this.playersQueue[this.currentPlayerIndex];
        this.gameData.anyPossibleMoves = false;
        let possibleMoves = [
            [], // "PionkiNaPlanszy"
            [], // "PionkiNaStarcie"
            [], // "PionkiNaFinishu"
        ];
        const currentPlayerMapStartPoint = this._getPlayerStartPoint(
            currentPlayerPublicId,
        );
        const rollResult = this.gameData.diceThrowResult;
        const pawnOnStartingField =
            this.gameData.gameMap[currentPlayerMapStartPoint];

        // Dodawanie pionków z bazy
        const thrownOneOrSix = rollResult === 6 || rollResult === 1;
        const isStartingFieldClear = !pawnOnStartingField;
        const isOurPawnOnStartingField =
            pawnOnStartingField[0] === currentPlayerPublicId;
        if (
            thrownOneOrSix &&
            (isStartingFieldClear || !isOurPawnOnStartingField)
        ) {
            for (const [publicId, pawnId] of this.gameData
                .startingPositionArea) {
                if (publicId === currentPlayerPublicId) {
                    possibleMoves[1].push([publicId, pawnId]);
                }
            }
        }

        // Dodawanie pionków z mapy
        this.gameData.gameMap.forEach((pawn, currentPosition) => {
            if (!Number.isInteger(pawn) && pawn[0] === currentPlayerPublicId) {
                const newPosition =
                    this.gameData.diceThrowResult + currentPosition;
                let lapDone =
                    currentPosition < currentPlayerMapStartPoint &&
                    newPosition >= currentPlayerMapStartPoint;
                // specjalny warunek dla startingPoint równe 0
                if (currentPlayerMapStartPoint === 0) {
                    lapDone =
                        [39, 38, 37, 36, 35, 34].includes(currentPosition) &&
                        newPosition >= currentPlayerMapStartPoint;
                }

                if (lapDone) {
                    // @TO-DO sprawdzić czy napewno dobrze obliczamy finiszowe pozycje
                    const finishPosition =
                        newPosition - currentPlayerMapStartPoint;
                    for (const playerPawns of this.gameData.finishPositions) {
                        if (playerPawns[0][0] === currentPlayerPublicId) {
                            let isPawnOnFinishPosition = false;
                            for (const finishPawn of playerPawns) {
                                if (finishPawn[1] === finishPosition) {
                                    isPawnOnFinishPosition = true;
                                }
                            }
                            if (!isPawnOnFinishPosition) {
                                possibleMoves[0].push(pawn);
                            }
                        }
                    }
                } else {
                    const pawnOnNewPosition =
                        this.gameData.gameMap[newPosition];
                    if (
                        !pawnOnNewPosition ||
                        pawnOnNewPosition[0] !== currentPlayerPublicId
                    ) {
                        possibleMoves[0].push(pawn);
                    }
                }
            }
        });

        // Dodawanie pionków z finiszu
        if (![1, 2, 3].includes(rollResult)) return possibleMoves;

        for (const playerPawns of this.gameData.finishPositions) {
            if (playerPawns[0][0] === currentPlayerPublicId) {
                for (const finishPawn of playerPawns) {
                    const currentFinishPosition = finishPawn[1];
                    const newFinishPosition =
                        currentFinishPosition + rollResult;

                    if (newFinishPosition < 4) {
                        let isPawnOnFinishPosition = false;

                        for (const checkedFinishPawn of playerPawns) {
                            if (checkedFinishPawn[1] === newFinishPosition) {
                                isPawnOnFinishPosition = true;
                            }
                        }

                        if (!isPawnOnFinishPosition) {
                            possibleMoves[2].push(finishPawn);
                        }
                    }
                }
            }
        }

        if (
            possibleMoves[0].length ||
            possibleMoves[1].length ||
            possibleMoves[2].length
        )
            return possibleMoves;

        return false;
    }

    _finishTurn() {
        this.gameData.currentAction = "Rzut kością";
        this.nextTurn();
        return this._dataWithPlayersTarget();
    }

    _getPlayerStartPoint(publicId) {
        return this.players.get(publicId).getData("startingField");
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
        const currentPlayerPublicId =
            this.playersQueue[this.currentPlayerIndex];
        if (data.publicId != currentPlayerPublicId) {
            throw new Error("Poczekaj na swoją turę.");
        }
        if (this.gameData.currentAction != "Ruch pionka") {
            throw new Error("Nieprawidłowa akcja.");
        }
        const currentPlayerMapStartPoint = this._getPlayerStartPoint(
            currentPlayerPublicId,
        );
        let currentPawnPosition = ["map", "starting", "finish"];
        let currentPawn = null;
        this.possibleMoves().forEach((pawns, index) => {
            for (const pawn of pawns) {
                if (pawn[1] === data.pawnId) {
                    currentPawn = pawn;
                    currentPawnPosition = currentPawnPosition[index];
                }
            }
        });

        if (currentPawnPosition === "starting") {
            const pawnOnStartingField =
                this.gameData.gameMap[currentPlayerMapStartPoint];
            // gdy puste pole na pozycji startowej
            if (!pawnOnStartingField) {
                this.gameData.gameMap[currentPlayerMapStartPoint] = currentPawn;
                this.gameData.startingPositionArea =
                    this.gameData.startingPositionArea.filter((pawn) => {
                        return !(
                            pawn[0] === currentPawn[0] &&
                            pawn[1] === currentPawn[1]
                        );
                    });
                this._finishTurn();
            }
            // gdy pionek znajduje sie na pozycji startowej
            else {
                if (pawnOnStartingField[0] === currentPlayerPublicId) {
                    throw new Error("Na tym polu znajduje się już Twój pionek");
                }
                this.gameData.startingPositionArea.push(pawnOnStartingField);
                this.gameData.gameMap[currentPlayerMapStartPoint] = currentPawn;
                this._finishTurn();
            }
        } else if (currentPawnPosition === "map") {
            const currentPosition = this.gameData.gameMap.findIndex((pawn) => {
                return pawn[0] === currentPawn[0] && pawn[1] === currentPawn[1];
            });
            const newPosition = this.gameData.diceThrowResult + currentPosition;
            let lapDone =
                currentPosition < currentPlayerMapStartPoint &&
                newPosition >= currentPlayerMapStartPoint;
            // specjalny warunek dla startingPoint równe 0
            if (currentPlayerMapStartPoint === 0) {
                lapDone =
                    [39, 38, 37, 36, 35, 34].includes(currentPosition) &&
                    newPosition >= currentPlayerMapStartPoint;
            }
            // Ruszanie się pionkiem w momencie gdy idziesz na finisz
            if (lapDone) {
                // @TO-DO sprawdzić czy napewno dobrze obliczamy finiszowe pozycje
                const finishPosition = newPosition - currentPlayerMapStartPoint;
                for (const playerPawns of this.gameData.finishPositions) {
                    if (playerPawns[0][0] === currentPlayerPublicId) {
                        let isPawnOnFinishPosition = false;
                        for (const finishPawn of playerPawns) {
                            if (finishPawn[1] === finishPosition) {
                                isPawnOnFinishPosition = true;
                            }
                        }
                        if (!isPawnOnFinishPosition) {
                            // wrzuć currentPawn na finishPosition
                            for (const playerPawns of this.gameData
                                .finishPositions) {
                                if (
                                    playerPawns[0][0] === currentPlayerPublicId
                                ) {
                                    playerPawns.push(currentPawn);
                                    break;
                                }
                            }
                            this.gameData.gameMap[currentPosition] = 0;
                            this._finishTurn();
                        } else {
                            throw new Error(
                                "Na tym polu końcowym znajduje się już Twój pionek",
                            );
                        }
                    }
                }
                // Tutaj będzie ruszanie się pionkiem po mapie normalnie
            } else {
                const pawnOnNewPosition = this.gameData.gameMap[newPosition];
                if (!pawnOnNewPosition) {
                    this.gameData.gameMap[newPosition] = currentPawn;
                    this.gameData.gameMap[currentPosition] = 0;
                    this._finishTurn();
                } else if (pawnOnNewPosition[0] !== currentPlayerPublicId) {
                    this.gameData.startingPositionArea.push(pawnOnNewPosition);
                    this.gameData.gameMap[currentPlayerMapStartPoint] =
                        currentPawn;
                    this._finishTurn();
                } else {
                    throw new Error("Na tym polu znajduje się już Twój pionek");
                }
            }
        } else if (
            currentPawnPosition === "finish" &&
            ![1, 2, 3].includes(this.gameData.diceThrowResult)
        ) {
            for (const playerPawns of this.gameData.finishPositions) {
                if (playerPawns[0][0] === currentPlayerPublicId) {
                    const newFinishPosition =
                        currentPawn[1] + this.gameData.diceThrowResult;
                    for (const pawn of playerPawns) {
                        if (pawn[1] === newFinishPosition) {
                            throw new Error(
                                "Na tym polu końcowym znajduje się już Twój pionek",
                            );
                        }
                    }
                    for (const pawn of playerPawns) {
                        if (pawn[1] === currentPawn[1]) {
                            pawn[1] = newFinishPosition;
                            this._finishTurn();
                        }
                    }
                }
            }
        }
    }
}
