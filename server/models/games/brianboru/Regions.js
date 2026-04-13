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
        this.citiesToRemoveVikings = [];
        this.citiesToBuild = [...Array(53).keys()].map((index) => index + 1);

        this.blockedRegions = [];
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

        player.setData("canExpand", () => this.canPlayerExpand(player));

        this.checkRegion(id, player);
    }

    canPlayerExpand(player) {
        return Object.entries(this.cities)
            .filter(([, city]) => city.owner.publicId === player.publicId)
            .some(([cityId]) =>
                connections[cityId].some(
                    (connCity) => !(connCity in this.cities),
                ),
            );
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
            cityUnderAttackType: this.cityUnderAttackType,
            cities: this.getCitiesData(),
            regions: this.getRegionsData(),
            citiesToAttack: this.citiesToAttack, // done
            citiesToCathedra: this.citiesToCathedra, // done
            citiesToVikings: this.citiesToVikings, // done
            citiesToBuild: this.citiesToBuild, //done
            citiesToRemoveVikings: this.citiesToRemoveVikings, // done
        };
    }

    doesPlayerHasVikings(player) {
        for (const city of Object.values(this.cities)) {
            if (city.owner.publicId === player.publicId && city.vikings)
                return true;
        }
        return false;
    }

    doesPlayerHasCityForCathedral(player) {
        for (const city of Object.values(this.cities)) {
            if (city.owner.publicId === player.publicId && !city.vikings)
                return true;
        }
        return false;
    }

    prepareCitiesToAttack(player) {
        const playerCardTypes = new Set(
            player.getData("cards").map((card) => card.type),
        );

        this.citiesToAttack = [...Array(53).keys()]
            .map((index) => index + 1) // liczymy od 1 miasta
            .filter(
                (cityId) =>
                    !(cityId in this.cities) &&
                    (playerCardTypes.has("gray") ||
                        playerCardTypes.has(cities[cityId].type)),
            );
    }

    setCitiesToCathedra(player) {
        const citiesToCathedra = [];

        for (const [id, city] of Object.entries(this.cities)) {
            if (
                city.owner.publicId === player.publicId &&
                city.vikings === false &&
                city.cathedra === false
            ) {
                citiesToCathedra.push(Number(id));
            }
        }

        this.citiesToCathedra = citiesToCathedra;
    }

    setCitiesToVikings(player) {
        const citiesToVikings = [];

        for (const [id, city] of Object.entries(this.cities)) {
            if (
                city.owner.publicId === player.publicId &&
                city.vikings === false
            ) {
                citiesToVikings.push(Number(id));
            }
        }

        this.citiesToVikings = citiesToVikings;
    }

    setCitiesToRemoveVikings(player) {
        const citiesToRemoveVikings = [];

        for (const [id, city] of Object.entries(this.cities)) {
            if (city.owner.publicId === player.publicId && city.vikings) {
                citiesToRemoveVikings.push(Number(id));
            }
        }

        this.citiesToRemoveVikings = citiesToRemoveVikings;
    }

    setCitiesToBuy(player) {
        const checkIfAtLeastOneOwnersNeighbourCity = (cityId) => {
            for (const city of connections[cityId]) {
                if (
                    city in this.cities &&
                    this.cities[city].owner.publicId === player.publicId
                ) {
                    return true;
                }
            }
            return false;
        };

        this.citiesToBuild = [...Array(53).keys()]
            .map((index) => index + 1)
            .filter(
                (cityId) =>
                    !(cityId in this.cities) &&
                    cityId !== this.game.regions.cityUnderAttack &&
                    checkIfAtLeastOneOwnersNeighbourCity(cityId),
            );
    }

    setCitiesToBuildInRegion(player, region) {
        this.citiesToBuild = [...Array(53).keys()]
            .map((index) => index + 1)
            .filter(
                (cityId) =>
                    !(cityId in this.cities) &&
                    regions[region].cities.includes(cityId),
            );

        if (this.citiesToBuild.length === 0) return false;
        return true;
    }

    setCitiesToBuildAnywhere() {
        this.citiesToBuild = [...Array(53).keys()]
            .map((index) => index + 1)
            .filter((cityId) => !(cityId in this.cities));
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

    buildAttackedCity(player) {
        const newCurrentPlayerIndex = this.game.playersQueue.indexOf(
            player.publicId,
        );

        this.game.currentPlayerIndex = newCurrentPlayerIndex;

        this.citiesToBuild = [];

        this.buildCity(this.cityUnderAttack, player);

        this.game.gameData.firstPlayer.removeFirstPlayer();
        player.setFirstPlayer();

        this.game.gameData.firstPlayer = player;

        this.game.gameData.phases.attacking.current++;

        this.cityUnderAttack = null;
        this.cityUnderAttackType = "";

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

            this.prepareCitiesToAttack(player);
            return this.game.sendGameDataToAll();
        }
    }

    // @event
    buildFirstCity(data) {
        const cityId = data.data;
        const player = this.game.getPlayer(data.publicId);

        this.buildCity(cityId, player);
        const region = cities[cityId].region;

        this.blockedRegions = [
            cityId,
            ...this.blockedRegions,
            ...regions[region].cities,
        ];

        console.log(this.blockedRegions);

        this.citiesToBuild = [...Array(53).keys()]
            .map((index) => index + 1)
            .filter((cityId) => !this.blockedRegions.includes(cityId));

        this.regions[region] = player;

        if (!this.firstPlayer) {
            this.firstPlayer = player.publicId;
        }

        player.setStatus(statuses.WAITING);

        const nextPlayer = this.game.getNextPlayer(player.publicId);

        console.log(nextPlayer.publicId, this.firstPlayer);

        if (nextPlayer.publicId === this.firstPlayer) {
            this.regions = {};
            return this.game.cards.startRejectPhase();
        }

        this.game.setMessage(`${nextPlayer.username} buduje pierwsze miasto`);
        nextPlayer.setStatus(statuses.BUILD_FIRST_CITY);

        return this.game.sendGameDataToAll();
    }

    // @event
    buildBoughtCity(data) {
        const cityId = data.data;
        const player = this.game.getPlayer(data.publicId);
        this.buildCity(cityId, player);
        this.citiesToBuild = [];
        player.setStatus(statuses.WAITING);
        return this.game.cards.nextCardEffect();
    }

    // @event
    removeVikings(data) {
        const cityId = data.data;
        this.getCity(cityId).vikings = false;
        const player = this.game.getPlayer(data.publicId);
        player.setStatus(statuses.WAITING);
        return this.game.cards.nextCardEffect();
    }
}
