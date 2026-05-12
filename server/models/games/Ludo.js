import Game from "../Game.js";

export default class Ludo extends Game {
    constructor(players, endGame) {
        super(players, endGame);
    }

    initializeGameData() {
        // --- WEWNĘTRZNE ŹRÓDŁO PRAWDY (NOWY SILNIK) ---
        // Słownik graczy: -1 (baza), 0-39 (mapa), 40-43 (meta)
        this.internalPawns = {};
        for (const pId of this.playersQueue) {
            this.internalPawns[pId] = { 1: -1, 2: -1, 3: -1, 4: -1 };
        }

        // --- ZMIENNE STANU DLA FRONTENDU (STARY KONTRAKT) ---
        this.gameData = {};
        this.gameData.timesThrown = 0;
        this.gameData.diceThrowResult = 0;
        this.gameData.playersStartingPoints = this._setPlayersStartingPoints();
        this.gameData.anyPossibleMoves = false;
        this.gameData.currentAction = `Rzut kością`;
        this.gameData.isPaused = this.paused;
        this.gameData.actionMessage = `${this._getCurrentPlayerUsername()} rzuca kością.`;

        this._syncFrontendState();
    }

    // ==========================================
    // METODY WYMAGANE PRZEZ SERWER/FRONTEND
    // ==========================================

    gameDataRequest(data) {
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
        const players = [];
        for (const [, player] of this.players) {
            players.push(player);
        }
        return players
            .sort((a, b) => a.getData("turnOrder") - b.getData("turnOrder"))
            .map((player) => player.getPlayerData());
    }

    setGameMap(data) {
        this.gameData.gameMap = JSON.parse(data.map);
        this._loadStateFromOldFormat(
            this.gameData.gameMap,
            this.gameData.finishPositions || [],
        );
        return this._dataWithPlayersTarget();
    }

    setFinished(data) {
        this.gameData.finishPositions = JSON.parse(data.finished);
        this._loadStateFromOldFormat(
            this.gameData.gameMap || Array.from({ length: 40 }, () => 0),
            this.gameData.finishPositions,
        );
        return this._dataWithPlayersTarget();
    }

    // ==========================================
    // PRZYWRACANIE STANU Z BAZY DANYCH
    // ==========================================

    _loadStateFromOldFormat(gameMap, finishPositions) {
        // Resetujemy wewnętrzny stan
        for (const pId of this.playersQueue) {
            this.internalPawns[pId] = { 1: -1, 2: -1, 3: -1, 4: -1 };
        }

        // Wczytywanie z mapy
        gameMap.forEach((pawn, mapIdx) => {
            if (Array.isArray(pawn)) {
                const pId = pawn[0];
                const pawnId = pawn[1];
                const startPoint = this._getPlayerStartPoint(pId);
                const dist = (mapIdx - startPoint + 40) % 40;
                if (this.internalPawns[pId]) {
                    this.internalPawns[pId][pawnId] = dist;
                }
            }
        });

        // Wczytywanie z mety
        for (const playerPawns of finishPositions) {
            if (playerPawns && playerPawns.length > 0) {
                const pId = playerPawns[0][0];

                // Szukamy, które ID pionków są wolne
                const usedPawnIds = new Set();
                if (this.internalPawns[pId]) {
                    for (const [idStr, dist] of Object.entries(
                        this.internalPawns[pId],
                    )) {
                        if (dist !== -1) usedPawnIds.add(parseInt(idStr));
                    }
                }

                for (let i = 1; i < playerPawns.length; i++) {
                    const finishPos = playerPawns[i][1];
                    const dist = 39 + finishPos;

                    let freePawnId = null;
                    for (let pid = 1; pid <= 4; pid++) {
                        if (!usedPawnIds.has(pid)) {
                            freePawnId = pid;
                            usedPawnIds.add(pid);
                            break;
                        }
                    }

                    if (freePawnId !== null && this.internalPawns[pId]) {
                        this.internalPawns[pId][freePawnId] = dist;
                    }
                }
            }
        }
        this._syncFrontendState();
    }

    // ==========================================
    // METODY POMOCNICZE WYSYŁAJĄCE DANE
    // ==========================================

