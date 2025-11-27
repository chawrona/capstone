import tiles from "../config/tiles.json" with { type: "json" };

export default class EurobusinessMap {
    movePlayer(player, rollResult) {
        let hasCompletedLap = false;

        player.setData((position) => {
            if (position + rollResult > 39) hasCompletedLap = true;
            return (position + rollResult) % 40;
        });

        return hasCompletedLap;
    }

    getCurrentPlayerTile(player) {
        const position = player.getData("position");
        return tiles[position];
    }
}
