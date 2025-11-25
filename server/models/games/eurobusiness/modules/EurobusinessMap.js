import tiles from "../config/tiles.json" with { type: "json" };

export default class EurobusinessMap {
    constructor() {
        this.tiles = tiles;
    }

    movePlayer(player, number) {
        const position = player.getData("position");
        let newPosition = position + number;

        if (newPosition > 39) {
            newPosition -= 40;
            return true;
        }

        return false;
    }
}
