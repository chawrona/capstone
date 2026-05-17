<script setup>
import PauseScreen from "../../../components/common/PauseScreen.vue";
import PlaySoundtrack from "../../../components/common/PlaySoundtrack.vue";
import Settings from "../../../components/common/Settings.vue";
import { usePageSounds } from "../../../composables/usePageSounds";
import { useGamePause } from "../composables_games/useGamePause";
import { useGameResize } from "../composables_games/useGameResize";
import Board from "./Board.vue";
import useGameData from "./composables_craftsmen/useGameData";
import Contracts from "./Contracts.vue";
import Eq from "./Eq.vue";
import HiddenGoal from "./HiddenGoal.vue";
import Players from "./Players.vue";
import Rules from "./Rules.vue";
import Trade from "./Trade.vue";
import Turns from "./Turns.vue";


const SOUNDTRACK_URL = "/sounds/brianboru/brian_boru_soundtrack.opus";
usePageSounds({
    effects: [
        { name: "click", poolSize: 3, url: "/sounds/brianboru/click.mp3" },
    ],
    music: [{ name: "soundtrack", url: SOUNDTRACK_URL }],
});

const { scale } = useGameResize();
const { isPaused } = useGamePause();

const { gameData } = useGameData();


const turnInfo = {
    player: {
        username: "Thinkofistodo",
        color: {
            hex: "green",
            name: "green"
        }
    }
}

</script>

<template>
    <Settings />
    <PauseScreen v-if="isPaused" />
    <PlaySoundtrack :url="SOUNDTRACK_URL" />
    <div class="background">
        <div
            v-if="gameData"
            class="game"
            :style="{ transform: `scale(${scale}) translate(-50%, -50%)` }"
        >
            <HiddenGoal :goal-card="{title: 'Baron Logistyki', task: 'Zdobądź maksymalny poziom udźwigu. Maksymalny udźwig do kupienia zwiększony do 16'}"/>
            <Board />
            <Eq />
            <Trade />
            <Contracts />
            <Players />
            <Turns :player="turnInfo.player" :round="2" :turn="1"/>
            <Rules />
            
        </div>
    </div>
</template>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap");
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
    background-image: url("/src/assets/games/gameAssets/craftsmen/background.jpg");
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
