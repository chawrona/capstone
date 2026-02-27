// import getRandomNumber from "../../../utils/getRandomNumber.js";
import dialogs from "./config/dialogs.js";
import statuses from "./config/statuses.js";

export default class Vikings {
    constructor(game) {
        this.game = game;
        this.players = this.game.players;

        this.vikings = [13, 11, 12, 13, 10, 9, 14, 13, 12]; // wikingowie możliwi do wylosowania
        this.currentVikings = this.getCurrentVikings(); // losowanie wikingów

        this.vikingsDialogInfo = []; // łupy wojenne
        this.vikingsAttackDialogInfo = []; // Dialog z informacjami o ataku wikingów
        this.vikingsSomeoneCityInfo = null; // Player, który jest atakowany atakujesz

        this.vikingsYourCityQueue = []; // Kolejka atakowanych swoich miast
        this.vikingsSomeoneCityQueue = []; // Kolejka atakowanych czyichś miast
    }

    getCurrentVikings() {
        return 0;

        // const cardIndex = getRandomNumber(0, this.vikings);
        // return this.vikings.splice(cardIndex, 1)[0];

        // return this.vikings.splice(3, 1)[0];
    }

    resetVikings() {
        this.currentVikings = this.getCurrentVikings();
    }

    getVikingsGameInfo() {
        return {
            currentVikings: this.currentVikings,
            vikingsDialogInfo: this.vikingsDialogInfo,
            vikingsAttackDialogInfo: this.vikingsAttackDialogInfo,
            vikingsSomeoneCityInfo: this.vikingsSomeoneCityInfo,
        };
    }

    vikingsPhaseEnd() {
        if (this.currentVikings <= 0) {
            this.game.addDialogToPlayers(dialogs.VIKINGS_NO_ATTACK);
            this.vikingsDialogInfo = [];
            return this.vikingsRewardsPhaseEnd();
        } else {
            const playersWithVikings = [];

            for (const player of this.players.values()) {
                playersWithVikings.push([player, player.getData("vikings")]);
            }

            playersWithVikings.sort((b, a) => a[1] - b[1]);

            const maxVikingCount = playersWithVikings[0][1];

            const allPlayersEqualVikingCount = playersWithVikings.every(
                ([, vikingCount]) => vikingCount === maxVikingCount,
            );

            const multipleMaxVikingsCount =
                playersWithVikings.filter(
                    ([, vikingCount]) => vikingCount === maxVikingCount,
                ).length > 1;

            const lowestVikingsPlayers = playersWithVikings
                .filter(([, vikingCount]) => {
                    return (
                        vikingCount ===
                        playersWithVikings[playersWithVikings.length - 1][1]
                    );
                })
                .map(([player]) => player);

            if (allPlayersEqualVikingCount || multipleMaxVikingsCount) {
                this.vikingsAttackDialogInfo = [
                    {
                        status: "remis",
                    },
                    ...lowestVikingsPlayers,
                ];
                const player = lowestVikingsPlayers.shift();
                this.game.gameData.message = `${player.username} oddaje miasto wikingom`;
                this.vikingsYourCityQueue = lowestVikingsPlayers;
                this.game.addDialogToPlayers(dialogs.VIKINGS_ATTACK_INFO);

                player
                    .setStatus(statuses.VIKINGS_YOUR_CITY)
                    .addDialog(dialogs.VIKINGS_YOUR_CITY);
            } else {
                this.vikingsSomeoneCityQueue = lowestVikingsPlayers;
                const winningPlayer = playersWithVikings[0][0];
                this.vikingsAttackDialogInfo = [
                    {
                        status: "winner",
                        winningPlayer,
                    },
                    ...lowestVikingsPlayers,
                ];
                this.game.addDialogToPlayers(dialogs.VIKINGS_ATTACK_INFO);

                winningPlayer
                    .setStatus(statuses.VIKINGS_SOMEONE_CITY)
                    .addDialog(dialogs.VIKINGS_SOMEONE_CITY);

                this.game.gameData.message = `${winningPlayer.username} oddaje miasto ${this.vikingsSomeoneCityQueue[0].username} wikingom`;
                this.vikingsSomeoneCityInfo =
                    this.vikingsSomeoneCityQueue.shift();
            }

            return this.game.sendGameDataToAll();
        }
    }

