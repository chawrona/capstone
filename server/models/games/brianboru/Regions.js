import { cities, connections, regions } from "./config/cities.js";

export default class Regions {
    constructor(game) {
        this.game = game;
        this.players = this.game.players;

        this.cityUnderAttack = null;

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

    removeVikings(id) {
        this.getCity(id).vikings = false;
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
        Object.entries(this.cities).forEach(([city, player]) => {
            cities[city] = player ? player.getPlayerData() : null;
        });
        return cities;
    }

    getMapData() {
        return {
            cityUnderAttack: this.cityUnderAttack,
            cities: this.getCitiesData(),
            regions: this.getRegionsData(),
            citiesToAttack: [],
            citiesToCathedra: [],
        };
    }
}
