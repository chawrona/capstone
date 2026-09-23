<script setup>
import GameSettings from "../../components/games/GameSettings.vue";
import { usePageSounds } from "../../composables/usePageSounds.js";
import useGameData from "../shared/useGameData.js";
import { useGameResize } from "../shared/useGameResize.js";

const SOUNDTRACK_URL =
    "/sounds/yetanotherhungariandefense/yetanotherhungariandefense_soundtrack.opus";
usePageSounds({
    effects: [],
    music: SOUNDTRACK_URL,
});

const { scale } = useGameResize();

const { gameData } = useGameData();
</script>

<template>
    <GameSettings />

    <div class="background">
        <div
            v-if="gameData"
            class="game"
            :style="{ transform: `scale(${scale}) translate(-50%, -50%)` }"
        >
            <!-- Komponenty gry -->
        </div>
    </div>
</template>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap");
.background {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: rgb(0, 0, 0);
    overflow: hidden;
}

.game {
    position: absolute;
    top: 50%;
    left: 50%;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 1920px;
    height: 950px;

    margin-block: auto;
    transform-origin: top left;
    font-family: "Open sans";
    overflow: hidden;

    * {
        user-select: none;
    }
}
</style>
