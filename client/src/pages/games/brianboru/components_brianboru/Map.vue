<script setup>
import { onMounted, onUnmounted, ref } from "vue";

import Farmland from "@/assets/games/gameAssets/brianboru/farmland.gif";
import Mill from "@/assets/games/gameAssets/brianboru/mill.gif";
import Mine from "@/assets/games/gameAssets/brianboru/mine.gif";

import Church from "./Church.vue";
import Island from "./Island.vue";
import Marriage from "./Marriage.vue";
import Players from "./Players.vue";
import Points from "./Points.vue";
import Regions from "./Regions.vue";
import Vikings from "./Vikings.vue";

const props = defineProps([
    "currentVikings",
    "marriages",
    "players",
    "church",
    "marriage",
    "you",
    "regions",
]);

const showIcons = ref(true);

const handleKeyPress = (event) => {
    if (event.key === "h") showIcons.value = !showIcons.value;
};

onMounted(() => {
    window.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyPress);
});

const buildings = ref([
    {
        id: 3,
        name: "Pole uprawne 1",
        src: Farmland,
        x: 657,
        y: 642,
    },
    {
        id: 4,
        name: "Pole uprawne 2",
        src: Farmland,
        x: 675,
        y: 657,
    },
    {
        id: 5,
        name: "Pole uprawne 3",
        src: Farmland,
        x: 651,
        y: 665,
    },
    {
        id: 6,
        name: "Pole uprawne 4",
        src: Farmland,
        x: 800,
        y: 731,
    },
    {
        id: 7,
        name: "Pole uprawne 5",
        src: Farmland,
        x: 822,
        y: 748,
    },
    {
        id: 8,
        name: "Młyn 1",
        src: Mill,
        x: 690,
        y: 615,
    },
    {
        id: 9,
        name: "Młyn 2",
        src: Mill,
        x: 596,
        y: 751,
    },
    {
        id: 10,
        name: "Młyn 3",
        src: Mill,
        x: 629,
        y: 796,
    },
    {
        id: 11,
        name: "Kopalnia Północna 1",
        src: Mine,
        x: 1139,
        y: 101,
    },
    {
        id: 12,
        name: "Kopalnia Północna 2",
        src: Mine,
        x: 1198,
        y: 215,
    },
    {
        id: 13,
        name: "Kopalnia Północna 3",
        src: Mine,
        x: 1169,
        y: 347,
    },
]);
</script>

<template>
    <div class="map">
        <Vikings :vikings="props.currentVikings" :players="props.players" />
        <Marriage :marriages="props.marriages" :players="props.players" />
        <Players :players="props.players" :you="props.you" />
        <Church :church="props.church" :marriage="marriage" />
        <Regions />
        <slot :hide="!showIcons" />
        <Points :regions="props.regions" />
        <div v-if="showIcons">
            <img
                v-for="building in buildings"
                :key="building.id"
                :src="building.src"
                class="map-building"
                :style="{ top: building.y + 'px', left: building.x + 'px' }"
                :alt="building.name"
            />
        </div>
    </div>
</template>

<style scoped>
.map {
    position: relative;
    width: 100%;
    height: 100%;
}

.map-building {
    position: absolute;
    height: 32px;
    width: 32px;
    transform: translate(-8px, -8px);
    opacity: 0.8;
}
</style>
