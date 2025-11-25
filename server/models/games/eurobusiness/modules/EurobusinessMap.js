import tiles from "../config/tiles.json" with { type: "json" };

export default class EurobusinessMap {
    movePlayer(player, number) {
        const position = player.getData("position");
        let newPosition = position + number;

        if (newPosition > 39) {
            newPosition -= 40;
            return true;
        }

        return false;
    }

    getCurrentPlayerTile(player) {
        const position = player.getData("position");
        return tiles[position];
    }
}
