import Game from "../../Game.js";
import Cards from "./Cards.js";
import Church from "./Church.js";
import dialogs from "./config/dialogs.js";
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
        this.regions = new Regions(this);
    }

    initializeGameData() {
        this.gameData.phases = {
            playing: { current: 1, total: 4 },
            current: "passing",
        };
        this.gameData.message = "Odrzucanie kart";
        this.gameData.firstPlayer = this.getCurrentPlayer().setFirstPlayer();
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

    generateGameData(publicId) {
        const player = this.getPlayer(publicId);
        return [
            {
                target: publicId,
                eventName: "gameData",
                data: {
                    cards: this.cards.getPlayerCards(player),

                    ...this.regions.getMapData(),

                    ...this.church.getChurchGameInfo(),
                    ...this.vikings.getVikingsGameInfo(),
                    ...this.marriages.getMarragiesGameInfo(),

                    phases: {
                        ...this.gameData.phases,
                        passing: this.cards.passingPhase,
                        marragie: this.marriages.marriagePhase,
                    },

                    status: player.getStatus(),
                    message: player.getPlayerStatus() ?? this.gameData.message,
                    players: this.generatePlayersData(),
                    firstPlayer: this.gameData.firstPlayer.getPlayerData(),
                },
            },
            ...this.dialogs.generateDialogsQueue(publicId),
        ];
    }

    sendGameDataToAll() {
        const data = [];
        for (const publicId of this.players.keys()) {
            data.push(...this.generateGameData(publicId));
        }
        return data;
    }

    gameDataRequest(data) {
        return this.generateGameData(data.publicId);
    }

    setPlayersStatus(status) {
        this.players.values().forEach((player) => player.setStatus(status));
    }

    addDialogToPlayers(dialog) {
        this.players.values().forEach((player) => player.addDialog(dialog));
    }

    resetEverything() {
        this.gameData.phases.playing.current++;

        this.vikings.resetVikings();
        this.marriages.resetMarriages();

        this.addDialogToPlayers(dialogs.FIRST_PLAYER);
        this.addDialogToPlayers(dialogs.MARRIAGE);
        this.addDialogToPlayers(dialogs.VIKINGS);

        this.cards.resetCardDrawPhase();

        this.gameData.phases = {
            playing: { current: 1, total: 4 },
            current: "passing",
        };

        return this.sendGameDataToAll();
    }

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
        this.vikings.chooseYourCityToVikings(data);
    }

    // @event
    chooseSomeoneCityToVikings(data) {
        this.vikings.chooseSomeoneCityToVikings(data);
    }

    // @event
    marriageWinnerChooseReward(data) {
        this.marriages.marriageWinnerChooseReward(data);
    }

    // @event
    marriageCityReward(data) {
        this.marriages.marriageCityReward(data);
    }

    // @event
    chooseCathedral(data) {
        this.church.chooseCathedral(data);
    }
}
