import dialogs from "./config/dialogs.js";
import statuses from "./config/statuses.js";

export default class Church {
    constructor(game) {
        this.game = game;
        this.players = this.game.players;

        this.churchDialogInfo = [];
        this.churchQueue = [];
    }

    getChurchGameInfo() {
        const church = [];
        for (const player of this.players.values()) {
            for (let i = 0; i < player.getData("church"); i++) {
                church.push(player.color);
            }
        }
        return {
            church,
            churchDialogInfo: this.churchDialogInfo,
        };
    }

    resetChurch() {
        this.churchDialogInfo = [];
        this.churchQueue = [];
    }

    churchEndPhase() {
        let totalChurchCount = 0;
        const churchData = [];

        for (const player of this.players.values()) {
            const playerChurchCount = player.getData("church");
            churchData.push([player, playerChurchCount]);
            totalChurchCount += playerChurchCount;
        }

        if (totalChurchCount <= 0) {
            this.churchDialogInfo = ["Brak ludzi w kościele"];
            this.game.addDialogToPlayers(dialogs.CHURCH);
            return this.game.resetEverything();
        }

        churchData.sort((b, a) => a[1] - b[1]);

        const churchRemis = churchData[0][1] === churchData[1][1];

        if (!churchRemis) {
            const winningChurchPlayer = churchData[0][0];
            const canCathedral =
                this.game.regions.doesPlayerHasCityForCathedral(
                    winningChurchPlayer,
                );
            if (canCathedral) {
                this.churchQueue.push(winningChurchPlayer);
            }
            this.churchDialogInfo.push({
                player: churchData[0][0],
                reward: {
                    cathedral: canCathedral,

                    church: -1 * winningChurchPlayer.getData("church"),
                },
            });

            for (const player of this.players.values()) {
                player.setData("firstPlayer", () => false);
            }

            winningChurchPlayer.setData("firstPlayer", () => true);
            this.game.gameData.firstPlayer = winningChurchPlayer;

            this.game.currentPlayerIndex = this.game.playersQueue.indexOf(
                winningChurchPlayer.publicId,
            );

            winningChurchPlayer.setData("church", () => 0);
        }

        for (const [player] of churchData) {
            if (player.getData("church") > 0) {
                player.setData("church", (oldChurch) => oldChurch - 1);
                player.setData("points", (oldPoints) => oldPoints + 1);

                const reward = {
                    points: 1,
                    church: -1,
                };

                if (player.getData("church") >= 4) {
                    reward.church -= player.getData("church");

                    const canCathedral =
                        this.game.regions.doesPlayerHasCityForCathedral(player);
                    if (canCathedral) {
                        this.churchQueue.push(player);
                        reward.cathedral = true;
                    }

                    player.setData("church", () => 0);
                }

                this.churchDialogInfo.push({
                    player,
                    reward,
                });
            }
        }

        if (this.churchQueue.length > 0) {
            const player = this.churchQueue.shift();
            this.game.gameData.message = `${player.username} buduje katedrę`;

            this.game.setPlayersStatus(statuses.WAITING);
            this.game.addDialogToPlayers(dialogs.CHURCH);

            // budowanie katedry
            this.game.regions.setCitiesToCathedra(player);
            player
                .setStatus(statuses.BUILD_CATHEDRAL)
                .addDialog(dialogs.BUILD_CATHEDRAL);

            return this.game.sendGameDataToAll();
        } else {
            return this.game.resetEverything();
        }
    }

    // region Events

    // @event
    chooseCathedral(data) {
        const cityId = data.data;
        const player = this.game.getPlayer(data.publicId);

        this.game.regions.cities[cityId].cathedra = true;

        const nextPlayer = this.churchQueue.shift();

        if (nextPlayer) {
            this.game.gameData.message = `${nextPlayer.username} buduje katedrę`;

            player.setStatus(statuses.WAITING);
            this.game.regions.setCitiesToCathedra(nextPlayer);
            nextPlayer
                .setStatus(statuses.BUILD_CATHEDRAL)
                .addDialog(dialogs.BUILD_CATHEDRAL);

            return this.game.sendGameDataToAll();
        } else {
            return this.game.resetEverything();
        }
    }
}
