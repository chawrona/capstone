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

    setPlayerMarriage(player, addLetter) {
        console.log("Dajemy gracza do przodu o ", addLetter);

        const operation = addLetter === 0 ? "reset" : "add";

        let originalIndex = -1;

        this.marriages.forEach((marriage, currentIndex) => {
            if (marriage && marriage.publicId === player.publicId) {
                originalIndex = currentIndex;
            }
        });

        if (operation === "reset") {
            if (originalIndex >= 0) this.marriages[originalIndex] = null;
        } else {
            let index = Math.min(
                this.marriages.length - 1,
                originalIndex + addLetter,
            );

            console.log("Index: ", index);

            while (
                index >= 0 &&
                index > originalIndex &&
                this.marriages[index] !== null
            ) {
                index--;
                console.log("Zmiejszamy index o 1, teraz jest: ", index);
            }

            if (index >= 0) {
                console.log("index większy od zera");
                console.log(this.marriages);
                this.marriages[index] = player;
                console.log(this.marriages);
            }

            if (index !== originalIndex && originalIndex !== -1) {
                this.marriages[originalIndex] = null;
            }
        }
    }

    resetMarriages() {
        this.marriage.shift();
        this.marriagePhase.current++;
        this.marriagesRewards = {
            winner: null,
            city: null,
        };
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
                        name:
                            this.marriage[0].name === "Estrid"
                                ? "Księżniczkę Danii Estrid"
                                : this.marriage[0].name,
                        reward: "winner",
                        fiancee: this.marriage[0],
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

        // Gracze cofają się o 1 w małżeństwach
        for (let i = 0; i < this.marriages.length; i++) {
            this.marriages[i] = this.marriages[i + 1];
        }

        if (winner) {
            const currentFiancee = this.getCurrentfiancee();
            const currentFianceeRegion = currentFiancee.region;
            console.log({ currentFianceeRegion });

            this.game.addDialogToPlayers(dialogs.MARRIAGE_REWARDS);

            console.log({ Punkty: winner.getData("points") });

            winner.setData(
                "points",
                (oldPoints) => oldPoints + this.marriage[0].points,
            );

            console.log({ Dodajemy: this.marriage.points });
            console.log({ Jest: winner.getData("points") });

            switch (currentFiancee.name) {
                case "Sāikō":
                    winner.setData(
                        "suns",
                        (oldSuns) => oldSuns + this.marriage[0].suns,
                    );
                    return this.setCityWinner();
                case "Saishi":
                    return this.setCityWinner();
                case "Estrid":
                    winner.setData(
                        "suns",
                        (oldSuns) => oldSuns + this.marriage[0].suns,
                    );
                    winner
                        .setStatus(statuses.CHOOSE_ESTRID_REWARD)
                        .addDialog(dialogs.ESTRID_REWARD_DIALOG);
                    this.game.gameData.message = `${winner.username} prosi o pomoc Księżniczkę Danii`;
                    return this.game.sendGameDataToAll();
                default:
                    if (
                        this.game.regions.setCitiesToBuildInRegion(
                            winner,
                            currentFianceeRegion,
                        )
                    ) {
                        winner.setStatus(statuses.BUILD_CITY_REGION);
                        this.game.gameData.message = `${winner.username} buduje miasto w ${currentFianceeRegion}`;
                        return this.game.sendGameDataToAll();
                    } else {
                        return this.setCityWinner();
                    }
            }
        } else {
            this.game.addDialogToPlayers(dialogs.MARRIAGE_NO_WINNER);
            return this.game.vikings.vikingsPhaseEnd();
        }
    }

    setCityWinner() {
        const cityWinner = this.marriagesRewards.city;

        if (!cityWinner) return this.game.vikings.vikingsPhaseEnd();

        cityWinner
            .setStatus(statuses.BUILD_CITY)
            .addDialog(dialogs.MARRIAGE_REWARD_CITY);

        this.game.regions.setCitiesToBuildAnywhere();

        this.game.gameData.message = `${cityWinner.username} buduje miasto`;

        return this.game.sendGameDataToAll();
    }

    // region Events

    // @event
    marriageWinnerChooseReward(data) {
        const cityId = data.data;

        const winningPlayer = this.game.getPlayer(data.publicId);

        winningPlayer.setStatus(statuses.WAITING);

        this.game.regions.buildCity(cityId, winningPlayer);

        return this.setCityWinner();
    }

    // @event
    marriageCityReward(data) {
        const cityId = data.data;
        const cityWinner = this.getPlayer(data.publicId);

        this.game.regions.buildCity(cityId, cityWinner);

        cityWinner.setStatus(statuses.WAITING);

        return this.game.vikings.vikingsPhaseEnd();
    }

    // @event
    estridReward(data) {
        const reward = data.data;

        if (reward === "vikings") {
            console.log("Reward");
            this.game.addDialogToPlayers(dialogs.ESTRID_REWARD_VIKINGS);
        }

        if (reward === "regions") {
            console.log("Reward");
            this.game.addDialogToPlayers(dialogs.ESTRID_REWARD_REGIONS);
        }

        return this.game.vikings.vikingsPhaseEnd();
    }
}
