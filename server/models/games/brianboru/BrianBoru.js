// import getRandomNumber from "../../../utils/getRandomNumber.js";
import Game from "../../Game.js";
import Cards from "./Cards.js";
import dialogs from "./config/dialogs.js";
import marriages from "./config/marriages.js";
import statuses from "./config/statuses.js";
import Dialogs from "./Dialogs.js";

export default class BrianBoru extends Game {
    constructor(players, endGame, lobbyId) {
        super(players, endGame, lobbyId);
        this.cards = new Cards(this);
        this.dialogs = new Dialogs(this);
    }

    initializeGameData() {
        // Wikingowie
        this.gameData.vikings = [13, 11, 12, 13, 10, 9, 14, 13, 12];
        this.gameData.currentVikings = this.getCurrentVikings();
        this.gameData.vikingsDialogInfo = [];
        this.gameData.vikingsAttackDialogInfo = [];
        this.gameData.currentAttackedPlayer = "";
        this.gameData.vikingsYourCityQueue = [];
        this.gameData.vikingsSomeoneCityQueue = [];
        this.gameData.vikingsSomeoneCityInfo = [];

        // Liczniki tur
        this.gameData.phases = {
            marriage: { current: 1, total: 4 },
            playing: { current: 1, total: 4 },
            current: "passing",
        };

        // Małżeństwa
        this.gameData.marriage = this.initalizeMarriages();
        this.gameData.marriages = [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
        ];
        this.gameData.marriageDialogInfo = [];
        this.gameData.marriagesRewards = {
            winner: null,
            city: null,
        };

        // Kościół
        this.gameData.churchDialogInfo = [];
        this.gameData.churchQueue = [];

        // Informacje
        this.gameData.message = "Odrzucanie kart";

        // Pierwszy gracz
        this.getCurrentPlayer().setData("firstPlayer", () => true);
        this.gameData.firstPlayer = this.getCurrentPlayer().getPlayerData();
    }

    setPlayerData(player) {
        player.setData("church", () => 0);
        player.setData("points", () => 10);
        player.setData("vikings", () => 0);
        player.setData("suns", () => 1);
        player.setData("money", () => 5);
        player.setData("firstPlayer", () => false);
        player.setData("lockedCards", () => new Set());
        player.setData("cards", () => []);

        player.setData("dialogs", () => [
            dialogs.FIRST_PLAYER,
            dialogs.VIKINGS,
            dialogs.MARRIAGE,
            dialogs.REJECT_CARDS,
        ]);

        this.setPlayerStatus(player, statuses.REJECT_CARDS);
    }

    initalizeMarriages() {
        const candidates = structuredClone(marriages);
        const princess = candidates.splice(7, 1)[0];
        candidates.sort(() => Math.random() - 0.5);
        return [...candidates.slice(0, 3), princess];
    }

    getCurrentVikings() {
        // return 0;

        // const cardIndex = getRandomNumber(0, this.gameData.vikings);
        // return this.gameData.vikings.splice(cardIndex, 1)[0];

        return this.gameData.vikings.splice(3, 1)[0];
    }

    // @event
    selectCardsToPass(data) {
        return this.cards.selectCardsToPass(data);
    }

    // @event
    closeDialog(data) {
        return this.dialogs.closeDialog(data);
    }

    // Odsyłanie danych
    generateChurchData() {
        const church = [];
        for (const player of this.players.values()) {
            for (let i = 0; i < player.getData("church"); i++) {
                church.push(player.color);
            }
        }
        return church;
    }

    generatePlayersData() {
        const data = [];

        for (const player of this.players.values()) {
            data.push({
                username: player.username,
                publicId: player.publicId,
                color: player.color,
                church: player.getData("church"),
                points: player.getData("points"),
                vikings: player.getData("vikings"),
                suns: player.getData("suns"),
                money: player.getData("money"),
                firstPlayer: player.getData("firstPlayer"),
            });
        }

        return data;
    }

