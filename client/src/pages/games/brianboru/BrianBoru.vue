<script setup>
import PauseScreen from "../../../components/common/PauseScreen.vue";
import PlaySoundtrack from "../../../components/common/PlaySoundtrack.vue";
import { usePageSounds } from "../../../composables/usePageSounds";
import { useGamePause } from "../composables_games/useGamePause";
import { useGameResize } from "../composables_games/useGameResize";
import Debug from "./components_brianboru/Debug.vue";
import Dialogs from "./components_brianboru/Dialogs.vue";
import ChosenCards from "./components_brianboru/dialogs/ChosenCardDialog.vue";
import Island from "./components_brianboru/Island.vue";
import Map from "./components_brianboru/Map.vue";
import PlayerData from "./components_brianboru/PlayerData.vue";
import TurnInfo from "./components_brianboru/TurnInfo.vue";
import useGameData from "./composables_brianboru/useGameData";
import useGameDialogs from "./composables_brianboru/useGameDialogs";

const SOUNDTRACK_URL = "/sounds/brianboru/brian_boru_soundtrack.opus";
usePageSounds({
    effects: [
        { name: "buildCathedra", url: "/sounds/brianboru/buildCathedra.mp3" },
        { name: "buildCity", url: "/sounds/brianboru/buildCity.mp3" },
        {
            name: "chooseAttackCity",
            url: "/sounds/brianboru/chooseAttackCity.mp3",
        },
        { name: "chooseCard", url: "/sounds/brianboru/chooseCard.mp3" },
        { name: "removeVikings", url: "/sounds/brianboru/removeVikings.mp3" },
        {
            name: "selectCardEffect",
            poolSize: 2,
            url: "/sounds/brianboru/selectCardEffect.mp3",
        },
        { name: "click", poolSize: 3, url: "/sounds/brianboru/click.mp3" },
        {
            name: "selectCard",
            poolSize: 3,
            url: "/sounds/brianboru/selectCard.mp3",
        },
        { name: "pop", url: "/sounds/brianboru/pop.mp3" },
        {
            name: "attackVikings",
            poolSize: 2,
            url: "/sounds/brianboru/attackVikings.mp3",
        },
    ],
    music: [{ name: "soundtrack", url: SOUNDTRACK_URL }],
});

const { scale } = useGameResize();
const { isPaused } = useGamePause();

const { gameData } = useGameData();
const { allDialogs, closeDialog, openedDialog } = useGameDialogs();
</script>

<template>
    <PauseScreen v-if="isPaused" />
    <PlaySoundtrack :url="SOUNDTRACK_URL" />
    <div class="background">
        <div
            v-if="gameData"
            class="game"
            :style="{ transform: `scale(${scale}) translate(-50%, -50%)` }"
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
                :regions="gameData.regions"
                v-slot="{ hide }">
            >
                <Island
                    :hide="hide"
                    :city-under-attack="gameData.cityUnderAttack"
                    :cities="gameData.cities"
                    :regions="gameData.regions"
                    :status="gameData.status"
                    :cities-to-attack="gameData.citiesToAttack"
                    :cities-to-cathedra="gameData.citiesToCathedra"
                    :cities-to-remove-vikings="gameData.citiesToRemoveVikings"
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

            <Debug />
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
    background-image: url("/src/assets/games/gameAssets/brianboru/sea.webp");
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