    _dataWithPlayersTarget() {
        const targets = [];
        const possiblePawnMoves = this._possibleMoves();
        for (const [pId] of this.players) {
            targets.push({
                target: pId,
                eventName: "gameData",
                data: {
                    ...this.gameData,
                    yourTurn:
                        pId === this.playersQueue[this.currentPlayerIndex],
                    currentPlayerIndex: this.currentPlayerIndex,
                    possiblePawnMoves: possiblePawnMoves,
                    yourPublicId: pId,
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
            let howManyFinished = pawns.length - 1;
            gameEndStats.push([pawns[0][0], howManyFinished]);
        }
        gameEndStats.sort((a, b) => b[1] - a[1]);

        const targets = [];
        for (const [, player] of this.players) {
            targets.push({
                target: player.publicId,
                eventName: "gameEnd",
                data: { ...gameEndStats },
            });
        }
        return targets;
    }

    // ==========================================
    // LOGIKA GENEROWANIA STANU
    // ==========================================

    _setPlayersStartingPoints() {
        const playersStartingPoints = [];
        let mapStartPoint = 0;
        for (const pId of this.playersQueue) {
            if (this.playersQueue.length == 2) {
                mapStartPoint = this.playersQueue.indexOf(pId) * 20;
            } else {
                mapStartPoint = this.playersQueue.indexOf(pId) * 10;
            }
            playersStartingPoints.push([pId, mapStartPoint]);
            this.players.get(pId).setData("startingField", () => mapStartPoint);
        }
        return playersStartingPoints;
    }

    _getPlayerStartPoint(publicId) {
        const field = this.players.get(publicId).getData("startingField");
        return typeof field === "function" ? field() : field;
    }

    _getMapIndex(publicId, distance) {
        if (distance < 0 || distance > 39) return null;
        const startPoint = this._getPlayerStartPoint(publicId);
        return (startPoint + distance) % 40;
    }

    _getCurrentPlayerUsername() {
        return this._currentPlayer().username;
    }

    _currentPlayer() {
        return this.players.get(this.playersQueue[this.currentPlayerIndex]);
    }

    _syncFrontendState() {
        const gameMap = Array.from({ length: 40 }, () => 0);
        const startingPositionArea = [];
        const finishMap = new Map();

        // Używamy playersQueue, aby mieć gwarancję poprawnego typu danych klucza
        for (const pId of this.playersQueue) {
            finishMap.set(pId, [[pId, 99]]);
        }

        // Iterujemy po playersQueue zamiast po kluczach obiektu,
        // aby uniknąć problemu z parsowaniem String -> Int
        for (const publicId of this.playersQueue) {
            const pawns = this.internalPawns[publicId];
            if (!pawns) continue;

            for (const [pawnIdStr, dist] of Object.entries(pawns)) {
                const pawnId = parseInt(pawnIdStr); // ID pionków zawsze są od 1 do 4

                if (dist === -1) {
                    startingPositionArea.push([publicId, pawnId]);
                } else if (dist >= 0 && dist <= 39) {
                    const mapIdx = this._getMapIndex(publicId, dist);
                    gameMap[mapIdx] = [publicId, pawnId];
                } else if (dist >= 40) {
                    const finishPos = dist - 39;
                    finishMap.get(publicId).push([publicId, finishPos]);
                }
            }
        }

        this.gameData.gameMap = gameMap;
        this.gameData.startingPositionArea = startingPositionArea;
        this.gameData.finishPositions = Array.from(finishMap.values());
    }

    // ==========================================
    // METODY DEBUGUJĄCE ZE STAREGO PLIKU
    // ==========================================

    _getCompactMap() {
        return Object.fromEntries(
            this.gameData.gameMap
                .map((value, index) => [index, value])
                .filter((item) => item[1] !== 0),
        );
    }

    printGameState(end) {
        if (typeof this.log === "function") {
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
    }

    // ==========================================
    // GŁÓWNA LOGIKA GRY
    // ==========================================

    rollDice(data) {
        if (data.publicId !== this.playersQueue[this.currentPlayerIndex]) {
            throw new Error("Poczekaj na swoją turę.");
        }
        if (this.gameData.currentAction !== "Rzut kością") {
            throw new Error("Nieprawidłowa akcja.");
        }

        if (typeof this.log === "function") {
            this.log(
                "-------------------------ROLL DICE - START-----------------------------------",
            );
            this.printGameState();
        }

        this.gameData.timesThrown += 1;
        const currentPlayer = this._currentPlayer();

        let pawnsInStartingArea = 0;
        for (const d of Object.values(
            this.internalPawns[currentPlayer.publicId],
        )) {
            if (d === -1) pawnsInStartingArea++;
        }

        if (this.gameData.timesThrown < 3) {
            this.gameData.diceThrowResult = Math.floor(Math.random() * 6) + 1;
            const possibleMoves = this._possibleMoves();

            if (
                this.gameData.diceThrowResult === 6 ||
                this.gameData.diceThrowResult === 1
            ) {
                this.gameData.timesThrown = 0;
                if (!possibleMoves) {
                    this.gameData.currentAction = "Rzut kością";
                    this.nextTurn();
                    this.gameData.actionMessage = `${this._getCurrentPlayerUsername()} rzuca kością.`;
                } else {
                    this.gameData.currentAction = "Ruch pionka";
                    this.gameData.actionMessage = `${this._getCurrentPlayerUsername()} wybiera pionek.`;
                }
            } else {
                if (possibleMoves) {
                    this.gameData.currentAction = "Ruch pionka";
                    this.gameData.actionMessage = `${this._getCurrentPlayerUsername()} wybiera pionek.`;
                    this.gameData.timesThrown = 0;
                } else {
                    if (pawnsInStartingArea === 4) {
                        this.gameData.currentAction = "Rzut kością";
                        this.gameData.actionMessage = `${this._getCurrentPlayerUsername()} rzuca kością ponownie (${this.gameData.timesThrown}/3)`;
                    } else {
                        this.gameData.timesThrown = 0;
                        this.gameData.currentAction = "Rzut kością";
                        this.nextTurn();
                        this.gameData.actionMessage = `${this._getCurrentPlayerUsername()} rzuca kością.`;
                    }
                }
            }
        } else {
            this.gameData.timesThrown = 0;
            this.gameData.currentAction = "Rzut kością";
            this.nextTurn();
            this.gameData.actionMessage = `Poprzedni gracz nie mógł wyjść z bazy. ${this._getCurrentPlayerUsername()} rzuca kością.`;
        }

        if (typeof this.log === "function") {
            this.printGameState();
            this.log(
                "-------------------------ROLL DICE - END -----------------------------------",
            );
        }

        return this._dataWithPlayersTarget();
    }

    _possibleMoves() {
        this.gameData.anyPossibleMoves = false;
        const pId = this.playersQueue[this.currentPlayerIndex];
        const roll = this.gameData.diceThrowResult;
        const pawns = this.internalPawns[pId];
        const possible = [[], [], []];

        const myOccupiedMap = new Set();
        const myOccupiedFinish = new Set();
        for (const d of Object.values(pawns)) {
            if (d >= 0 && d <= 39) myOccupiedMap.add(this._getMapIndex(pId, d));
            if (d >= 40) myOccupiedFinish.add(d);
        }

        for (const [idStr, dist] of Object.entries(pawns)) {
            const pawnId = parseInt(idStr);

            if (dist === -1 && (roll === 1 || roll === 6)) {
                if (!myOccupiedMap.has(this._getMapIndex(pId, 0))) {
                    possible[1].push([pId, pawnId]);
                }
            } else if (dist >= 0 && dist <= 39) {
                const nDist = dist + roll;
                if (nDist <= 39) {
                    if (!myOccupiedMap.has(this._getMapIndex(pId, nDist))) {
                        possible[0].push([pId, pawnId]);
                    }
                } else if (nDist >= 40 && nDist <= 43) {
                    if (!myOccupiedFinish.has(nDist)) {
                        possible[0].push([pId, pawnId]);
                    }
                }
            } else if (dist >= 40 && dist <= 42) {
                const nDist = dist + roll;
                if (nDist <= 43 && !myOccupiedFinish.has(nDist)) {
                    const finishPos = dist - 39;
                    possible[2].push([pId, finishPos]);
                }
            }
        }

        const hasMoves = possible.some((c) => c.length > 0);
        return hasMoves ? possible : false;
    }

    pawnMovement(data) {
        if (typeof this.log === "function") {
            this.log(
                "-------------------------START-----------------------------------",
            );
            this.printGameState();
        }

        const currentPlayerId = this.playersQueue[this.currentPlayerIndex];
        if (data.publicId !== currentPlayerId)
            throw new Error("Poczekaj na swoją turę.");
        if (this.gameData.currentAction !== "Ruch pionka")
            throw new Error("Nieprawidłowa akcja.");

        const roll = this.gameData.diceThrowResult;
        const moves = this._possibleMoves(); // Tutaj mamy kompletną listę co wolno kliknąć
        if (!moves) throw new Error("Brak możliwych ruchów.");

        let internalPawnIdToMove = null;

        // 1. Sprawdzamy ruchy z mapy/bazy (moves[0] i [1])
        // Tutaj data.pawnId to bezpośrednio ID pionka (1-4)
        const baseMapMove = [...moves[0], ...moves[1]].find(
            (p) => p[1] === data.pawnId,
        );

        // 2. Sprawdzamy ruchy na finiszu (moves[2])
        // Tutaj data.pawnId to numer pola (1-4) przysłany z frontu
        const finishMove = moves[2].find((p) => p[1] === data.pawnId);

        if (baseMapMove) {
            internalPawnIdToMove = data.pawnId;
        } else if (finishMove) {
            // Jeśli to ruch na finiszu, musimy znaleźć KLUCZ pionka (1-4),
            // który aktualnie stoi na tym polu (dist = 39 + numer pola)
            const currentFieldOnFinish = 39 + data.pawnId;
            const pawns = this.internalPawns[currentPlayerId];

            for (const [pIdKey, dist] of Object.entries(pawns)) {
                if (dist === currentFieldOnFinish) {
                    internalPawnIdToMove = parseInt(pIdKey);
                    break;
                }
            }
        }

        // Jeśli po przeszukaniu obu kategorii nadal nie mamy ID, rzucamy błąd
        if (internalPawnIdToMove === null) {
            throw new Error(
                "Nie możesz się ruszyć tym pionkiem - nie znaleziono dopasowania.",
            );
        }

        const currentDist =
            this.internalPawns[currentPlayerId][internalPawnIdToMove];
        let isStartMove = currentDist === -1;
        let newDist = isStartMove ? 0 : currentDist + roll;

        // Mechanika bicia (tylko na mapie głównej 0-39)
        if (newDist >= 0 && newDist <= 39) {
            const targetIdx = this._getMapIndex(currentPlayerId, newDist);
            for (const opponentId of this.playersQueue) {
                if (opponentId === currentPlayerId) continue;

                const opponentPawns = this.internalPawns[opponentId];
                for (const [pIdKey, dist] of Object.entries(opponentPawns)) {
                    if (
                        dist >= 0 &&
                        dist <= 39 &&
                        this._getMapIndex(opponentId, dist) === targetIdx
                    ) {
                        this.internalPawns[opponentId][pIdKey] = -1;
                    }
                }
            }
        }

        // Aktualizacja stanu
        this.internalPawns[currentPlayerId][internalPawnIdToMove] = newDist;
        this._syncFrontendState();

        return this._finishTurn(isStartMove);
    }
    _finishTurn(skip) {
        if (this._checkWin()) {
            this.endGame(this._currentPlayer());
            return this._gameEndWithTarget();
        }

        this.gameData.currentAction = "Rzut kością";
        this.gameData.actionMessage = `${this._getCurrentPlayerUsername()} ponownie rzuca kością.`;

        if (this.gameData.diceThrowResult !== 6 || skip) {
            this.nextTurn();
            this.gameData.actionMessage = `${this._getCurrentPlayerUsername()} rzuca kością.`;
        }

        if (typeof this.log === "function") {
            this.printGameState(true);
            this.log(
                "--------------------------END----------------------------------",
            );
        }

        return this._dataWithPlayersTarget();
    }

    _checkWin() {
        return Object.values(
            this.internalPawns[this.playersQueue[this.currentPlayerIndex]],
        ).every((dist) => dist >= 40);
    }
}
