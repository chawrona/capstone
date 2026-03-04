<script setup>
import "@/styles/philanthropists.scss";

import PauseScreen from "../../../components/common/PauseScreen.vue";
import { usePageSounds } from "../../../composables/usePageSounds";
import useGameData from "../brianboru/composables_brianboru/useGameData";
import { useGamePause } from "../composables_games/useGamePause";
import { useGameResize } from "../composables_games/useGameResize";
import Bottom from "./Bottom/Bottom.vue";
import Mid from "./Mid/Mid.vue";
import Top from "./Top/Top.vue";

const SOUNDTRACK_URL = "/sounds/brianboru.mp3";
usePageSounds({
    music: [{ name: "soundtrack", url: SOUNDTRACK_URL }],
});

const { scale } = useGameResize();
const { isPaused } = useGamePause();
const { gameData } = useGameData();
</script>

<template>
    <PauseScreen v-if="isPaused" />
    <PodsumowanieFazy />
    <div class="background">
        <div
            v-if="gameData"
            class="game"
            :style="{ transform: `scale(${scale})` }"
        >
            <Top :game-data="gameData" />
            <Mid :game-data="gameData" />
            <Bottom :game-data="gameData" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.background {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100vh;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url("/src/assets/games/gameAssets/brianboru/background.webp");

    overflow: hidden;
}

.game {
    background-color: #ffffffbf;
    position: relative;

    width: 1920px;
    height: 1080px;
    margin-block: auto;
    transform-origin: top left;
    font-family: "Open sans";
    background-image: url("/public/assets/games/gameAssets/philanthropists/podstawka2.jpg");

    * {
        user-select: none;
    }
}
</style>
