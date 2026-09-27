<script setup>
import { ref } from "vue";
import GameEngine from "../composables_yetanotherhungariandefense/GameEngine";
const gameRender = ref(null);
const gameEngine = new GameEngine(gameRender)
</script>

<template>
    <canvas id="game-render" ref="gameRender" class="game-render"> </canvas>
</template>

<style scoped></style>
