import InvalidActionError from "../../errors/InvalidActionError.js";
import Game from "../Game.js";

export default class Ludo extends Game {
    constructor(players, endGame) {
        super(players, endGame);
    }

    // na poczatku game data daje obiekt
    // przed nazwą funkcji _

    // dane publiczne to this.gameData

    initializeGameData() {
        this.gameData.gameMap = Array.from({ length: 40 }, () => []); // [0,1,2,3,[pIdNiebieskiego,1],5,6,7]
        this.gameData.currentPlayerIndex = this.currentPlayerIndex;
        // this.gameData.turn = playersQueue[0] //czy mogę tak
        // wziąść players queueue z klasy game? mam nadzieje ze tak
        this.gameData.currentAction = "Rzut kością";
        this.gameData.startingPositionArea = this._setPawns("start");
        this.gameData.finishPositions = this._setPawns("finish");
        this.gameData.timesThrown = 1;
        this.gameData.diceThrowResult = 0;
        this.gameData.playersStartingPoints = _setPlayersStartingPoints();
        //     gameDataRequest(data) {  ------- gameDataRequest odsyla this.data (to jest
        // nasze gameData). To oznacza, ze my po aktualizacji naszej daty w Ludo.js odrazu
        // mamy gotową datę którą wyśle gameDataRequest na prośbę klienta albo wyślemy to
        // manualnie w metodach

        //          return [this.dataWithPlayerTarget(data.publicId)];
        //     }
    }
    
