import Game from "../../Game.js";
import Cards from "./Cards.js";
import Church from "./Church.js";
import dialogs from "./config/dialogs.js";
import statuses from "./config/statuses.js";
import Debug from "./Debug.js";
import Dialogs from "./Dialogs.js";
import Marriages from "./Marriages.js";
import Regions from "./Regions.js";
import Vikings from "./Vikings.js";

export default class BrianBoru extends Game {
    constructor(players, endGame, lobbyId, playerClass) {
        super(players, endGame, lobbyId, playerClass);
        this.cards = new Cards(this);
        this.dialogs = new Dialogs(this);
        this.vikings = new Vikings(this);
        this.marriages = new Marriages(this);
        this.church = new Church(this);
        this.debug = new Debug(this);
        this.regions = new Regions(this);
    }

    initializeGameData() {
        this.gameData.phases = {
            playing: { current: 1, total: 4 },
            attacking: {
                current: 1,
                // total:
                //     this.players.size === 5
                //         ? 4
                //         : this.players.size === 4
                //           ? 5
                //           : 7,
                total: 2,
            },
            current: "passing",
        };

        this.gameData.firstPlayer = this.getCurrentPlayer().setFirstPlayer();
        this.setMessage(
            `${this.gameData.firstPlayer.username} buduje pierwsze miasto`,
        );
        this.gameData.firstPlayer.setStatus(statuses.BUILD_FIRST_CITY);
    }

    getNextPlayer(publicId) {
        const playerIndex = this.playersQueue.indexOf(publicId);
        const nextPlayerIndex = (playerIndex + 1) % this.playersQueue.length;

        const nextPlayer = this.getPlayer(this.playersQueue[nextPlayerIndex]);

        return nextPlayer;
    }

    setPlayerData(player) {
        player.initalizeData();
    }

    generatePlayersData() {
        const data = [];

        this.players
            .values()
            .forEach((player) => data.push(player.generateData()));

        return data;
    }

    // region GameData START

    generateGameData(publicId) {
        const player = this.getPlayer(publicId);
        return [
            {
                target: publicId,
                eventName: "gameData",
                data: {
                    cards: this.cards.getPlayerCards(player),
                    chosenCards: this.cards.getChosenCards(),
                    hideCards: this.cards.hideCards,
                    nextPlayer: this.getNextPlayer(publicId).getPlayerData(),

                    ...this.regions.getMapData(),

                    ...this.church.getChurchGameInfo(),
                    ...this.vikings.getVikingsGameInfo(),
                    ...this.marriages.getMarragiesGameInfo(),

                    phases: {
                        ...this.gameData.phases,
                        passing: this.cards.passingPhase,
                        marriage: this.marriages.marriagePhase,
                    },

                    status: player.getStatus(),
                    message: player.getPlayerStatus() ?? this.gameData.message,
                    players: this.generatePlayersData(),
                    firstPlayer: this.gameData.firstPlayer.getPlayerData(),
                    you: player.getPlayerData(),
                },
            },
            ...this.dialogs.generateDialogsQueue(publicId),
        ];
    }

    // region GameData END

    sendGameDataToAll(isLogging) {
        const data = [];
        for (const publicId of this.players.keys()) {
            data.push(...this.generateGameData(publicId));
        }

        if (isLogging) {
            this.log(JSON.stringify(data));
        }
        return data;
    }

    gameDataRequest(data) {
        return this.generateGameData(data.publicId);
    }

    setPlayersStatus(status) {
        this.players.values().forEach((player) => player.setStatus(status));
    }

    setMessage(message) {
        this.gameData.message = message;
    }

    addDialogToPlayers(dialog) {
        this.players.values().forEach((player) => player.addDialog(dialog));
    }

    resetEverything() {
        this.gameData.phases.playing.current++;
        this.gameData.phases.attacking.current = 1;

        if (
            this.gameData.phases.playing.current >
            this.gameData.phases.playing.total
        )
            throw new Error("Koniec gry");

        this.vikings.resetVikings();
        this.marriages.resetMarriages();

        this.addDialogToPlayers(dialogs.FIRST_PLAYER);
        this.addDialogToPlayers(dialogs.MARRIAGE);
        this.addDialogToPlayers(dialogs.VIKINGS);

        this.cards.resetCardDrawPhase();

        this.gameData.phases.current = "passing";

        return this.sendGameDataToAll();
    }

    startPlayingPhase() {
        this.players
            .values()
            .forEach((player) => player.setStatus(statuses.WAITING));
        this.gameData.firstPlayer.setStatus(statuses.CHOOSE_ATTACKED_CITY);

        this.regions.prepareCitiesToAttack(this.gameData.firstPlayer);

        this.gameData.message = `${this.gameData.firstPlayer.username} wybiera miasto do atakowania`;
        this.gameData.phases.current = "playing";
    }

    // region Events

    // @event
    selectCardsToPass(data) {
        return this.cards.selectCardsToPass(data);
    }

    // @event
    closeDialog(data) {
        return this.dialogs.closeDialog(data);
    }

    // @event
    chooseYourCityToVikings(data) {
        return this.vikings.chooseYourCityToVikings(data);
    }

    // @event
    chooseSomeoneCityToVikings(data) {
        return this.vikings.chooseSomeoneCityToVikings(data);
    }

    // @event
    marriageWinnerChooseReward(data) {
        return this.marriages.marriageWinnerChooseReward(data);
    }

    // @event
    marriageCityReward(data) {
        return this.marriages.marriageCityReward(data);
    }

    // @event
    estridReward(data) {
        return this.marriages.estridReward(data);
    }

    // @event
    chooseCathedral(data) {
        return this.church.chooseCathedral(data);
    }

    // @event
    chooseCityToAttack(data) {
        return this.regions.chooseCityToAttack(data);
    }

    // @event
    chooseFirstCard(data) {
        return this.cards.chooseFirstCard(data);
    }

    // @event
    chooseCard(data) {
        return this.cards.chooseCard(data);
    }

    // @event
    chooseCardEffect(data) {
        return this.cards.chooseCardEffect(data);
    }

    // @event
    buildBoughtCity(data) {
        return this.regions.buildBoughtCity(data);
    }

    // @event
    removeVikings(data) {
        return this.regions.removeVikings(data);
    }

    // @ event
    buildFirstCity(data) {
        return this.regions.buildFirstCity(data);
    }

    // @debug
    debugCommand(data) {
        return this.debug.run(data);
    }
}
