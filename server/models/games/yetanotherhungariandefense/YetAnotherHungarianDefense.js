import Game from "../../Game.js";

export default class YetAnotherHungarianDefense extends Game {
    constructor(players, endGame, lobbyId, playerClass) {
        super(players, endGame, lobbyId, playerClass);
    }

    initializeGameData() {
        // tu startowy stan gry
    }

    setPlayerData(player) {
        player.initalizeData();
    }
}
