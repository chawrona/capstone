import tiles from "../config/tiles.json" with { type: "json" };

export default class EurobusinessEventFactory {
    constructor(game) {
        this.game = game;
    }

    yourTurn(publicId, isYourTurn) {
        return {
            target: publicId,
            eventName: "yourTurn",
            data: isYourTurn,
        };
    }

    availableActions() {
        return {
            target: this.game.getCurrentPlayerPublicId(),
            eventName: "availableActions",
            data: this.game.getAvailableActions(),
        };
    }

    playersPosition() {
        return {
            target: "lobby",
            eventName: "playersPosition",
            data: this.game.getPlayersPositions(),
        };
    }

    currentMessage() {
        return {
            target: "lobby",
            eventName: "currentMessage",
            data: this.game.gameData.currentMessage,
        };
    }

    rollResult(result) {
        return {
            target: "lobby",
            eventName: "rollResult",
            data: result,
        };
    }

    info(message) {
        return {
            target: this.game.getCurrentPlayerPublicId(),
            eventName: "info",
            data: message,
        };
    }

    gameDataRequest(publicId) {
        return {
            target: publicId,
            eventName: "gameDataRequest",
            data: {
                yourTurn:
                    publicId ===
                    this.game.playersQueue[this.game.currentPlayerIndex],
                playersData: this.game.getPlayersData(),
                playersPosition: this.game.getPlayersPositions(),
                gameMap: tiles,
                availableActions: this.game.getAvailableActions(),
                rollResult: this.game.gameData.rollResult,
                yourPublicId: publicId,
                currentMessage: this.game.gameData.currentMessage,
            },
        };
    }
}
