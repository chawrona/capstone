<script setup>
import "@/styles/philanthropists.scss";

import { watch } from "vue";

import { soundBus } from "../../../audio/soundBus";
import PauseScreen from "../../../components/common/PauseScreen.vue";
import { usePageSounds } from "../../../composables/usePageSounds";
import { useGamePause } from "../composables_games/useGamePause";
import { useGameResize } from "../composables_games/useGameResize";
import Bottom from "./Bottom/Bottom.vue";
import useGameData from "./composables_philanthropists/useGameData";
import Mid from "./Mid/Mid.vue";
import PodsumowanieFazy from "./PodsumowanieFazy.vue";
import Top from "./Top/Top.vue";

usePageSounds({
    effects: [
        { name: "buy", poolSize: 3, url: "/sounds/philanthropists/buy.mp3" },
        { name: "sell", poolSize: 3, url: "/sounds/philanthropists/sell.mp3" },
        { name: "tick", url: "/sounds/philanthropists/tick.mp3" },
        { name: "turn", url: "/sounds/philanthropists/turn.mp3" },
        { name: "give", url: "/sounds/philanthropists/give.mp3" },
    ],
    music: [
        { name: "soundtrack", url: "/sounds/philanthropists/soundtrack.mp3" },
    ],
});

const { scale } = useGameResize();
const { isPaused } = useGamePause();
const { gameData } = useGameData();

watch(
    () => gameData.value?.twojaTura,
    (neww) => {
        if (neww) soundBus.playEffect("turn");
        if (neww) console.log("xddddddddddddddddddddddd");
    },
);

watch(
    () => gameData.value?.soundToPlay,
    (neww) => {
        console.log("TUTAJ: ", neww);

        if (neww === "buy1") soundBus.playEffect("buy");
        if (neww === "buy2") soundBus.playEffect("buy");
        if (neww === "buy3") soundBus.playEffect("buy");
        if (neww === "sell1") soundBus.playEffect("sell");
        if (neww === "sell2") soundBus.playEffect("sell");
        if (neww === "sell3") soundBus.playEffect("sell");
        if (neww === "manipulate1") soundBus.playEffect("buy");
        if (neww === "manipulate2") soundBus.playEffect("buy");
        if (neww === "filantropia") soundBus.playEffect("give");
    },
);
</script>

<template>
    <PauseScreen v-if="isPaused" />
    <PodsumowanieFazy v-if="gameData" :game-data="gameData" />
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
