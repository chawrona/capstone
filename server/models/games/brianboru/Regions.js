import { cities, connections, regions } from "./config/cities.js";
import dialogs from "./config/dialogs.js";
import statuses from "./config/statuses.js";

export default class Regions {
    constructor(game) {
        this.game = game;
        this.players = this.game.players;

        this.cityUnderAttack = null;
        this.cityUnderAttackType = "";

        this.citiesToAttack = [];
        this.citiesToCathedra = [];
        this.citiesToVikings = [];
        this.citiesToBuild = [];

        this.regions = {
            // region: owner;
        };

        this.cities = {
            /* id: {
                vikings: boolean;
                cathedra: boolean;
                owner: Player;
            } */
        };
    }

    getCity(id) {
        return this.cities[id];
    }

    buildCity(id, player) {
        this.cities[id] = {
            vikings: false,
            cathedra: false,
            owner: player,
        };

        this.checkRegion(id, player);
    }

    expandCity(id, player) {
        console.log(id, player, connections);
        // budowanie miast, sprawdzanie connections
    }

    checkRegion(id, player) {
        const region = cities[id].region;
        const minCity = regions[region].minCity;
        let cityCount = 0;

        Object.values(this.cities).forEach((city) => {
            if (city.region === region) cityCount++;
        });

        if (minCity <= cityCount) {
            this.regions[region] = player;
        }
    }

    buildCathedra(id) {
        this.getCity(id).cathedra = true;
    }

    setVikings(id) {
        this.getCity(id).vikings = true;
    }

    getRegionsData() {
        const regions = {};
        Object.entries(this.regions).forEach(([region, player]) => {
            regions[region] = player ? player.getPlayerData() : null;
        });
        return regions;
    }

    getCitiesData() {
        const cities = {};
        Object.entries(this.cities).forEach(([city, cityData]) => {
            cities[city] = {
                owner: cityData.owner.getPlayerData(),
                vikings: cityData.vikings,
                cathedra: cityData.cathedra,
            };
        });
        return cities;
    }

    getMapData() {
        return {
            cityUnderAttack: this.cityUnderAttack,
            cities: this.getCitiesData(),
            regions: this.getRegionsData(),
            citiesToAttack: this.citiesToAttack,
            citiesToCathedra: this.citiesToCathedra,
            citiesToVikings: this.citiesToVikings,
            citiesToBuild: this.citiesToBuild,
            cityUnderAttackType: this.cityUnderAttackType,
        };
    }

    prepareCitiesToAttack(player) {
        const playerCardTypes = new Set(
            player.getData("cards").map((card) => card.type),
        );

        this.citiesToAttack = [...Array(44).keys()]
            .map((index) => index + 1) // liczymy od 1 miasta
            .filter(
                (cityId) =>
                    !(cityId in this.cities) &&
                    (playerCardTypes.has("gray") ||
                        playerCardTypes.has(cities[cityId].type)),
            );
    }

    // region Events

    // @event
    chooseCityToAttack(data) {
        const player = this.game.getPlayer(data.publicId);
        if (
            !player
                .getData("cards")
                .map((card) => card.type)
                .includes(cities[data.data].type) &&
            !player.getData("cards").some((card) => card.type === "gray")
        )
            throw new Error(
                "Nie masz karty, którą mógłbyś zaatakować to miasto",
            );

        this.cityUnderAttack = data.data;
        this.cityUnderAttackType = cities[this.cityUnderAttack].type;
        console.log(
            "Wybieramy typ atakowanego miasta: ",
            cities[this.cityUnderAttack].type,
            data.data,
        );

        this.citiesToAttack = [];
        const firstPlayer = this.game.gameData.firstPlayer;
        firstPlayer.setStatus(statuses.CHOOSE_FIRST_CARD);
        this.game.setMessage(`${firstPlayer.username} wybiera kartę`);
        return this.game.sendGameDataToAll();
    }

    // @event
    buildAttackedCity(data) {
        const player = this.game.getPlayer(data.publicId);

        const newCurrentPlayerIndex = this.game.playersQueue.indexOf(
            player.publicId,
        );

        this.citiesToBuild = [];

        this.buildCity(this.cityUnderAttack, player);

        this.game.gameData.firstPlayer.removeFirstPlayer();
        player.setFirstPlayer();
        this.game.gameData.firstPlayer = player;

        this.game.gameData.phases.attacking.current++;

        if (
            this.game.gameData.phases.attacking.current >
            this.game.gameData.phases.attacking.total
        ) {
            // Koniec fazy atakowania miast
            return this.game.marriages.marriagesPhaseEnd();
        } else {
            // Atakujemy miasta dalej
            this.game.cards.choosingCardsPhase = {
                current: 1,
                total: this.players.size,
            };
            this.game.addDialogToPlayers(dialogs.FIRST_PLAYER);
            player.setStatus(statuses.CHOOSE_ATTACKED_CITY);
            this.game.setMessage(`${player.username} wybiera miasto do ataku`);

            this.cityUnderAttack = null;

            this.prepareCitiesToAttack(player);

            this.game.currentPlayerIndex = newCurrentPlayerIndex;
            return this.game.sendGameDataToAll();
        }
    }

    // @event
    buildBoughtCity(data) {
        const cityId = data.data;
        const player = this.getPlayer(data.publicId);
        this.buildCity(cityId, player);
        return this.game.cards.nextCardEffect();
    }

    // @event
    removeVikings(data) {
        this.getCity(data.data).vikings = false;
        return this.game.cards.nextCardEffect();
    }
}
