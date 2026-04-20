import cards from "./config/cards.js";
import marriages from "./config/marriages.js";
export default class Debug {
    constructor(game) {
        this.game = game;
        this.players = game.players;
    }

    run(data) {
        // console.log(data);
        // return this.game.sendGameDataToAll();
        const command = data.data;
        const player = this.game.getPlayer(data.publicId);

        if (command[0] !== "/") {
            return [
                {
                    target: data.publicId,
                    data: "Nieprawidłowa komenda",
                    eventName: "debug",
                },
            ];
        }

        let dataToSend = undefined;

        try {
            const commandArguments = command.replace("/", "").split(" ");
            dataToSend = this[commandArguments.shift()](
                player,
                commandArguments,
            );
        } catch (error) {
            return [
                {
                    target: data.publicId,
                    data: error.message,
                    eventName: "debug",
                },
            ];
        }

        return [
            ...this.game.sendGameDataToAll(),
            {
                target: data.publicId,
                data: dataToSend ?? "Prawidłowa komenda",
                eventName: "debug",
            },
        ];
    }

    addCards(player, givenCards) {
        for (const card of givenCards) {
            player.setData("cards", (oldCards) => [
                ...oldCards,
                structuredClone(cards)[Number(card) - 1],
            ]);
        }
    }

    removeCards(player, cards) {
        for (const card of cards) {
            player.setData("cards", (oldCards) =>
                oldCards.filter((c) => c.id !== Number(card)),
            );
        }
    }

    setGamePhase(player, ph) {
        const phase = ph[0];
        if (phase === "last")
            return (this.game.gameData.phases.playing.current =
                this.game.gameData.phases.playing.total);

        if (
            Number(
                phase < 1 ||
                    Number(phase > this.game.gameData.phases.playing.total),
            )
        )
            throw new Error("Nieprawidłowa faza");

        this.game.gameData.phases.playing.current = Number(phase);
    }

    setAttackingPhase(_, ph) {
        const phase = ph[0];
        if (phase === "last")
            return (this.game.gameData.phases.attacking.current =
                this.game.gameData.phases.attacking.total);

        if (
            Number(
                phase < 1 ||
                    Number(phase > this.game.gameData.phases.attacking.total),
            )
        )
            throw new Error("Nieprawidłowa faza");

        this.game.gameData.phases.attacking.current = Number(phase);
    }

    setMarriage(_, fn) {
        const fianceeName = fn[0];

        console.log(
            fianceeName,
            !structuredClone(marriages).find(
                (fiancee) => fiancee.name === fianceeName,
            ),
        );

        if (
            !structuredClone(marriages).find(
                (fiancee) => fiancee.name === fianceeName,
            )
        )
            throw new Error("Nieprawidłowe imię");

        this.game.marriages.marriage[0] = structuredClone(marriages).find(
            (fiancee) => fiancee.name === fianceeName,
        );
    }

    debugEstrid() {
        this.setMarriage(undefined, ["Estrid"]);
        this.setAttackingPhase(undefined, ["last"]);
    }

    debugGameEnd() {
        this.setAttackingPhase(undefined, ["last"]);
        this.setGamePhase(undefined, ["last"]);
        this.debugEstrid();
        this.game.vikings.currentVikings = 0;
        this.buildCities();
    }

    getProperty(player, data) {
        const pd = data.map((d) => {
            return !isNaN(d) && d !== "" ? Number(d) : d;
        });

        if (pd.length === 1) return this.game[pd[0]];
        if (pd.length === 2) return this.game[pd[0]][pd[1]];
        if (pd.length === 3) return this.game[pd[0]][pd[1]][pd[2]];
        if (pd.length === 4) return this.game[pd[0]][pd[1]][pd[2]][pd[3]];
        if (pd.length === 5)
            return JSON.stringify(this.game[pd[0]][pd[1]][pd[2]][pd[3]][pd[4]]);

        return "Nieznana własność";
    }

    setProperty(player, data) {
        eval(data.join(" "));
    }

    buildCities() {
        let i = 0;
        let ids = [17, 18, 19, 20, 21, 22];
        for (const player of this.game.players.values()) {
            this.game.regions.buildCity(ids[i++], player);
            this.game.regions.buildCity(ids[i++], player);
        }
    }

    buildCity(player, data) {
        this.game.regions.buildCities(data, player);
    }
}