    getMessageForPlayer(publicId) {
        const player = this.getPlayer(publicId);
        const playerStatus = player.getData("status");
        if (playerStatus === statuses.REJECT_CARDS_WAITING) {
            return "Oczekiwanie na innych graczy";
        } else if (playerStatus === statuses.REJECT_CARDS) {
            return `Odrzucanie kart (${this.cards.passingPhase.current}/${this.cards.passingPhase.total})`;
        } else {
            return this.gameData.message;
        }
    }

    // @event

    generateGameData(publicId) {
        return [
            {
                target: publicId,
                eventName: "gameData",
                data: {
                    // Karty gracza po lewej
                    cards: [
                        this.getPlayer(publicId).getData("cards"),
                        Array.from(
                            this.getPlayer(publicId).getData("lockedCards"),
                        ),
                    ],

                    // Kościół na dole po prawej
                    church: this.generateChurchData(),
                    churchDialogInfo: this.gameData.churchDialogInfo,

                    // Gracze po prawej u góry
                    players: this.generatePlayersData(),

                    firstPlayer: this.gameData.firstPlayer,

                    // Wikingowie u góry po lewej
                    currentVikings: this.gameData.currentVikings,
                    vikingsDialogInfo: this.gameData.vikingsDialogInfo,
                    vikingsAttackDialogInfo:
                        this.gameData.vikingsAttackDialogInfo,
                    vikingsSomeoneCityInfo:
                        this.gameData.vikingsSomeoneCityInfo,

                    status: this.getPlayerStatus(publicId),
                    phases: {
                        ...this.gameData.phases,
                        passing: this.cards.passingPhase,
                    },

                    // Śluby na dole po lewej
                    marriages: this.gameData.marriages.map((object) =>
                        object ? object.color : null,
                    ),
                    marriage: this.gameData.marriage[0],
                    marriageDialogInfo: this.gameData.marriageDialogInfo,

                    message: this.getMessageForPlayer(publicId),
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

    // Pomocnicze
    getPlayerStatus(publicId) {
        return this.getPlayer(publicId).getData("status");
    }

    setPlayerStatus(player, status) {
        player.setData("status", () => status);
    }
    setPlayersStatus(status) {
        for (const player of this.players.values()) {
            player.setData("status", () => status);
        }
    }

    addDialogToPlayer(player, dialog) {
        player.setData("dialogs", (oldDialogs) => {
            oldDialogs.push(dialog);
            return oldDialogs;
        });
    }

    addDialogToPlayers(dialog) {
        for (const player of this.players.values()) {
            player.setData("dialogs", (oldDialogs) => {
                oldDialogs.push(dialog);
                return oldDialogs;
            });
        }
    }

    // @event
    marriageWinnerChooseReward(data) {
        const cityId = data.data;

        const winningPlayer = this.getPlayer(data.publicId);
        this.setPlayerStatus(winningPlayer, statuses.WAITING);

        console.log(cityId); // zbudowaliśmy miasto, przełączamy się teraz na city winnera

        const cityWinner = this.gameData.marriagesRewards.city;

        if (!cityWinner) return this.vikingsPhaseEnd();

        cityWinner.setData("dialogs", (oldDialogs) => {
            oldDialogs.push(dialogs.MARRIAGE_REWARD_CITY);
            return oldDialogs;
        });

        this.setPlayerStatus(cityWinner, statuses.BUILD_CITY);

        this.gameData.message = `${cityWinner.username} buduje miasto`;

        return this.sendGameDataToAll();
    }

    // @event
    marriageCityReward(data) {
        const cityId = data.data;
        const cityWinner = this.getPlayer(data.publicId);

        console.log(cityId); // zbudowaliśmy miasto, ogarniamy wikingów

        this.setPlayerStatus(cityWinner, statuses.WAITING);

        return this.vikingsPhaseEnd();
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

        this.gameData.marriageDialogInfo = [];

        for (let i = this.gameData.marriages.length - 1; i >= 0; i--) {
            const player = this.gameData.marriages[i];
            if (player) {
                if (!this.gameData.marriagesRewards.winner) {
                    this.gameData.marriagesRewards.winner =
                        this.gameData.marriages[i];
                    this.gameData.marriages[i] = null;

                    this.gameData.marriageDialogInfo.push({
                        reward: "winner",
                        player: this.gameData.marriagesRewards.winner,
                    });
                } else {
                    this.gameData.marriageDialogInfo.push({
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
                            this.gameData.marriagesRewards.city =
                                this.gameData.marriages[i];
                            break;
                    }
                }
            }
        }

        const winner = this.gameData.marriagesRewards.winner;

        if (winner) {
            this.addDialogToPlayers(dialogs.MARRIAGE_REWARDS);
            this.addDialogToPlayer(winner, dialogs.MARRIAGE_REWARD_WINNING);
            this.setPlayerStatus(winner, statuses.BUILD_CITY_REGION);
            this.gameData.message = `${winner.username} buduje miasto w DATA.REGION`;
        } else {
            this.addDialogToPlayers(dialogs.MARRIAGE_NO_WINNER);
            return this.vikingsPhaseEnd();
        }

        return this.sendGameDataToAll();
    }

    vikingsPhaseEnd() {
        /*
         Faza ataku wikingów
            Czy zostały jakieś znaczniki?
            1. Kto ma najwięcej wikingów (jako jedyny)
            2. Kto ma najmniej znaczników
            
            1 najwięcej 1 najmniej
                Ktoś wybiera komuś miasto
            X najwięcej; X > Y; Y najmniej
                Ten najmniej sam wybiera sobie miasto
            1 najwięcej X najmniej
                Ktoś wybiera innym miasta
            Remis
                Wszyscy sobie wybierają

            */
        if (this.gameData.currentVikings <= 0) {
            this.addDialogToPlayers(dialogs.VIKINGS_NO_ATTACK);
            this.gameData.vikingsDialogInfo = [];
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

            console.log(
                "Lowest vikings players: ",
                lowestVikingsPlayers.map((user) => user.username),
            );

            if (allPlayersEqualVikingCount || multipleMaxVikingsCount) {
                this.gameData.vikingsAttackDialogInfo = [
                    {
                        status: "remis",
                    },
                    ...lowestVikingsPlayers,
                ];
                const player = lowestVikingsPlayers.shift();
                this.gameData.message = `${player.username} oddaje miasto wikingom`;
                this.gameData.vikingsYourCityQueue = lowestVikingsPlayers;
                this.addDialogToPlayers(dialogs.VIKINGS_ATTACK_INFO);
                this.setPlayerStatus(player, statuses.VIKINGS_YOUR_CITY);
                this.addDialogToPlayer(player, dialogs.VIKINGS_YOUR_CITY);
            } else {
                this.gameData.vikingsSomeoneCityQueue = lowestVikingsPlayers;
                const winningPlayer = playersWithVikings[0][0];
                this.gameData.vikingsAttackDialogInfo = [
                    {
                        status: "winner",
                        winningPlayer,
                    },
                    ...lowestVikingsPlayers,
                ];
                this.addDialogToPlayers(dialogs.VIKINGS_ATTACK_INFO);
                this.setPlayerStatus(
                    winningPlayer,
                    statuses.VIKINGS_SOMEONE_CITY,
                );
                this.addDialogToPlayer(
                    winningPlayer,
                    dialogs.VIKINGS_SOMEONE_CITY,
                );
                this.gameData.message = `${winningPlayer.username} oddaje miasto ${this.gameData.vikingsSomeoneCityQueue[0].username} wikingom`;
                this.gameData.vikingsSomeoneCityInfo =
                    this.gameData.vikingsSomeoneCityQueue.shift();
                console.log(
                    "After first shift: ",
                    lowestVikingsPlayers.map((user) => user.username),
                );
            }
            return this.sendGameDataToAll();
        }
    }

    // @event
    chooseYourCityToVikings(data) {
        const cityId = data.data;
        const player = this.getPlayer(data.publicId);

        this.setPlayerStatus(player, statuses.WAITING);

        console.log("Blokujemy miasto", cityId);

        const nextPlayer = this.gameData.vikingsYourCityQueue.shift();

        if (!nextPlayer) {
            return this.vikingsRewardsPhaseEnd();
        }

        this.gameData.message = `${nextPlayer.username} oddaje miasto wikingom`;
        this.setPlayerStatus(nextPlayer, statuses.VIKINGS_YOUR_CITY);
        this.addDialogToPlayer(nextPlayer, dialogs.VIKINGS_YOUR_CITY);

        return this.sendGameDataToAll();
    }

    // @event
    chooseSomeoneCityToVikings(data) {
        const cityId = data.data;
        const player = this.getPlayer(data.publicId);

        console.log("Blokujemy miasto", cityId);

        const nextPlayer = this.gameData.vikingsSomeoneCityQueue.shift();

        if (!nextPlayer) {
            return this.vikingsRewardsPhaseEnd();
        }

        this.gameData.message = `${player.username} oddaje miasto ${nextPlayer.username} wikingom`;
        this.gameData.vikingsSomeoneCityInfo = nextPlayer;

        this.addDialogToPlayer(player, dialogs.VIKINGS_SOMEONE_CITY);

        return this.sendGameDataToAll();
    }

    vikingsRewardsPhaseEnd() {
        // Faza łupów wojennych
        // Kto miał najwięcej (jedna osoba) dostaje słońce, a potem punkt za każde słońce
        // usuwamy jego wikingów
        // wszyscy inni
        // minus jeden wiking, plus jeden punkt
        const vikings = [];
        for (const player of this.players.values()) {
            vikings.push([player, player.getData("vikings")]);
        }

        vikings.sort((b, a) => a[1] - b[1]);

        const winningPlayer = vikings[0][0];

        // Czy nie tylko jedna osoba ma najwięcej słońc
        const doesOnlyOneHasHighestVikings = vikings[0][1] !== vikings[1][1];

        if (doesOnlyOneHasHighestVikings) {
            this.gameData.vikingsDialogInfo.push({
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

        this.gameData.vikingsDialogInfo = [];

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
                this.gameData.vikingsDialogInfo.push({
                    reward: {
                        points: 1,
                        vikingsTaken: 1,
                    },
                    player,
                });
            }
        }

        for (const player of this.players.values()) {
            player.getData("dialogs", (oldDialogs) => {
                oldDialogs.push(dialogs.VIKINGS_REWARD);
                return oldDialogs;
            });
            this.setPlayerStatus(player, statuses.WAITING);
        }

        return this.churchEndPhase();
    }

    churchEndPhase() {
        // Faza koscioła
        /* 
            // kto ma najwięcej umieszcza klasztor (swoje miasta)
            // usuwamy mu wszystkie dyski
            // jest teraz pierwszym graczem

            // każdy zdobywa 1 punkt
            // usuwamy jeden kościół
            

            // każdy kto ma 4 dyski i więcej przymusowo stawia klasztor i usuwa wszystkie dyski
        
        
        */

        let totalChurchCount = 0;
        const churchData = [];

        for (const player of this.players.values()) {
            const playerChurchCount = player.getData("church");
            churchData.push([player, playerChurchCount]);
            totalChurchCount += playerChurchCount;
        }

        if (totalChurchCount <= 0) {
            this.gameData.churchDialogInfo = ["Brak ludzi w kościele"];
            this.addDialogToPlayers(dialogs.CHURCH);
            return this.resetEverything();
        }

        churchData.sort((b, a) => a[1] - b[1]);

        const churchRemis = churchData[0][1] === churchData[1][1];

        if (!churchRemis) {
            const winningChurchPlayer = churchData[0][0];
            this.gameData.churchQueue.push(winningChurchPlayer);
            this.gameData.churchDialogInfo.push({
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
            this.gameData.firstPlayer = winningChurchPlayer.getPlayerData();

            winningChurchPlayer.setData("church", () => 0);
        }

        for (const [player] of churchData) {
            if (player.getData("church") > 0) {
                player.setData("church", (oldChurch) => oldChurch - 1);
                player.setData("points", (oldPoints) => oldPoints + 1);
                this.gameData.churchDialogInfo.push({
                    player,
                    reward: {
                        points: 1,
                    },
                });
            }
        }

        for (const player of this.players.values()) {
            if (player.getData("church") >= 4) {
                this.gameData.churchQueue.push(player);

                this.gameData.churchDialogInfo.push({
                    player,
                    reward: {
                        cathedral: true,
                        church: -1 * player.getData("church"),
                    },
                });
                player.setData("church", () => 0);
            }
        }

        if (this.gameData.churchQueue.length > 0) {
            const player = this.gameData.churchQueue.shift();
            this.gameData.message = `${player.username} buduje katedrę`;
            this.setPlayersStatus(statuses.WAITING);
            this.setPlayerStatus(player, statuses.BUILD_CATHEDRAL);
            this.addDialogToPlayers(dialogs.CHURCH);
            this.addDialogToPlayer(player, dialogs.BUILD_CATHEDRAL);
            return this.sendGameDataToAll();
        } else {
            return this.resetEverything();
        }
    }

    chooseCathedral(data) {
        const cityId = data.data;
        const player = this.getPlayer(data.publicId);
        console.log("Wybudowaliśmy katedrę", cityId);

        const nextPlayer = this.gameData.churchQueue.shift();

        if (nextPlayer) {
            this.gameData.message = `${nextPlayer.username} buduje katedrę`;
            this.setPlayerStatus(player, statuses.WAITING);
            this.setPlayerStatus(nextPlayer, statuses.BUILD_CATHEDRAL);
            this.addDialogToPlayer(nextPlayer, dialogs.BUILD_CATHEDRAL);
            return this.sendGameDataToAll();
        } else {
            return this.resetEverything();
        }
    }

    resetEverything() {
        this.gameData.phases.marriage.current++;
        this.gameData.phases.playing.current++;

        this.gameData.currentVikings = this.getCurrentVikings();
        // dialog wikingów

        // dialog małżeństwa
        this.gameData.marriage.shift();

        this.addDialogToPlayers(dialogs.FIRST_PLAYER);
        this.addDialogToPlayers(dialogs.MARRIAGE);
        this.addDialogToPlayers(dialogs.VIKINGS);

        this.cards.resetCardDrawPhase();

        this.gameData.phases = {
            marriage: { current: 1, total: 4 },
            playing: { current: 1, total: 4 },
            current: "passing",
        };

        return this.sendGameDataToAll();
    }
}

// TO-DO:
/*
Pomijamy całkowicie fazę grania, chcemy zrobić gameplay loop i zakończenie bez używania kart
Po prostu zamiast tego odrzucimy wszystkim 4 losowe karty
Nie robimy mapy

Najpierw jednak jeszcze trzeba:
2. Pomyśleć jak mają wyglądać interfejsy (wiadomości i dialogi) na etapie wybierania gry
3. Jak informować gracza o tym, że może coś teraz zrobić.



// Przechowujemy gdzieś dane jakie dialogi wysłać do którego gracza
// w pewnych momentach wysyłamy event który dialog otworzyć. W momencie zamknięcia dialogu wysłany jest event, aby wziąć kolejny dialog do wyświetlenia.
// nie każdy dialog musi mieć request np. odrzucanie kart nie ma, bo spradzamy sami czy potem znowu nie wysłać dialogu
// na graczach będziemy przechowywać kolejkę "dialogsToShow"



*/

// DODATKOWY EVENT NA POINFORMOWANIE DIALOGIEM JAKIE KARTY OTRZYMAŁEŚ

// Animacja gdy wejdzie nowa faza wybierania kart, tak żeby ukryć że zmieniają się nagle bez dialogu

// Wymyśleć messages w turze wybierania kart
// Wymyśleć jak oddać karty

// wyrzucić wszystkie funkcje pomocnicze w game do playerHelpera we wszystkich klasach
