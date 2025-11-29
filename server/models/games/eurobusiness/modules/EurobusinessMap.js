import tiles from "../config/tiles.json" with { type: "json" };

export default class EurobusinessMap {
    constructor() {
        this.ownerships = new Map();
    }

    movePlayer(player, rollResult) {
        let hasCompletedLap = false;

        player.setData("position", (oldPosition) => {
            if (oldPosition + rollResult > 39) hasCompletedLap = true;
            return (oldPosition + rollResult) % 40;
        });

        return hasCompletedLap;
    }

    getCurrentPlayerTile(player) {
        const position = player.getData("position");
        return tiles[position];
    }
}
