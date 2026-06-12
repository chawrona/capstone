<script setup>
import PauseScreen from "../../../components/common/PauseScreen.vue";
import PlaySoundtrack from "../../../components/common/PlaySoundtrack.vue";
import Settings from "../../../components/common/Settings.vue";
import { usePageSounds } from "../../../composables/usePageSounds.js";
import { useGamePause } from "../composables_games/useGamePause.js";
import { useGameResize } from "../composables_games/useGameResize.js";
import Board from "./Board.vue";
import useGameData from "./composables_craftsmen/useGameData.js";
import Contracts from "./Contracts.vue";
import EndGame from "./EndGame.vue";
import HiddenGoal from "./HiddenGoal.vue";
import Inventory from "./Inventory.vue";
import NewTurn from "./NewTurn.vue";
import Players from "./Players.vue";
import Rules from "./Rules.vue";
import Trade from "./Trade.vue";
import Turns from "./Turns.vue";
import YourTurn from "./YourTurn.vue";

const SOUNDTRACK_URL = "/sounds/craftsmen/soundtrack.mp3";
usePageSounds({
    effects: [
        {
            name: "buttonPress1",
            poolSize: 2,
            url: "/sounds/craftsmen/buttonPress1.mp3",
        },
        { name: "craft", poolSize: 2, url: "/sounds/craftsmen/craft.mp3" },
        {
            name: "getResource",
            poolSize: 2,
            url: "/sounds/craftsmen/getResource.mp3",
        },
        {
            name: "getResource2",
            poolSize: 2,
            url: "/sounds/craftsmen/getResource2.mp3",
        },
        {
            name: "nextlevel",
            poolSize: 2,
            url: "/sounds/craftsmen/nextlevel.mp3",
        },
        {
            name: "openBook",
            poolSize: 2,
            url: "/sounds/craftsmen/openBook.mp3",
        },
        {
            name: "placeCard1",
            poolSize: 2,
            url: "/sounds/craftsmen/placeCard1.mp3",
        },
        { name: "rocks", poolSize: 2, url: "/sounds/craftsmen/rocks.mp3" },
        {
            name: "selectCraftsman",
            poolSize: 2,
            url: "/sounds/craftsmen/selectCraftsman.mp3",
        },
        { name: "sell", poolSize: 7, url: "/sounds/craftsmen/sell.mp3" },
        {
            name: "spendMoney",
            poolSize: 7,
            url: "/sounds/craftsmen/spendMoney.mp3",
        },
        {
            name: "takeResource",
            poolSize: 3,
            url: "/sounds/craftsmen/takeResource.mp3",
        },
        {
            name: "takeResource2",
            poolSize: 2,
            url: "/sounds/craftsmen/takeResource2.mp3",
        },
        {
            name: "takeResource3",
            poolSize: 2,
            url: "/sounds/craftsmen/takeResource3.mp3",
        },
        {
            name: "takeResource4",
            poolSize: 2,
            url: "/sounds/craftsmen/takeResource4.mp3",
        },
        {
            name: "takeResource5",
            poolSize: 2,
            url: "/sounds/craftsmen/takeResource5.mp3",
        },
        {
            name: "takeResource6",
            poolSize: 2,
            url: "/sounds/craftsmen/takeResource6.mp3",
        },
        {
            name: "takeResource7",
            poolSize: 2,
            url: "/sounds/craftsmen/takeResource7.mp3",
        },
        {
            name: "takeResource8",
            poolSize: 2,
            url: "/sounds/craftsmen/takeResource8.mp3",
        },
    ],
    music: [{ name: "soundtrack", url: SOUNDTRACK_URL }],
});

const { scale } = useGameResize();
const { isPaused } = useGamePause();

const { endGameData, gameData } = useGameData();

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
            <EndGame
                v-if="endGameData"
                :end-game-data="endGameData"
                :lobby-id="gameData.lobbyId"
            />

            <YourTurn v-if="!endGameData" :is-your-turn="gameData.isYourTurn" />

            <div class="board-wrap">
                <Board
                    v-if="!endGameData"
                    :outer-circle-rotation="gameData.outerCircleRotation"
                    :inner-circle-rotation="gameData.innerCircleRotation"
                    :inner-positions="gameData.innerPositions"
                    :outer-positions="gameData.outerPositions"
                    :available-actions="gameData.availableActions"
                    :available-movement="gameData.availableMovement"
                    :guilds="gameData.guilds"
                    :outer-path-craftsmen="gameData.outerPathCraftsmen"
                    :inner-path-craftsmen="gameData.innerPathCraftsmen"
                    :you="gameData.you"
                    :guild-cost="gameData.guildCost"
                    :is-your-turn="gameData.isYourTurn"
                />
            </div>
            <Inventory
                v-if="!endGameData"
                :you="gameData.you"
                :available-actions="gameData.availableActions"
            />
            <Trade
                v-if="!endGameData"
                :you="gameData.you"
                :trade-unlock-cost="gameData.tradeUnlockCost"
                :available-actions="gameData.availableActions"
                :is-your-turn="gameData.isYourTurn"
            />
            <Contracts
                v-if="!endGameData"
                :contracts="gameData.contracts"
                :reroll-cost="gameData.rerollCost"
                :you="gameData.you"
                :available-actions="gameData.availableActions"
                :can-reroll="gameData.canReroll"
            />
            <Players
                v-if="!endGameData"
                :current-player-index="gameData.currentPlayerIndex"
                :players="gameData.players"
                :you="gameData.you"
            />
            <Turns
                v-if="!endGameData"
                :is-your-turn="gameData.isYourTurn"
                :player="gameData.currentPlayer"
                :round="gameData.round"
                :turn="gameData.turn"
            />
            <Rules v-if="!endGameData" />
            <NewTurn
                v-if="!endGameData"
                :available-actions="gameData.availableActions"
                :is-your-turn="gameData.isYourTurn"
            />
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

    background: linear-gradient(180deg, rgb(17, 17, 17) 0%, rgb(3, 3, 3) 100%);

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
