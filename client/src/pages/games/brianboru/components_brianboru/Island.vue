<script setup>
import Island from "@/assets/games/gameAssets/brianboru/MAPA.png";
import "@/styles/brianBoru.scss";
import { useAppStore } from "@/store/useAppStore";

import {
    cities as gameCities,
    connections,
    regions as gameRegions,
} from "../../../../../../server/models/games/brianboru/config/cities";
import statuses from "../../../../../../server/models/games/brianboru/config/statuses";
import RegionsSVG from "./RegionsSVG.vue";
const store = useAppStore();
const props = defineProps([
    "cityUnderAttack",
    "cityUnderAttackType",
    "cities",
    "regions",
    "citiesToAttack",
    "citiesToCathedra",
    "citiesToVikings",
    "status",
    "cards",
]);

const mapWidth = 1100 * 1.08;
const mapHeight = 800 * 1.08;

const getOwnerColor = (city) => {
    if (props.cities[city]) return props.cities[city].owner.color.hex;
};

const chooseCity = (cityId) => {
    if (
        statuses.BUILD_ATTACKED_CITY === props.status &&
        cityId === props.cityUnderAttack
    ) {
        return store.emit("gameData", {
            data: cityId,
            eventName: "buildAttackedCity",
        });
    }

    let eventName;

    switch (props.status) {
        case statuses.BUILD_CATHEDRAL:
            if (!props.citiesToCathedra.includes(cityId)) {
                alert("Nie wolno wybrać tego miasta do budowy katedry!");
                return;
            }
            eventName = "chooseCathedral";
            break;
        case statuses.VIKINGS_SOMEONE_CITY:
            if (!props.citiesToVikings.includes(cityId)) {
                alert("Nie wolno wysłać wikingów do tego miasta!");
                return;
            }
            eventName = "chooseSomeoneCityToVikings";
            break;
        case statuses.VIKINGS_YOUR_CITY:
            if (!props.citiesToVikings.includes(cityId)) {
                alert("Nie wolno wysłać wikingów do swojego miasta!");
                return;
            }
            eventName = "chooseYourCityToVikings";
            break;
        case statuses.CHOOSE_ATTACKED_CITY:
            if (!props.citiesToAttack.includes(cityId)) {
                alert("Nie wolno zaatakować tego miasta!");
                return;
            }
            eventName = "chooseCityToAttack";
            break;
        default:
            return; // opcjonalnie dla nieznanego statusu
    }

    // dalsza logika z eventName

    store.emit("gameData", {
        data: cityId,
        eventName,
    });
};
</script>

<template>
    <!-- <pre> -->
    <!-- {{ `${props.cityUnderAttack}` }} -->
    <!-- {{ props.cities }} -->
    <!-- {{ props.regions }} -->

    <!-- </pre> -->
    <div
        class="island"
        :style="`--width: ${mapWidth}px; --height: ${mapHeight}px`"
    >
        <RegionsSVG :width="mapWidth" :height="mapHeight" class="regions" />
        <!-- <pre> 
            <{{ props.cities }} 
             {{ Object.keys(statuses).find(key => statuses[key] === props.status) }} 
       </pre> -->
        <template v-for="region in Object.keys(gameRegions)" :key="region">
            <div
                v-for="city in gameRegions[region].cities"
                :key="`${region}_${city}`"
                class="city"
                :data-type="gameCities[city].type"
                :class="[
                    {
                        attacked: props.cityUnderAttack === city,
                        cathedra: props.cities[city]?.cathedra,
                        owned: Boolean(props.cities[city]),
                        vikings: props.cities[city]?.vikings,
                        buildHover:
                            props.status === statuses.BUILD_ATTACKED_CITY &&
                            city === props.cityUnderAttack,
                        attackedHover:
                            props.citiesToAttack.includes(city) &&
                            props.status === statuses.CHOOSE_ATTACKED_CITY,
                        cathedraHover:
                            props.status === statuses.BUILD_CATHEDRAL,
                        vikingsHover:
                            props.status === statuses.VIKINGS_SOMEONE_CITY ||
                            props.status === statuses.VIKINGS_YOUR_CITY,
                        canAttack:
                            props.citiesToAttack.includes(city) &&
                            props.status === statuses.CHOOSE_ATTACKED_CITY,
                        canCathedra: props.citiesToCathedra.includes(city),
                        canVikings: props.citiesToVikings.includes(city),
                    },
                    `${region.replace(/\s+/g, '')}_${city}`,
                ]"
                :style="`--owner: ${getOwnerColor(city)}`"
                @click="() => chooseCity(city)"
            />
        </template>

        <img :src="Island" alt="" class="map" />

        <!-- <div class="grid-container">
            <div 
                v-for="n in 400" 
                :key="n" 
                class="grid-item"
                >
                 {{ (Math.floor((n - 1) / 20) / 19 * 100).toFixed(0) }}% {{ (( (n - 1) % 20 ) / 19 * 100).toFixed(0) }}%
            </div>
        </div> -->
    </div>
