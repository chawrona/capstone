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
            this.churchQueue.push(winningChurchPlayer);
            this.churchDialogInfo.push({
                player: churchData[0][0],
                reward: {
                    cathedral: true,
                    church: -1 * winningChurchPlayer.getData("church"),
                },
            });

            for (const player of this.players.values()) {
                player.setData("firstPlayer", () => false);
            }

            winningChurchPlayer.setData("firstPlayer", () => true);
            this.game.gameData.firstPlayer =
                winningChurchPlayer.getPlayerData();

            winningChurchPlayer.setData("church", () => 0);
        }

        for (const [player] of churchData) {
            if (player.getData("church") > 0) {
                player.setData("church", (oldChurch) => oldChurch - 1);
                player.setData("points", (oldPoints) => oldPoints + 1);
                this.churchDialogInfo.push({
                    player,
                    reward: {
                        points: 1,
                    },
                });
            }
        }

        for (const player of this.players.values()) {
            if (player.getData("church") >= 4) {
                this.churchQueue.push(player);

                this.churchDialogInfo.push({
                    player,
                    reward: {
                        cathedral: true,
                        church: -1 * player.getData("church"),
                    },
                });
                player.setData("church", () => 0);
            }
        }

        if (this.churchQueue.length > 0) {
            const player = this.churchQueue.shift();
            this.game.gameData.message = `${player.username} buduje katedrę`;

            this.game.setPlayersStatus(statuses.WAITING);
            this.game.addDialogToPlayers(dialogs.CHURCH);

            player
                .setStatus(statuses.BUILD_CATHEDRAL)
                .addDialog(dialogs.BUILD_CATHEDRAL);

            return this.game.sendGameDataToAll();
        } else {
            return this.game.resetEverything();
        }
    }

    // @event
    chooseCathedral(data) {
        const cityId = data.data;
        const player = this.game.getPlayer(data.publicId);
        console.log("Wybudowaliśmy katedrę", cityId);

        const nextPlayer = this.churchQueue.shift();

        if (nextPlayer) {
            this.game.gameData.message = `${nextPlayer.username} buduje katedrę`;

            player.setStatus(statuses.WAITING);

            nextPlayer
                .setStatus(statuses.BUILD_CATHEDRAL)
                .addDialog(dialogs.BUILD_CATHEDRAL);

            return this.game.sendGameDataToAll();
        } else {
            return this.game.resetEverything();
        }
    }
}