    _setPlayersStartingPoints(){
        const playersStartingPoints = [];
        const mapStartPoint = 0;
        for (const pId of this.playersQueue) {
            //ustawiamy punkt startowy na który trafiają pionki gracza, gracz pierwszy w kolejce ma indeks tablicy 0 tak więc startuje na polu 0, drugi ma indeks 1 więc 10 itd.
            if (pId == currentPlayer.publicId) {
                mapStartPoint = playersQueue.indexOf(pId) * 10;
                playersStartingPoints.push(pId, mapStartPoint)
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
        if (startOrFinish == "start") {
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
            for (const [, player] of this.players) {
                tempPawns.push([player.publicId, index]); // [[niebieski,0],
                // [niebieski,0],...,[czerwony,0],...,[zolty,0]]
            }
            for (let i = 0; i < index; i++) {
                pawns.push([]);
                for (let j = 0; j < index; j++) {
                    pawns[i].push(tempPawns[0]);
                    tempPawns.shift();
                }
            }
            return pawns;
        }
    }

    _dataWithPlayersTarget() {
        const targets = [];
        const possiblePawnMoves = _possibleMoves(this.playersQueue[this.currentPlayerIndex])
        for (const player of this.players) {
            targets.push({
                target: player.publicId,
                eventName: "gameData",
                data: {
                    ...this.gameData,
                    yourTurn:
                        player.publicId ===
                        this.playersQueue[currentPlayerIndex],
                    possiblePawnMoves // pamiętać żeby zerować
                },
            });
        }
        return targets;
    }

    _currentPlayer() {
        const currentPlayer = {};
        for (const [, player] of this.players) {
            //ustawiamy sobie obecnego gracza na podstawie porównania
            // id gracza obecnej tury do gracza z tablicy graczy
            if (player.publicId == this.playersQueue[currentPlayerIndex]) {
                currentPlayer = player.getPlayerData();
            }
        }
        return currentPlayer;
    }

    // osobna funkcja dająca info o tym które pionki są dostępne do ruchu

    throwTheDice(timesThrown, data) {
        //zastanowic sie nad sprawdzaniem czy to tura gracza żeby zablokować; rozbić to na ruch gracza; jezeli ktos wybierze nielegalna akcje to error a nie na sztywno ustawianie co moze co nie moze
        if (data.publicId != this.playersQueue[currentPlayerIndex]) {
            throw new Error("Poczekaj na swoją turę.");
        }
        if (this.gameData.currentAction != "Rzut kością") {
            throw new Error("Nieprawidłowa akcja.");
        }
        //bardzo wishfull myślenie, bo wiem ze to co robi wysyla w data a nie gameData, ale zakladam, ze gdy uzytkownik kliknie pionka wysle sie nam gameData.currentAction == "Ruch pionka", jezeli nie to do poprawki
        if (this.gameData.timesThrown < 4) {
            // Sprawdzamy ile razy jeden gracz rzucil koscia zeby mogl rzucic maksymalnie 3 razy (na start gry, czy jest start gry sprawdzamy w kodzie)
            const currentPlayer = this.currentPlayer();

            this.gameData.diceThrowResult = Math.floor(Math.random() * 6) + 1;

            if (this.gameData.diceThrowResult == 6 || this.gameData.diceThrowResult == 1) {
                this.gameData.currentAction = "Ruch pionka";
                this.gameData.timesThrown = 1; // reset ile razy wyrzucono kosci
                return _dataWithPlayersTarget();
            } else {
                // rzut od 2 do 5
                for (const element of this.gameMap) {
                    //sprawdzamy czy jest jakiś pionek na mapie za pomocą porównania pierwszego indeksu tablicy pionka (pId) z publicznym Id gracza
                    if (!element.isInteger()) {
                        if (element[0] == currentPlayer.publicId) {
                            this.gameData.currentAction = "Ruch pionka";
                            this.gameData.timesThrown = 1;
                            return _dataWithPlayersTarget();
                        }
                    }
                }
                finishPositionPawns = 0; // jeżeli wcześniejsze sprawdzenie nie wywolalo returna, znaczy ze nie ma pionka na mapie. Sprawdzamy czy są pionki na pozycji końcowej, ponieważ jeżeli są to osoba nie ma kolejnego rzutu, gdyż jest to środek gry a nie sam jej początek
                for (const pawn of this.finishPositions) {
                    if (pawn[0] == currentPlayer.publicId) {
                        if (pawn[1] != 0) {
                            finishPositionPawns++;
                        }
                    }
                }
                if (finishPositionPawns == 0) {
                    //jeżeli liczba pionków na pozycji końcowej wynosi 0 i nie ma pionkow na mapie gracz dostaje kolejny rzut, ponieważ dopiero rozpoczela sie gra
                    this.gameData.currentAction = "Rzut kością";
                    return _dataWithPlayersTarget();
                } else {
                    //w przeciwnym wypadku tura innego gracza
                    this.gameData.timesThrown = 1;
                    this.gameData.currentAction = "Rzut kością";
                    this.nextTurn();
                    return _dataWithPlayersTarget();
                }
            }
        } else {
            // jeżeli użytkownik próbuje rzucić kością 4 raz to tura przechodzi do innego gracza
            this.gameData.timesThrown = 1;
            this.gameData.currentAction = "Rzut kością";
            this.nextTurn();
            return _dataWithPlayersTarget();
        }
    }

    _possibleMoves(currentPlayer){
        possibleMoves = [['plansza',[]], ['start',[]], ['finish',[]]] // wygodniej byłoby na obiektach ale nie chcemy ich przekazywać chyba, że będziemy je rozpakowywać?? Do ustalenia
        if (this.gameData.diceThrowResult == 6 || this.gameData.diceThrowResult == 1) {
            if (this.gameData.diceThrowResult == 1) {
                for (pawnGroup of this.finishPositionPawns) {
                    for (const pawn of pawnGroup) {
                        if (
                            pawn[0] == currentPlayer.publicId &&
                            pawn[1] != 0 &&
                            finishPositionPawns[
                                finishPositionPawns.indexOf(pawn) + 1
                            ][1] == 0
                        ) {
                            //jeżeli pionki na pozycji finiszu moga sie ruszyc o 1 dodajemy do mozliwych ruchow
                            possibleMoves[2][1].push(element);
                        }
                    }
                }
            }
            for (const element of this.gameMap) {
                //sprawdzamy czy jest jakiś pionek na mapie za pomocą porównania pierwszego indeksu tablicy pionka (pId) z publicznym Id gracza
                if (!element.isInteger()) {
                    if (element[0] == currentPlayer.publicId) {
                        //jeżeli pionek jest na planszy to dodajemy go do możliwych ruchów. UWAGA DODAĆ SPRAWDZANIE CZY FAKTYCZNIE MOŻE SIĘ TAM RUSZYĆ (tam może być finisz)
                        if(indexOf(element) + this.gameData.diceThrowResult > ){ // dokończyć
                            
                        }
                        possibleMoves[0][1].push(element);
                    }
                }
            }
            for (const pawn of this.startingPositionArea) {
                //jeżeli pionek jest na starcie to dodajemy go do możliwych ruchów
                if (pawn[0] == currentPlayer.publicId)
                    possibleMoves[1][1].push(element);
            }
        }else{
            if(this.gameData.diceThrowResult <= 3){
                for (pawnGroup of this.finishPositionPawns) {
                    for (const pawn of pawnGroup) {
                        if (
                            pawn[0] == currentPlayer.publicId &&
                            pawn[1] != 0 &&
                            finishPositionPawns[
                                finishPositionPawns.indexOf(pawn) + 1
                            ][1] == 0
                        ) {
                            //jeżeli pionki na pozycji finiszu moga sie ruszyc o 1 dodajemy do mozliwych ruchow
                            possibleMoves[2][1].push(element);
                        }
                    }
                }
            }
            for (const element of this.gameMap) {
                //sprawdzamy czy jest jakiś pionek na mapie za pomocą porównania pierwszego indeksu tablicy pionka (pId) z publicznym Id gracza
                if (!element.isInteger()) {
                    if (element[0] == currentPlayer.publicId) {
                        //jeżeli pionek jest na planszy to dodajemy go do możliwych ruchów. UWAGA DODAĆ SPRAWDZANIE CZY FAKTYCZNIE MOŻE SIĘ TAM RUSZYĆ (tam może być finisz)
                        possibleMoves[0][1].push(element);
                    }
                }
            }
        }
    }

    pawnMovement() {
        if (
            data.publicId == this.playersQueue[currentPlayerIndex] &&
            this.gameData.currentAction == "Ruch pionka"
        ) {
            const currentPlayer = this.currentPlayer();
            const possiblePawnMoves = _possibleMoves(currentPlayer.publicId)

            const mapStartPoint = 0;
            const firstPawnToGo = [];
            for (const pId of this.playersQueue) {
                //ustawiamy punkt startowy na który trafiają pionki gracza, gracz pierwszy w kolejce ma indeks tablicy 0 tak więc startuje na polu 0, drugi ma indeks 1 więc 10 itd.
                if (pId == currentPlayer.publicId) {
                    mapStartPoint = playersQueue.indexOf(pId) * 10;
                }

                if (this.gameData.diceThrowResult == 6 || this.gameData.diceThrowResult == 1) {

                }
                if (this.gameData.diceThrowResult == 1) {

                }
            }
            // for(const pawn of this.startingPositionArea){ //wyznaczamy pionka który jako pierwszy wyjdzie na mape
            //         if(pawn[0] == currentPlayer.publicId){
            //             firstPawnToGo = pawn
            //             break
            //     }
            //     }
            //     this.gameMap[mapStartPoint] = firstPawnToGo
            //     this.startingPositionArea.pop(firstPawnToGo) //wychodzimy pionkiem na mape, usuwamy go z pozycji startowej
            // }
            // else if("Gracz podjal decyzje ze ruszy sie pionkiem z pola startowego"){ //dokladny warunek ifa do zmiany po konsultacji

            // }
            // } else{ //jeżeli nie jest to gracz którego jest tura lub nacisnal nie to co trzeba zwracamy error
            //     throw new InvalidActionError();
            // }
        }
    }

    // whoseTurnIsIt(){

    // }

    // leaveStartingArea(){

    // }

    // funkcja tylko dla tej klasy funkcja prywatna gracz nie moze miec do tego dostepu
    // _enterFinishArea(){

    // }

    // captureAPawn(){

    // }

    // selectPawn(){

    // }

    // endGame(){

    // }
}
