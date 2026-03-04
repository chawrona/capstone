<script setup>
import Decyzje from "./Decyzje.vue";
import Filantropia from "./Filantropia.vue";
import Karty from "./Karty.vue";

const karty = ["herbata", null, "sol", "sol"];
const hajs = 40;

const props = defineProps(["gameData"]);
</script>

<template>
    <div class="mid">
        <Karty :game-data="props.gameData" />
        <Decyzje :game-data="props.gameData" />
        <Filantropia :hajs="hajs" :karty="karty" :game-data="props.gameData" />
    </div>
</template>

<style scoped>
.mid {
    display: flex;
    width: 100%;
    height: 23%;
}
</style>
