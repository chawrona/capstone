<script setup>
import Czat from "./Czat.vue";
import Stolik from "./Stolik.vue";

const props = defineProps(["gameData"]);
</script>

<template>
    <div class="info">
        <div class="container">
            <Stolik :game-data="gameData" />
            <Czat :game-data="gameData" />
        </div>
    </div>
</template>

<style scoped>
.info {
    height: 100%;
    width: 22.5%;
    padding: 1rem;
}

.container {
    height: 100%;
    width: 100%;
    box-shadow: 0 0 8px 8px rgba(0, 0, 0, 0.505);
    border-radius: 1rem;
    overflow: hidden;
}
</style>
