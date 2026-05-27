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

import HiddenGoal from "./HiddenGoal.vue";
import Inventory from "./Inventory.vue";
import NewTurn from "./NewTurn.vue";
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
        color: {
            hex: "#206bdb",
            name: "green",
        },
        username: "Thinkofistodo",
    },
};
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
            <HiddenGoal
                :hiddenTask="gameData.you.hiddenTask"
            />
            <div class="board-wrap">
                <Board 
                    :outerCircleRotation="gameData.outerCircleRotation" 
                    :innerCircleRotation="gameData.innerCircleRotation"
                    :innerPositions="gameData.innerPositions"
                    :outerPositions="gameData.outerPositions"
                    :availableActions="gameData.availableActions"
                    :availableMovement="gameData.availableMovement"
                    :guilds="gameData.guilds"
                    :outerPathCraftsmen="gameData.outerPathCraftsmen"
                    :innerPathCraftsmen="gameData.innerPathCraftsmen"
                    :you="gameData.you"
                    :guild-cost="gameData.guildCost"
                />
            </div>
            <Inventory :you="gameData.you" :available-actions="gameData.availableActions"/>
            <Trade :you="gameData.you" :tradeUnlockCost="gameData.tradeUnlockCost"/>
            <Contracts :contracts="gameData.contracts" :reroll-cost="gameData.rerollCost" :you="gameData.you" :availableActions="gameData.availableActions" :canReroll="gameData.canReroll"/>
            <Players :players="gameData.players" :you="gameData.you"/>
            <Turns :player="gameData.currentPlayer" :round="gameData.round" :turn="gameData.turn" />
            <Rules />
            <NewTurn :availableActions="gameData.availableActions" :is-your-turn="gameData.isYourTurn"/>
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

.board-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-52.75%, -50%);
    width: 100%;
    height: 100%;
}

</style>
<style>
.v-toast__item--error {
    border: 3px solid #ffffff;

    background: linear-gradient(
        180deg,
        rgb(17, 17, 17) 0%,
        rgb(3, 3, 3) 100%
    );

    border-radius: 0.5rem;
    color: #f4ecd0;
    font-family: "Open sans";

    font-size: clamp(0.25rem, 0rem + 1vw, 1.5rem);

    padding: 0rem clamp(0.75em, 0.45em + 1.5vw, 2.25em);


    .v-toast__icon {
        display: none;
    }

    @media (width < 1200px) {
        border-width: 2px;
        border-radius: 0.25rem;
        box-shadow: 2px 1px 0px 1px #af9d76;
    }

    @media (width < 800px) {
        border-width: 1px;
        border-radius: 0.15rem;
        box-shadow: 1px 1px 0px 1px #af9d76;
    }
}

.v-toast__item {
    min-height: 1rem;
}
</style>