    // @event
    chooseYourCityToVikings(data) {
        const cityId = data.data;
        const player = this.game.getPlayer(data.publicId);

        player.setStatus(statuses.WAITING);

        console.log("Blokujemy miasto", cityId);

        const nextPlayer = this.vikingsYourCityQueue.shift();

        if (!nextPlayer) {
            return this.vikingsRewardsPhaseEnd();
        }

        this.game.gameData.message = `${nextPlayer.username} oddaje miasto wikingom`;

        nextPlayer
            .setStatus(statuses.VIKINGS_YOUR_CITY)
            .addDialog(dialogs.VIKINGS_YOUR_CITY);

        return this.game.sendGameDataToAll();
    }

    // @event
    chooseSomeoneCityToVikings(data) {
        const cityId = data.data;
        const player = this.game.getPlayer(data.publicId);

        console.log("Blokujemy miasto", cityId);

        const nextPlayer = this.vikingsSomeoneCityQueue.shift();

        if (!nextPlayer) {
            return this.vikingsRewardsPhaseEnd();
        }

        this.game.gameData.message = `${player.username} oddaje miasto ${nextPlayer.username} wikingom`;
        this.vikingsSomeoneCityInfo = nextPlayer;

        player.addDialog(dialogs.VIKINGS_SOMEONE_CITY);

        return this.game.sendGameDataToAll();
    }

    vikingsRewardsPhaseEnd() {
        const vikings = [];
        for (const player of this.players.values()) {
            vikings.push([player, player.getData("vikings")]);
        }

        vikings.sort((b, a) => a[1] - b[1]);

        const winningPlayer = vikings[0][0];

        // Czy nie tylko jedna osoba ma najwięcej słońc
        const doesOnlyOneHasHighestVikings = vikings[0][1] !== vikings[1][1];

        if (doesOnlyOneHasHighestVikings) {
            this.vikingsDialogInfo.push({
                reward: {
                    points: winningPlayer.getData("suns") + 1,
                    vikingsTaken: winningPlayer.getData("vikings"),
                    suns: 1,
                },
                player: winningPlayer,
            });
            winningPlayer.setData("suns", (oldSuns) => oldSuns + 1);
            winningPlayer.setData("points", (points) => {
                return points + winningPlayer.getData("suns");
            });
            winningPlayer.setData("vikings", () => 0);

            console.log(`winningPlayer (${winningPlayer.username}): `, {
                suns: winningPlayer.getData("suns"),
                points: winningPlayer.getData("points"),
                vikings: winningPlayer.getData("vikings"),
            });
        }

        const startIndex = doesOnlyOneHasHighestVikings ? 1 : 0;

        this.vikingsDialogInfo = [];

        for (let i = startIndex; i < vikings.length; i++) {
            const player = vikings[i][0];
            if (vikings[i][1] > 0) {
                console.log(`normal player (${player.username}): `, {
                    suns: player.getData("suns"),
                    points: player.getData("points"),
                    vikings: player.getData("vikings"),
                });
                player.setData("vikings", (oldVikings) => oldVikings - 1);
                player.setData("points", (points) => points + 1);
                this.vikingsDialogInfo.push({
                    reward: {
                        points: 1,
                        vikingsTaken: 1,
                    },
                    player,
                });
            }
        }

        this.game.addDialogToPlayers(dialogs.VIKINGS_REWARD);
        this.game.setPlayersStatus(statuses.WAITING);

        return this.game.church.churchEndPhase();
    }
}
