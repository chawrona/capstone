<script setup>
import { computed } from "vue";

import Island from "@/assets/games/gameAssets/brianboru/MAPA.png";
import "@/styles/brianBoru.scss";

import {
    cities as gameCities,
    connections,
    regions as gameRegions,
} from "../../../../../../server/models/games/brianboru/config/cities";
import statuses from "../../../../../../server/models/games/brianboru/config/statuses";
import chooseCity from "../composables_brianboru/useBrianBoruCityActions.js";
import getCitiesColors from "../composables_brianboru/useBrianBoruCityColor.js";
import getCityState from "../composables_brianboru/useBrianBoruCityState.js";
import RegionsSVG from "./RegionsSVG.vue";
import CathedraIcon from "./svgs/CathedraIcon.vue";
import CityIcon1 from "./svgs/CityIcon1.vue";
import CityIcon2 from "./svgs/CityIcon2.vue";
import CityIcon3 from "./svgs/CityIcon3.vue";
import CityIcon4 from "./svgs/CityIcon4.vue";
import CityIcon5 from "./svgs/CityIcon5.vue";
import CityIcon6 from "./svgs/CityIcon6.vue";

const props = defineProps([
    "cityUnderAttack",
    "cityUnderAttackType",
    "cities",
    "regions",
    "citiesToAttack",
    "citiesToCathedra",
    "citiesToBuild",
    "citiesToVikings",
    "citiesToRemoveVikings",
    "status",
    "cards",
    "you",
]);

const mapWidth = 1100 * 1.08;
const mapHeight = 800 * 1.08;

const isImageVisible = (cityId) => {
    if (!props.cities[cityId]) return 0;
    if (props.cities[cityId].cathedra) return "cathedra";
    return ((cityId * 31 + props.cities[cityId].owner.turnOrder) % 6) + 1;
};
</script>

<template>
    <div
        class="island"
        :style="`--width: ${mapWidth}px; --height: ${mapHeight}px`"
    >
        <!-- <RegionsSVG
            :width="mapWidth"
            :height="mapHeight"
            class="regions"
            :regions="props.regions"
            :everything-dark="false"
        /> -->

        <template v-for="region in Object.keys(gameRegions)" :key="region">
            <div
                v-for="cityId in gameRegions[region].cities"
                :key="`${region}_${cityId}`"
                :data-type="gameCities[cityId].type"
                :class="getCityState(cityId, region, props)"
                :style="getCitiesColors(cityId, props)"
                @click="() => chooseCity(cityId, props)"
            >
                <CityIcon1
                    v-if="isImageVisible(cityId) === 1"
                    class="cityIcon"
                />
                <CityIcon2
                    v-if="isImageVisible(cityId) === 2"
                    class="cityIcon"
                />
                <CityIcon3
                    v-if="isImageVisible(cityId) === 3"
                    class="cityIcon"
                />
                <CityIcon4
                    v-if="isImageVisible(cityId) === 4"
                    class="cityIcon"
                />
                <CityIcon5
                    v-if="isImageVisible(cityId) === 5"
                    class="cityIcon"
                />
                <CityIcon6
                    v-if="isImageVisible(cityId) === 6"
                    class="cityIcon"
                />
                <CathedraIcon
                    v-if="isImageVisible(cityId) === 'cathedra'"
                    class="cityIcon"
                />
            </div>
        </template>

        <img :src="Island" alt="" class="map" />
    </div>
</template>

<style scoped lang="scss">
.island {
    top: 50%;
    left: 50%;
    transform: translate(calc(-50%), -50%);
    position: absolute;
    width: var(--width);
    height: var(--height);
}

.regions {
    z-index: 3;
}

.map {
    position: absolute;
    width: var(--width);
    height: var(--height);
    filter: drop-shadow(2px 2px 25px rgba(208, 226, 247, 0.683))
        drop-shadow(2px 2px 1px rgba(0, 0, 0, 0.864));
    z-index: 2;
}

