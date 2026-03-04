<script setup>
import Info from "./Info.vue";
import Plansza from "./Plansza.vue";

const props = defineProps(["gameData"]);
</script>

<template>
    <div class="top">
        <Plansza :game-data="gameData" />
        <Info :game-data="gameData" />
    </div>
</template>

<style scoped>
.top {
    display: flex;
    width: 100%;
    height: 500px;
}
</style>