</template>

<style scoped lang="scss">
.grid-container {
    position: absolute;
    inset: 0;
    display: grid;
    z-index: 5;
    font-size: 0.7rem;
    grid-template-columns: repeat(20, 1fr);
    grid-template-rows: repeat(20, 1fr);
    gap: 0; /* brak odstępów między komórkami */
}

.grid-item {
    border: 1px solid #333; /* widoczny border */
    display: flex;
    justify-content: center;
    align-items: center;

    box-sizing: border-box;
    font-weight: bold;
}

.island {
    // background-color: #ffffff4e;
    top: 50%;
    left: 50%;
    transform: translate(calc(-50%), -50%);
    position: absolute;
    // background-color: #ffffff69;
    width: var(--width);
    height: var(--height);
}

.regions {
    z-index: 3;
}

.region {
    inset: 0;
    position: absolute;
    z-index: 6;
}

.map {
    z-index: 2;
}

.map {
    position: absolute;
    width: var(--width);
    height: var(--height);
    filter: drop-shadow(2px 2px 25px rgba(208, 226, 247, 0.683))
        drop-shadow(2px 2px 1px rgba(0, 0, 0, 0.864));
}

.city {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    z-index: 6;
    box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.358);
}

[data-type="red"] {
    background-image: url("/src/assets/games/gameAssets/brianboru/miasto_red.png");
    background-size: cover;
    background-position: center;
}
[data-type="blue"] {
    background-image: url("/src/assets/games/gameAssets/brianboru/miasto_blue.png");
    background-size: cover;
    background-position: center;
}
[data-type="yellow"] {
    background-image: url("/src/assets/games/gameAssets/brianboru/miasto_yellow.png");
    background-size: cover;
    background-position: center;
}

.vikings::after {
    display: grid;
    font-weight: bold;
    font-size: 1.5rem;
    place-items: center;
    content: "V";
    position: absolute;
    inset: 0;
    background-color: rgba(255, 0, 0, 0.51);
    border-radius: 50%;
}

.owned {
    display: grid;
    place-items: center;
}

.owned::after {
    display: grid;
    font-weight: bold;
    font-size: 1.5rem;
    width: 70%;
    height: 70%;
    place-items: center;
    content: "";
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.349);
    background-color: hsl(from var(--owner) h s calc(l * 1));
    box-shadow:
        inset 0 1.5px 3px rgba(255, 255, 255, 0.576),
        /* highlight góry */ inset 0 -3px 5px rgba(0, 0, 0, 0.247),
        0 2px 3px rgba(0, 0, 0, 0.308);
}

.cathedraHover:hover::after,
.cathedra::after {
    --border-radius: 8px;
    display: grid;
    font-weight: bold;
    font-size: 1.5rem;
    width: calc(100% + var(--border-radius));
    height: calc(100% + var(--border-radius));
    transform: translate(
        calc(-1 / 2 * var(--border-radius)),
        calc(-1 / 2 * var(--border-radius))
    );
    border: var(--border-radius) solid rgb(23, 103, 143);
    place-items: center;
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
}

.attackedHover:hover::after,
.attacked::after {
    --border-radius: 8px;
    display: grid;
    font-weight: bold;
    font-size: 1.5rem;
    width: calc(100% + var(--border-radius));
    height: calc(100% + var(--border-radius));
    transform: translate(
        calc(-1 / 2 * var(--border-radius)),
        calc(-1 / 2 * var(--border-radius))
    );
    // border: var(--border-radius) solid rgb(143, 23, 75);

    box-shadow: 0 0 5px 3px rgba(255, 255, 255, 0.753);

    background-image: url("/src/assets/games/gameAssets/brianboru/first_player.png");
    background-size: contain;
    place-items: center;
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
}

.canAttack,
.canCathedra,
.canVikings,
.buildHover::after {
    cursor: pointer;
    box-shadow: 0 0 5px 4px rgba(255, 255, 255, 0.485);
}
</style>