.city {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    z-index: 6;
    box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.358);
    &::before {
        position: absolute;
        inset: -0.5rem;
        border-radius: 50%;
        content: "";
        background: rgba(255, 0, 0, 0);
        z-index: -2;
    }

    &:not(.owned) {
        background-size: cover;
        background-position: center;

        &[data-type="red"] {
            background-image: url("/src/assets/games/gameAssets/brianboru/miasto_red.png");
        }

        &[data-type="blue"] {
            background-image: url("/src/assets/games/gameAssets/brianboru/miasto_blue.png");
        }

        &[data-type="yellow"] {
            background-image: url("/src/assets/games/gameAssets/brianboru/miasto_yellow.png");
        }
    }
}

.hide {
    opacity: 0.5;
}

.canAttack,
.canCathedra,
.canVikings,
.canBuild {
    cursor: pointer;
    box-shadow: 0 0 3px 3px rgba(255, 255, 255, 0.726);
}

.owned {
    display: grid;
    place-items: center;
    box-shadow: none;
}

.cityIcon {
    position: absolute;
    width: 90%;
    z-index: 1;
    height: 90%;
}

.owned::after {
    display: grid;
    font-weight: bold;
    font-size: 1.5rem;
    width: 100%;
    height: 100%;
    place-items: center;
    content: "";
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.349);
    background: #ffffff;
    box-shadow:
        inset 0 1.5px 3px rgba(255, 255, 255, 0.576),
        /* highlight góry */ inset 0 -3px 5px rgba(0, 0, 0, 0.247),
        0 2px 3px rgba(0, 0, 0, 0.705),
        0px 0px 3px 2px rgba(0, 0, 0, 0.603);
}

.owned.cathedra {
    &::after {
        width: 110%;
        height: 110%;
        background-color: currentColor;
    }

    .cityIcon {
        transform: translateY(-2px);
        width: 70%;
    }
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

.canAttack {
    cursor: url("/src/assets/games/gameAssets/brianboru/sword.png"), pointer;
}

.attacked {
    width: 43px;
    height: 43px;
    transform: translate(-1.5px, -1.5px);

    &:not(.waiting) {
        box-shadow: 0 0 3px 3px rgba(255, 255, 255, 0.76);
    }

    &[data-type="red"]::before {
        background-color: #9a2a13;
    }

    &[data-type="blue"]::before {
        background-color: #3b74ab;
    }

    &[data-type="yellow"]::before {
        background-color: #e0c007;
    }
}

.attacked::before {
    --border-radius: 8px;
    content: "";
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    width: calc(100% - var(--border-radius));
    height: calc(100% - var(--border-radius));

    background-image: url("/src/assets/games/gameAssets/brianboru/sword.svg");
    background-size: 70%;
    background-position: center;
    background-repeat: no-repeat;
}

.attacked::after {
    --border-radius: 8px;
    display: grid;
    font-weight: bold;
    font-size: 1.5rem;
    width: calc(300% + var(--border-radius));
    height: calc(300% + var(--border-radius));
    transform: translate(
        calc(-1 / 2 * var(--border-radius)),
        calc(-1 / 2 * var(--border-radius))
    );

    background-image: url("/src/assets/games/gameAssets/brianboru/first_player.png");
    background-size: contain;
    place-items: center;
    content: "";
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
}

.attackedHover:hover {
    filter: grayscale(1);
    box-shadow: 0 0 5px 4px rgba(0, 0, 0, 0.788);

    &::after {
        width: 70%;
        height: 70%;
        background-image: url("/src/assets/games/gameAssets/brianboru/flame-lit.gif");
        background-size: contain;
        place-items: center;
        content: "";
        position: absolute;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;
        z-index: 2;
    }
}

.canBuild:not(.owned) {
    box-shadow: 0 0 5px 4px rgb(255, 255, 255);

    &::after {
        display: grid;
        font-weight: bold;
        font-size: 1.5rem;
        width: 100%;
        height: 100%;
        place-items: center;
        content: "";
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.349);
        background-color: #9c9c9c;
        box-shadow:
            inset 0 2px 3px rgb(255, 255, 255),
            /* highlight góry */ inset 0 -3px 5px rgba(0, 0, 0, 0.247),
            0 2px 3px rgba(0, 0, 0, 0.705),
            0px 0px 3px 2px rgba(0, 0, 0, 0.603);
        background-image: url("/src/assets/games/gameAssets/brianboru/hammer.png");
        background-size: 65%;
        background-repeat: no-repeat;
        background-position: center;
    }

    &:hover::after {
        background-color: hsl(from var(--hoverColor) h s calc(l * 1));
    }
}

