import { cities, regions } from "./config/cities.js";
import dialogs from "./config/dialogs.js";
import points from "./config/points.js";
import statuses from "./config/statuses.js";

export default class EndGame {
    constructor(game) {
        this.game = game;
        this.players = this.game.players;
        this.endData = [
            [], // 0. Nazwy graczy
            [], // 1. Punkty na koniec
            [], // 2. 0 lub 1 w zależności od tego kto ma najwięcej hajsu
            [], // 3. 0 lub 1 w zależności od tego kto jest pierwszym graczem
            [], // 4. Ilość słońc
            [], // 5. zdobyte nazwy regionów [{region: XYZ, estrid: false}]
            [], // 6. ilość regionów, w których ktoś jest [regiony, punkty]
            [], // 7. podsumowanie ilości punktów [punkty, które miejsce]
        ];
    }

    endGame() {
        // Kto ma najwięcej kasy
        let playerWithMostMoney = undefined;
        let isRemis = false;

        for (const player of this.game.players.values()) {
            if (!playerWithMostMoney) playerWithMostMoney = player;
            else {
                if (
                    playerWithMostMoney.getData("money") ===
                    player.getData("money")
                ) {
                    isRemis = true;
                }

                if (
                    playerWithMostMoney.getData("money") <
                    player.getData("money")
                ) {
                    playerWithMostMoney = player;
                    isRemis = false;
                }
            }
        }

        this.game.regions.checkAllRegions(
            this.game.vikings.findPlayerWithEstrid(),
        );

        this.game.players.values().forEach((player, index) => {
            this.endData[0][index] = player.generateData();

            let points = (this.endData[1][index] = player.getData("points"));

            if (
                isRemis ||
                (!isRemis && playerWithMostMoney.publicId !== player.publicId)
            ) {
                this.endData[2][index] = player.getData("money");
            } else {
                points += 1;
                this.endData[2][index] = player.getData("money");
            }

            points += this.endData[3][index] = player.getData("firstPlayer")
                ? 1
                : 0;

            points += this.endData[4][index] = player.getData("suns");

            const regions = this.getPlayersRegions(player);

            points += regions.reduce((prev, acc) => {
                return prev + acc[1];
            }, 0);

            this.endData[5][index] = regions;

            this.endData[6][index] = this.getRegionsPlayersHasCitiesIn(player);

            this.endData[7][index] = points;
        });

        this.game.setPlayersStatus(statuses.END);
        this.game.addDialogToPlayers(dialogs.END);
        this.game.setMessage("Podsumowanie gry");

        this.game.endGame();
    }

    getPlayersRegions = (player) => {
        const playerRegions = [];

        for (const [region, owners] of Object.entries(
            this.game.regions.regions,
        )) {
            if (
                owners.map((owner) => owner.publicId).includes(player.publicId)
            ) {
                playerRegions.push([
                    region,
                    Math.floor(regions[region].points / owners.length),
                ]);
            }
        }
        return playerRegions;
    };

    getRegionsPlayersHasCitiesIn(player) {
        const regionsName = new Set();
        const estridRegionHelp = player.getData("estrid") === "regions";

        for (const [cityId, city] of Object.entries(this.game.regions.cities)) {
            if (
                city.owner.publicId === player.publicId ||
                (city.vikings && estridRegionHelp)
            )
                regionsName.add(cities[cityId].region);
        }

        const regionsArray = Array.from(regionsName);
        return [points[regionsArray.length], regionsArray];
    }
}
