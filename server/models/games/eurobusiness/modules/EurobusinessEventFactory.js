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

    rollResult() {
        return {
            target: "lobby",
            eventName: "rollResult",
            data: this.game.gameData.rollResult,
        };
    }

    info(message, publicId) {
        return {
            target: publicId ? publicId : this.game.getCurrentPlayerPublicId(),
            eventName: "gameInfo",
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
                logs: this.game.logs,
            },
        };
    }
    communityCard(card) {
        return {
            target: this.game.getCurrentPlayerPublicId(),
            eventName: "pickedCommunityCard",
            data: card,
        };
    }
    chanceCard(card) {
        return {
            target: this.game.getCurrentPlayerPublicId(),
            eventName: "pickedChanceCard",
            data: card,
        };
    }
    logs() {
        return {
            target: "lobby",
            eventName: "logs",
            data: this.game.logs,
        };
    }
    playersData() {
        return {
            target: "lobby",
            eventName: "playersData",
            data: this.game.getPlayersData(),
        };
    }

    auction() {
        return {
            target: "lobby",
            eventName: "auction",
            data: this.game.gameData.auction,
        };
    }

    closeDialogs() {
        return {
            target: "lobby",
            eventName: "closeDialogs",
        };
    }

    rollPackage() {
        return [
            this.currentMessage(),
            this.availableActions(),
            this.logs(),
            this.rollResult(),
            this.playersPosition(),
            this.playersData(),
            this.time(),
        ];
    }
    time() {
        return {
            target: "lobby",
            eventName: "time",
            data: this.game.timer,
        };
    }
}
