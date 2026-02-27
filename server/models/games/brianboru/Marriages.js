import dialogs from "./config/dialogs.js";
import marriages from "./config/marriages.js";
import statuses from "./config/statuses.js";

export default class Marriages {
    constructor(game) {
        this.game = game;
        this.players = this.game.players;

        this.marriagePhase = {
            current: 1,
            total: 4,
        };

        this.marriage = this.initalizeMarriages();
        this.marriages = [null, null, null, null, null, null, null, null, null];

        this.marriageDialogInfo = [];

        this.marriagesRewards = {
            winner: null,
            city: null,
        };
    }

    initalizeMarriages() {
        const candidates = structuredClone(marriages);
        const princess = candidates.splice(7, 1)[0];
        candidates.sort(() => Math.random() - 0.5);
        return [...candidates.slice(0, 3), princess];
    }

    resetMarriages() {
        this.marriage.shift();
        this.marriagePhase.current++;
    }

    getPlayersQueue() {
        return this.marriages.map((object) => (object ? object.color : null));
    }

    getCurrentfiancee() {
        return this.marriage[0];
    }

    getMarragiesGameInfo() {
        return {
            marriages: this.getPlayersQueue(),
            marriage: this.getCurrentfiancee(),
            marriageDialogInfo: this.marriageDialogInfo,
        };
    }

    // @event
    marriageWinnerChooseReward(data) {
        const cityId = data.data;

        const winningPlayer = this.game.getPlayer(data.publicId);

        winningPlayer.setStatus(statuses.WAITING);

        console.log(cityId); // zbudowaliśmy miasto, przełączamy się teraz na city winnera

        const cityWinner = this.gameData.marriagesRewards.city;

        if (!cityWinner) return this.game.vikings.vikingsPhaseEnd();

        cityWinner
            .setStatus(statuses.BUILD_CITY)
            .addDialog(dialogs.MARRIAGE_REWARD_CITY);

        this.game.gameData.message = `${cityWinner.username} buduje miasto`;

        return this.game.sendGameDataToAll();
    }

    // @event
    marriageCityReward(data) {
        const cityId = data.data;
        const cityWinner = this.getPlayer(data.publicId);

        console.log(cityId); // zbudowaliśmy miasto, ogarniamy wikingów

        cityWinner.setStatus(statuses.WAITING);

        return this.game.vikings.vikingsPhaseEnd();
    }

    marriagesPhaseEnd() {
        const rewards = [
            "",
            "money",
            "money",
            "money",
            "doubleMoney",
            "doubleMoney",
            "sun",
            "city",
            "winning",
        ];

        this.marriageDialogInfo = [];

        for (let i = this.marriages.length - 1; i >= 0; i--) {
            const player = this.marriages[i];
            if (player) {
                if (!this.marriagesRewards.winner) {
                    this.marriagesRewards.winner = this.marriages[i];
                    this.marriages[i] = null;

                    this.marriageDialogInfo.push({
                        reward: "winner",
                        player: this.marriagesRewards.winner,
                    });
                } else {
                    this.marriageDialogInfo.push({
                        reward: rewards[i],
                        player,
                    });
                    switch (rewards[i]) {
                        case "money":
                            player.setData("money", (oldMoney) => oldMoney + 1);
                            break;
                        case "doubleMoney":
                            player.setData("money", (oldMoney) => oldMoney + 2);
                            break;
                        case "sun":
                            player.setData("suns", (oldSuns) => oldSuns + 1);
                            break;
                        case "city":
                            this.marriagesRewards.city = this.marriages[i];
                            break;
                    }
                }
            }
        }

        const winner = this.marriagesRewards.winner;

        if (winner) {
            this.game.addDialogToPlayers(dialogs.MARRIAGE_REWARDS);

            winner
                .setStatus(statuses.BUILD_CITY_REGION)
                .addDialog(dialogs.MARRIAGE_REWARD_WINNING);

            this.game.gameData.message = `${winner.username} buduje miasto w DATA.REGION`;
        } else {
            this.game.addDialogToPlayers(dialogs.MARRIAGE_NO_WINNER);
            return this.game.vikings.vikingsPhaseEnd();
        }

        return this.game.sendGameDataToAll();
    }
}
