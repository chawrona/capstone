<script setup>
// import Island from "@/assets/games/gameAssets/brianboru/map.png";
import {
    cities as gameCities,
    connections,
    regions as gameRegions,
} from "../../../../../../server/models/games/brianboru/config/cities";

const props = defineProps([
    "cityUnderAttack",
    "cities",
    "regions",
    "citiesToAttack",
    "citiesToCathedra",
    "status",
]);

const maxWidth = 850;
const maxHeight = 1050;
const types = ["red", "blue", "yellow"];
const citySize = 40; // px
const minDistance = citySize; // minimalna odległość między środkami

// backend będzie przesyłał dane:
// id miasta atakowanego
// lista miast które mają wikingów
// lista miast, które mają właścicieli

const getOwnerColor = (city) => {
    if (props.cities[city]) return props.cities[city].owner.color;
};

// jeżeli status wybieranie miasta do ataku - hover na możliwe miasta

// jeżeli status wybieranie miasta do katedry - hover na możliwe miasta
</script>

<template>
    <pre>
        {{ `${props.cityUnderAttack}` }}
        {{ props.cities }}
        {{ props.regions }}
    </pre>
    <div class="island">
        <div
            v-for="region in Object.keys(regions)"
            :key="region"
            class="region"
            :class="region"
        >
            <p class="regionName">{{ region }}</p>
            <div
                v-for="city in gameRegions[region].cities"
                :key="`${region}_${city}`"
                class="city"
                :data-type="gameCities[city].type"
                :class="{
                    attacked: props.cityUnderAttack === city,
                    cathedra: props.cities[city]?.cathedra,
                    owned: Boolean(props.cities[city]),
                    vikings: props.cities[city]?.vikings,
                    attackedHover:
                        props.status === statuses.CHOOSE_ATTACKED_CITY,
                    cathedraHover: props.status === statuses.BUILD_CATHEDRAL,
                    canAttack: props.citiesToAttack.includes(city),
                    canCathedra: props.citiesToCathedra.includes(city),
                }"
                :style="`--owner: ${getOwnerColor(city)}`"
            />
        </div>

        <!-- <img :src="Island" alt="" class="map" /> -->
        <!-- <div
            v-for="(city, index) in cities"
            :key="index"
            class="city"
            :class="{
                vikings: city.vikings,
                occupied: !!ownerColor,
            }"
            :data-type="city.type"
            :style="{
                '--x': city.x + 'px',
                '--y': city.y + 'px',
                '--ownerColor': city.ownerColor,
            }"
        ></div> -->
    </div>
</template>

<style scoped lang="scss">
.island {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    gap: 1rem;
    top: 50%;
    left: 50%;
    transform: translate(calc(-50%), -50%);
    position: absolute;
    width: 1100px;
    height: 900px;
    /* background-color: #ffffff69; */
}

.city {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.358);
}

.region {
    position: relative;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.237);
    width: 250px;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: start;
    align-content: start;
    height: 250px;
}

.regionName {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    font-weight: bold;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.415);
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
    background-color: var(--owner);
    border-radius: 50%;
}

.cathedraHover::after,
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

.attackedHover::after,
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
    border: var(--border-radius) solid rgb(143, 23, 75);
    place-items: center;
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
}
</style>
