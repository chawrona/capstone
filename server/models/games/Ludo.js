import Game from "../Game.js";

export default class Ludo extends Game {
    constructor(players, endGame) {
        super(players, endGame);
    }

    initializeGameData() {
        this.gameData.gameMap = Array.from({ length: 40 }, () => 0);
        this.gameData.startingPositionArea = this._setPawns("start");
        this.gameData.finishPositions = this._setPawns("finish");
        this.gameData.timesThrown = 0;
        this.gameData.diceThrowResult = 0;
        this.gameData.playersStartingPoints = this._setPlayersStartingPoints();
        this.gameData.anyPossibleMoves = false;
        this.gameData.currentAction = `Rzut kością`;
        this.gameData.isPaused = this.paused;
        this.gameData.actionMessage = `${this._getCurrentPlayerUsername()} rzuca kością.`;
    }

    _getCompactMap() {
        return Object.fromEntries(
            this.gameData.gameMap
                .map((value, index) => [index, value])
                .filter((item) => item[1] !== 0),
        );
    }

    _getCurrentPlayerUsername() {
        return this._currentPlayer().username;
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
                while (index !== 4) {
                    index++;
                    pawns.push([player.publicId, index]); // [[niebieski,1],
                    // [niebieski,2],...,[czerwony,1],...,[zolty,4]] - zamysl
                }
            }
            return pawns;
        } else {
            for (const [, player] of this.players) {
                pawns.push([[player.publicId, 99]]);
            }
            return pawns;
        }
    }

    _dataWithPlayersTarget() {
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
                isPaused: this.paused,
            },
        };
    }

    _gameEndWithTarget() {
        const gameEndStats = [];
        for (const pawns of this.gameData.finishPositions) {
            let howManyFinished = 0;
            for (const pawn of pawns) {
                if (pawn[1] !== 0) {
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
        if (data.publicId !== this.playersQueue[this.currentPlayerIndex]) {
            throw new Error("Poczekaj na swoją turę.");
        }
        if (this.gameData.currentAction !== "Rzut kością") {
            throw new Error("Nieprawidłowa akcja.");
        }

        this.log(
            "-------------------------ROLL DICE - START-----------------------------------",
        );
        this.printGameState();

        this.gameData.timesThrown += 1;
        if (this.gameData.timesThrown < 3) {
            const currentPlayer = this._currentPlayer();
            this.gameData.diceThrowResult = Math.floor(Math.random() * 6) + 1;
            const possibleMoves = this._possibleMoves();
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
                    this.gameData.actionMessage = `${this._getCurrentPlayerUsername()} rzuca kością.`;
                    this.printGameState();
                    this.log(
                        "-------------------------ROLL DICE - END -----------------------------------",
                    );

                    return this._dataWithPlayersTarget();
                } else {
                    this.gameData.currentAction = "Ruch pionka";
                    this.gameData.actionMessage = `${this._getCurrentPlayerUsername()} wybiera pionek.`;
                    this.printGameState();
                    this.log(
                        "-------------------------ROLL DICE - END -----------------------------------",
                    );
                    return this._dataWithPlayersTarget();
                }
            } else {
                // rzut od 2 do 5

                if (possibleMoves !== false) {
                    // w tych tabelach długość ponad 1 oznacza, że są możliwe ruchy do wykonania
                    this.gameData.currentAction = "Ruch pionka";
                    this.gameData.actionMessage = `${this._getCurrentPlayerUsername()} wybiera pionek.`;
                    this.gameData.timesThrown = 0;
                    this.printGameState();
                    this.log(
                        "-------------------------ROLL DICE - END -----------------------------------",
                    );
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
                    this.gameData.actionMessage = `${this._getCurrentPlayerUsername()} rzuca kością ponownie (${this.gameData.timesThrown}/3)`;
                    this.printGameState();
                    this.log(
                        "-------------------------ROLL DICE - END -----------------------------------",
                    );
                    return this._dataWithPlayersTarget();
                }

                if (possibleMoves === false) {
                    this.gameData.timesThrown = 0;
                    this.gameData.currentAction = "Rzut kością";
                    this.nextTurn();
                    this.gameData.actionMessage = `${this._getCurrentPlayerUsername()} rzuca kością.`;
                    this.printGameState();
                    this.log(
                        "-------------------------ROLL DICE - END -----------------------------------",
                    );
                    return this._dataWithPlayersTarget();
                }
            }
        } else {
            // jeżeli użytkownik próbuje rzucić kością 4 raz to tura przechodzi do innego gracza
            this.gameData.timesThrown = 0;
            this.gameData.currentAction = "Rzut kością";
            this.nextTurn();
            this.gameData.actionMessage = `Poprzedni gracz nie mógł wyjść z bazy. ${this._getCurrentPlayerUsername()} rzuca kością.`;
            this.printGameState();
            this.log(
                "-------------------------ROLL DICE - END -----------------------------------",
            );
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

                    //                     this.log(`
                    // Aktualna pozycja: ${currentPosition}
                    // Edge case dla 0: ${[39, 38, 37, 36, 35, 34].includes(currentPosition)}
                    // Nowa pozycja: ${newPosition}
                    // Starting Field: ${currentPlayerMapStartPoint}
                    //                         `);
                }

                if (lapDone) {
                    // this.log(
                    //     "OKRĄŻENIE SIĘ WYKONA. PIONEK POWINIEN WEJŚC NA FINISH",
                    // );
                    // @TO-DO sprawdzić czy napewno dobrze obliczamy finiszowe pozycje
                    let finishPosition =
                        newPosition - currentPlayerMapStartPoint + 1;

                    if (currentPlayerMapStartPoint === 0) {
                        finishPosition = (newPosition % 10) + 1;
                    }

                    if (finishPosition <= 4) {
                        for (const playerPawns of this.gameData
                            .finishPositions) {
                            if (playerPawns[0][0] === currentPlayerPublicId) {
                                let isPawnOnFinishPosition = false;
                                for (const finishPawn of playerPawns) {
                                    if (finishPawn[1] === finishPosition) {
                                        isPawnOnFinishPosition = true;
                                    }
                                }

                                if (!isPawnOnFinishPosition) {
                                    possibleMoves[0].push(this._copyPawn(pawn));
                                    // this.log(
                                    //     "Dodajemy pionek do possible moves, który może wejść na finish",
                                    // );
                                }
                            }
                        }
                    }
                } else {
                    // this.log(
                    //     "OKRĄŻENIE SIĘ NIE WYKONA, WIĘC PIONEK NORMALNIE RUSZA SIĘ PO MAPIE",
                    // );
                    const pawnOnNewPosition =
                        this.gameData.gameMap[newPosition];

                    // this.log("newPosition");
                    // this.log(newPosition);
                    // this.log("pawnOnNewPosition");
                    // this.log(JSON.stringify(pawnOnNewPosition));
                    if (
                        !pawnOnNewPosition ||
                        pawnOnNewPosition[0] !== currentPlayerPublicId
                    ) {
                        // this.log("Pionek może się ruszyć");
                        possibleMoves[0].push(this._copyPawn(pawn));
                    }
                }
            }
        });

        // Dodawanie pionków z finiszu
        if ([1, 2, 3].includes(rollResult)) {
            for (const playerPawns of this.gameData.finishPositions) {
                if (playerPawns[0][0] === currentPlayerPublicId) {
                    for (const finishPawn of playerPawns) {
                        const currentFinishPosition = finishPawn[1];
                        const newFinishPosition =
                            currentFinishPosition + rollResult;

                        if (newFinishPosition < 4) {
                            let isPawnOnFinishPosition = false;

                            for (const checkedFinishPawn of playerPawns) {
                                if (
                                    checkedFinishPawn[1] === newFinishPosition
                                ) {
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
        }

        console.log(possibleMoves);

        if (
            possibleMoves[0].length ||
            possibleMoves[1].length ||
            possibleMoves[2].length
        )
            return possibleMoves;

        return false;
    }

    _finishTurn(skip) {
        this.printGameState(true);
        this.log(
            "--------------------------END----------------------------------",
        );
        this.gameData.currentAction = "Rzut kością";
        this.gameData.actionMessage = `${this._getCurrentPlayerUsername()} ponownie rzuca kością.`;

        if (this.gameData.diceThrowResult !== 6 || skip) {
            this.nextTurn();
            this.gameData.actionMessage = `${this._getCurrentPlayerUsername()} rzuca kością.`;
        }

        return this._dataWithPlayersTarget();
    }

    _copyPawn(pawn) {
        return [pawn[0], pawn[1]];
    }

    _getPlayerStartPoint(publicId) {
        return this.players.get(publicId).getData("startingField");
    }

    printGameState(end) {
        this.log(
            JSON.stringify({
                mapa: this._getCompactMap(),
                startingPositionArea: this.gameData.startingPositionArea,
                finishPositions: this.gameData.finishPositions,
                diceThrowResult: this.gameData.diceThrowResult,
                action: this.gameData.currentAction,
                possibleMoves: end ? "end" : this._possibleMoves(),
            }),
        );
    }

    pawnMovement(data) {
        this.log(
            "-------------------------START-----------------------------------",
        );
        this.printGameState();
        const currentPlayerPublicId =
            this.playersQueue[this.currentPlayerIndex];

        if (data.publicId !== currentPlayerPublicId) {
            throw new Error("Poczekaj na swoją turę.");
        }

        if (this.gameData.currentAction !== "Ruch pionka") {
            throw new Error("Nieprawidłowa akcja.");
        }

        const currentPlayerMapStartPoint = this._getPlayerStartPoint(
            currentPlayerPublicId,
        );
        let currentPawnPosition = ["map", "starting", "finish"];
        let currentPawn = null;

        this._possibleMoves().forEach((pawns, index) => {
            for (const pawn of pawns) {
                if (pawn[1] === data.pawnId) {
                    currentPawn = this._copyPawn(pawn);
                    currentPawnPosition = currentPawnPosition[index];
                }
            }
        });

        if (!currentPawn) {
            throw new Error("Nie możesz się ruszyć tym pionkiem");
        }

        // this.log("Możliwe ruchy w momencie ruchu pionka:");
        // this.log(JSON.stringify(this._possibleMoves()));
        // this.log("Id pionka, którym gracz chce się ruszyć");
        // this.log(`${data.pawnId}`);

        // this.log(
        //     "Pionek, którym gracz chce się ruszyć znajduje się na polu: " +
        //         currentPawnPosition,
        // );
        if (currentPawnPosition === "starting") {
            const pawnOnStartingField =
                this.gameData.gameMap[currentPlayerMapStartPoint];
            // gdy puste pole na pozycji startowej
            // this.log("Wybrałeś pionek do ruszenia się znajdujący się w bazie.");
            if (!pawnOnStartingField) {
                // this.log("Na polu startowym nie było żadnego pionka");
                this.gameData.gameMap[currentPlayerMapStartPoint] =
                    this._copyPawn(currentPawn);
                this.gameData.startingPositionArea =
                    this.gameData.startingPositionArea.filter((pawn) => {
                        return !(
                            pawn[0] === currentPawn[0] &&
                            pawn[1] === currentPawn[1]
                        );
                    });
                // this.log("Wszedłeś pionkiem na pole startowe");

                return this._finishTurn(true);
            }
            // gdy pionek znajduje sie na pozycji startowej
            else {
                // this.log("Znajduje się już pionek na polu startowym");
                if (pawnOnStartingField[0] === currentPlayerPublicId) {
                    throw new Error("Na tym polu znajduje się już Twój pionek");
                }
                this.log("Zbijasz czyjś pionek na swoim polu startowym");
                this.gameData.startingPositionArea.push(
                    this._copyPawn(pawnOnStartingField),
                );
                this.gameData.gameMap[currentPlayerMapStartPoint] =
                    this._copyPawn(currentPawn);

                this.gameData.startingPositionArea =
                    this.gameData.startingPositionArea.filter((pawn) => {
                        return (
                            pawn[0] !== currentPawn[0] ||
                            pawn[1] !== currentPawn[1]
                        );
                    });

                const returnedTarget = this._finishTurn(true);
                return returnedTarget;
            }
        } else if (currentPawnPosition === "map") {
            const currentPosition = this.gameData.gameMap.findIndex((pawn) => {
                return pawn[0] === currentPawn[0] && pawn[1] === currentPawn[1];
            });

            // this.log(`Aktualna pozycja pionka: ${currentPosition}`);

            let newPosition = this.gameData.diceThrowResult + currentPosition;
            // this.log(`Nowa pozycja pionka: ${newPosition}`);
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
            // this.log("Sprawdzanie okrążenia");

            if (lapDone) {
                // this.log("Okrążenie się wykonało");
                // @TO-DO sprawdzić czy napewno dobrze obliczamy finiszowe pozycje
                let finishPosition =
                    newPosition - currentPlayerMapStartPoint + 1;

                if (currentPlayerMapStartPoint === 0) {
                    finishPosition = (newPosition % 10) + 1;

                    // this.log("Finiszowa pozycja");
                    // this.log(finishPosition);
                }

                for (const playerPawns of this.gameData.finishPositions) {
                    if (playerPawns[0][0] === currentPlayerPublicId) {
                        let isPawnOnFinishPosition = false;
                        for (const finishPawn of playerPawns) {
                            if (finishPawn[1] === finishPosition) {
                                isPawnOnFinishPosition = true;
                            }
                        }

                        if (isPawnOnFinishPosition) {
                            throw new Error(
                                "Na tym polu końcowym znajduje się już Twój pionek",
                            );
                        }

                        // wrzuć currentPawn na finishPosition
                        for (const playerPawns of this.gameData
                            .finishPositions) {
                            if (playerPawns[0][0] === currentPlayerPublicId) {
                                playerPawns.push([
                                    currentPawn[0],
                                    finishPosition,
                                ]);
                                break;
                            }
                        }
                        this.gameData.gameMap[currentPosition] = 0;

                        return this._finishTurn();
                    }
                }
                // Tutaj będzie ruszanie się pionkiem po mapie normalnie
            } else {
                newPosition = newPosition % 40;
                const pawnOnNewPosition = this.gameData.gameMap[newPosition];
                // this.log(
                //     JSON.stringify({
                //         "PIONEK NA NOWYM POLU":
                //             this.gameData.gameMap[newPosition],
                //     }),
                // );

                if (!pawnOnNewPosition) {
                    this.gameData.gameMap[newPosition] =
                        this._copyPawn(currentPawn);
                    this.gameData.gameMap[currentPosition] = 0;
                    const returnedTarget = this._finishTurn();
                    return returnedTarget;
                } else if (pawnOnNewPosition[0] !== currentPlayerPublicId) {
                    this.log("Zbijasz czyjś pionek");
                    this.gameData.startingPositionArea.push(
                        this._copyPawn(pawnOnNewPosition),
                    );
                    this.gameData.gameMap[newPosition] =
                        this._copyPawn(currentPawn);

                    this.gameData.gameMap[currentPosition] = 0;
                    return this._finishTurn();
                } else {
                    throw new Error("Na tym polu znajduje się już Twój pionek");
                }
            }
            // this.log("Koniec sprawdzania okrążenia");
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
                            return this._finishTurn();
                        }
                    }
                }
            }
        } else if (currentPawnPosition === "finish") {
            throw new Error("Pionek musiałby wyjść poza mapę. Spokojnie");
        }
    }
}
