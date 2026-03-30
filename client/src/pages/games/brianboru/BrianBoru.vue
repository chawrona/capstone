<script setup>
import PauseScreen from "../../../components/common/PauseScreen.vue";
import { usePageSounds } from "../../../composables/usePageSounds";
import { useGamePause } from "../composables_games/useGamePause";
import { useGameResize } from "../composables_games/useGameResize";
import ChosenCards from "./components_brianboru/ChosenCards.vue";
import Dialogs from "./components_brianboru/Dialogs.vue";
import Island from "./components_brianboru/Island.vue";
import Map from "./components_brianboru/Map.vue";
import PlayerData from "./components_brianboru/PlayerData.vue";
import TurnInfo from "./components_brianboru/TurnInfo.vue";
import useGameData from "./composables_brianboru/useGameData";
import useGameDialogs from "./composables_brianboru/useGameDialogs";

const SOUNDTRACK_URL = "/sounds/brianboru.mp3";
usePageSounds({
    music: [{ name: "soundtrack", url: SOUNDTRACK_URL }],
});

const { scale } = useGameResize();
const { isPaused } = useGamePause();

const { gameData } = useGameData();
const { allDialogs, closeDialog, openedDialog } = useGameDialogs();
</script>

<template>
    <PauseScreen v-if="isPaused" />
    <div class="background">
        <div
            v-if="gameData"
            class="game"
            :style="{ transform: `scale(${scale})` }"
        >
            <PlayerData
                :cards="gameData.cards"
                :status="gameData.status"
                :city-under-attack="gameData.cityUnderAttack"
                :hide-cards="gameData.hideCards"
            />
            <TurnInfo :phases="gameData.phases" :message="gameData.message" />
            <Map
                :current-vikings="gameData.currentVikings"
                :marriages="gameData.marriages"
                :players="gameData.players"
                :church="gameData.church"
                :marriage="gameData.marriage"
                :you="gameData.you"
            >
                <Island
                    :city-under-attack="gameData.cityUnderAttack"
                    :cities="gameData.cities"
                    :regions="gameData.regions"
                    :status="gameData.status"
                    :cities-to-attack="gameData.citiesToAttack"
                    :cities-to-cathedra="gameData.citiesToCathedra"
                    :cities-to-vikings="gameData.citiesToVikings"
                    :city-under-attack-type="gameData.cityUnderAttackType"
                    :cities-to-build="gameData.citiesToBuild"
                    :cards="gameData.cards"
                    :you="gameData.you"
                />

                <ChosenCards
                    :chosen-cards="gameData.chosenCards"
                    :you="gameData.you"
                    :status="gameData.status"
                />
            </Map>

            <Dialogs
                :game-data="gameData"
                :all-dialogs="allDialogs"
                :close-dialog="closeDialog"
                :opened-dialog="openedDialog"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap");
.background {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100vh;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: rgb(0, 0, 0);
    overflow: hidden;
}

.game {
    position: relative;

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
