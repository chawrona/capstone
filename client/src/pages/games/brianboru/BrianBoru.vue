<script setup>
import { onMounted } from "vue";

import PauseScreen from "../../../components/common/PauseScreen.vue";
import { usePageSounds } from "../../../composables/usePageSounds";
import { useAppStore } from "../../../store/useAppStore";
import { useGamePause } from "../composables_games/useGamePause";
import { useGameResize } from "../composables_games/useGameResize";
import Map from "./components_brianboru/Map.vue";
import PlayerData from "./components_brianboru/PlayerData.vue";
import SidePanel from "./components_brianboru/SidePanel.vue";
import TurnInfo from "./components_brianboru/TurnInfo.vue";

const store = useAppStore();
const SOUNDTRACK_URL = "/sounds/brianboru.mp3";
usePageSounds({
    music: [{ name: "soundtrack", url: SOUNDTRACK_URL }],
});
const { scale } = useGameResize();
const { isPaused } = useGamePause();

const gameData = ref(null)

onMounted(() => {


 if (store.socket) {

        store.socket.on("gameData", (data) => {
            gameData.value = data; 
            store.setLoading(false)
        });

        setTimeout(() => {
            store.emit("gameData", {
                eventName: "gameDataRequest",
            });
        }, 500);
    }



    
    
});
</script>

<template>
    <PauseScreen v-if="isPaused" />
    <div class="background">
        <div v-if="gameData" class="game" :style="{ transform: `scale(${scale})` }">
            <PlayerData />
            <TurnInfo />
            <Map />
        </div>
    </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap");
.background {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100vh;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url("/src/assets/games/gameAssets/brianboru/background.webp");
    // background-color: black;
    overflow: hidden;
}

.game {
    background-color: #ffffffbf;
    position: relative;
    display: flex;
    // flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 1920px;
    height: 950px;
    margin-block: auto;
    transform-origin: top left;
    font-family: "Open sans";

    * {
        user-select: none;
    }
}
</style>
