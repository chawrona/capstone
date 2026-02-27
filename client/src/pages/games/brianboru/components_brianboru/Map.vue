<script setup>
import Church from "./Church.vue";
import Island from "./Island.vue";
import Marriage from "./Marriage.vue";
import Players from "./Players.vue";
import Vikings from "./Vikings.vue";

const props = defineProps([
    "currentVikings",
    "marriages",
    "players",
    "church",
    "marriage",
]);
</script>

<template>
    <div class="map">
        <Vikings :vikings="props.currentVikings" />
        <Marriage :marriages="props.marriages" />
        <Players :players="props.players" />
        <Church :church="props.church" :marriage="marriage" />
        <slot />
    </div>
</template>

<style scoped>
.map {
    position: relative;
    width: 100%;
    background-color: rgb(18, 87, 214);
    background-image: url("/src/assets/games/gameAssets/brianboru/sea.png");
    height: 100%;
}
</style>
