<script setup>
import { ref } from "vue";

import useGameRender from "../composables_yetanotherhungariandefense/useGameRender";

const gameRender = ref(null);
useGameRender(gameRender);
</script>

<template>
    <canvas id="game-render" ref="gameRender" class="game-render"> </canvas>
</template>

<style scoped></style>