.owned.canCathedra {
    .cityIcon {
        display: none;
    }

    &::after {
        color: currentColor;
        background: rgb(5, 3, 104);
        background-image: url("/src/assets/games/gameAssets/brianboru/church_white.png");
        background-size: 55%;
        background-repeat: no-repeat;
        background-position: center;
        box-shadow:
            inset 0 1.5px 3px rgba(97, 120, 253, 0.699),
            inset 0 -3px 5px rgba(0, 0, 0, 0.247),
            0 2px 3px rgba(0, 0, 0, 0.308),
            0 0 3px 3px rgba(255, 255, 255, 0.877);
    }

    &:hover::after {
        color: gold;
        background-color: rgb(209, 155, 6);
        box-shadow:
            inset 0 1.5px 3px rgba(237, 253, 97, 0.699),
            inset 0 -3px 5px rgba(0, 0, 0, 0.247),
            0 2px 3px rgba(0, 0, 0, 0.308),
            0 0 3px 3px #ffffffe0;
    }
}

.owned.canVikings {
    .cityIcon {
        display: none;
    }

    &::after {
        color: currentColor;
        background: rgba(75, 1, 1, 0);
        background-image: url("/src/assets/games/gameAssets/brianboru/vikings.png");
        background-size: 110%;
        background-repeat: no-repeat;
        background-position: center;
        box-shadow:
            inset 0 1.5px 3px rgba(255, 255, 255, 0.699),
            inset 0 -3px 5px rgba(0, 0, 0, 0.247),
            0 2px 3px rgba(0, 0, 0, 0.308),
            0 0 3px 3px rgb(255, 255, 255);
    }

    &:hover::after {
        filter: brightness(0.8);
    }
}

.owned.vikings {
    background-color: currentColor;
    color: red;

    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;

    &::after {
        content: "";
        width: 100%;
        height: 100%;
        filter: drop-shadow(1px 1px 2px rgba(33, 36, 1, 0.252));

        background-image: url("/src/assets/games/gameAssets/brianboru/axe_white.png");
        background-size: 65%;
        background-repeat: no-repeat;
        background-position: center;

        background-color: transparent;

        box-shadow:
            inset 0 1.5px 3px rgba(255, 255, 255, 0.411),
            /* highlight góry */ inset 0 -3px 5px rgba(0, 0, 0, 0.247),
            0 2px 3px rgba(0, 0, 0, 0.705),
            0px 0px 3px 2px rgba(0, 0, 0, 0.603);
    }

    .cityIcon {
        display: none;
    }
}

.owned.vikings.cathedra {
    .cityIcon {
        display: block;
        filter: invert(1);
        z-index: -1;
    }
}

.owned.vikings.removeVikingsHover {
    cursor: pointer;
    box-shadow: 0 0 3px 3px rgba(255, 255, 255, 0.76);
    &::after {
        box-shadow:
            inset 0 1.5px 3px rgba(255, 255, 255, 0.411),
            /* highlight góry */ inset 0 -3px 5px rgba(0, 0, 0, 0.247);
    }

    &:hover {
        &::after {
            filter: brightness(1.1);
            background-image: url("/src/assets/games/gameAssets/brianboru/viking_shield.png");
        }
    }
}
</style>
