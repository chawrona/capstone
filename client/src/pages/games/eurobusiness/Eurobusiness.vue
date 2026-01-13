<script setup>
import { computed, onMounted, ref } from "vue";

import { useAppStore } from "@/store/useAppStore.js";

import { soundBus } from "../../../audio/soundBus";
import PauseScreen from "../../../components/common/PauseScreen.vue";
import PlaySoundtrack from "../../../components/common/PlaySoundtrack.vue";
import { usePageSounds } from "../../../composables/usePageSounds";
import { useGamePause } from "../composables_games/useGamePause";
import { useGameResize } from "../composables_games/useGameResize";
import { useGameActions } from "./actions/useGameActions";
import AuctionDialog from "./components_eurobusiness/AuctionDialog.vue";
import ChanceCardDialog from "./components_eurobusiness/ChanceCardDialog.vue";
import CommunityCardDialog from "./components_eurobusiness/CommunityCardDialog.vue";
import CurrentMessage from "./components_eurobusiness/CurrentMessage.vue";
import EndGame from "./components_eurobusiness/EndGame.vue";
import GameMap from "./components_eurobusiness/GameMap.vue";
import HouseDialog from "./components_eurobusiness/HouseDialog.vue";
import Logs from "./components_eurobusiness/Logs.vue";
import MortgagePropertyCardDialog from "./components_eurobusiness/MortgagePropertyCardDialog.vue";
import PlayersData from "./components_eurobusiness/PlayersData.vue";
import { useGameData } from "./composables_eurobusiness/useGameData";
import { useGameDialogs } from "./composables_eurobusiness/useGameDialogs";
import useGameInfo from "./composables_eurobusiness/useGameInfo";

const store = useAppStore();
const SOUNDTRACK_URL = "/sounds/eurobusiness_soundtrack.mp3";
const { scale } = useGameResize();
const { isPaused } = useGamePause();
const {
    availableActions,
    currentMessage,
    endGame,
    gameMap,
    logs,
    playersData,
    playersPosition,
    rollResult,
    time,
    yourPublicId,
    yourTurn,
} = useGameData(isPaused);

const { createInfo } = useGameInfo();

const tilesOwnedBySomeone = computed(() => {
    const tiles = {};

    for (const player of playersData.value) {
        player.ownerships.forEach((ownership) => {
            tiles[ownership] = player.color.hex;
        });
    }

    return tiles;
});

const currentPlayer = computed(() => {
    return playersData.value.find(
        (player) => player.publicId === yourPublicId.value,
    );
});

const {
    auction,
    auctionCardDialogOpen,
    chanceCard,
    chanceCardDialogOpen,
    closeDialogs,
    communityCard,
    communityCardDialogOpen,
    dialogsOpen,
    houseIndex,
    housesDialogOpen,
    mortgagePropertyCardDialogOpen,
    openHouseDialog,
    openMortgagePropertyCardDialog,
    propertyCard,
} = useGameDialogs(availableActions);

const {
    bid,
    buyBuilding,
    buyHouse,
    end,
    endTurn,
    mortgagePropertyCard,
    payIncomeTax,
    payJail,
    payRent,
    payTax,
    pickChanceCard,
    pickCommunityCard,
    redeemPropertyCard,
    refuseToBuyBuilding,
    rollDice,
    sellHouse,
    useOutOfJailCard,
} = useGameActions(availableActions, dialogsOpen);

usePageSounds({
    music: [{ name: "soundtrack", url: SOUNDTRACK_URL }],
});
</script>

<template>
    <div class="background">
        <PlaySoundtrack :url="SOUNDTRACK_URL" />
        <PauseScreen v-if="gameMap && isPaused" />
        <EndGame
            v-if="endGame"
            :end-game-data="endGame"
            :players-data="playersData"
        />
        <div
            v-if="gameMap"
            class="game"
            :style="{ transform: `scale(${scale})` }"
        >
            <!-- Gracze -->
            <div class="left-panel">
                <CurrentMessage
                    :current-message="currentMessage"
                    :players-data="playersData"
                    :time="time"
                    :available-actions="availableActions"
                    :end-turn="endTurn"
                    :pay-tax="payTax"
                    :pay-income-tax="payIncomeTax"
                    :your-turn="yourTurn"
                    :buy-building="buyBuilding"
                    :refuse-to-buy-building="refuseToBuyBuilding"
                    :pay-jail="payJail"
                    :pay-rent="payRent"
                />

                <!-- <button @click="endGameButton">Wywołaj koniec gry</button> -->
                <PlayersData
                    :players-data="playersData"
                    :your-public-id="yourPublicId"
                    :your-turn="yourTurn"
                    :game-map="gameMap"
                    :open-mortgage-property-card-dialog="
                        openMortgagePropertyCardDialog
                    "
                    :available-actions="availableActions"
                />
            </div>

            <!-- Plansza -->
            <GameMap
                :roll-result="rollResult"
                :roll-dice="rollDice"
                :available-actions="availableActions"
                :your-turn="yourTurn"
                :players-positions="playersPosition"
                :players-data="playersData"
                :pick-chance-card="pickChanceCard"
                :pick-community-card="pickCommunityCard"
                :your-public-id="yourPublicId"
                :use-out-of-jail-card="useOutOfJailCard"
                :game-map="gameMap"
                :tiles-owned-by-someone="tilesOwnedBySomeone"
                :open-house-dialog="openHouseDialog"
            />

            <ChanceCardDialog
                :chance-card="chanceCard"
                :close-dialogs="closeDialogs"
                :chance-card-dialog-open="chanceCardDialogOpen"
            />
            <CommunityCardDialog
                :community-card="communityCard"
                :close-dialogs="closeDialogs"
                :community-card-dialog-open="communityCardDialogOpen"
            />

            <MortgagePropertyCardDialog
                v-if="mortgagePropertyCardDialogOpen"
                :property-card="propertyCard"
                :close-dialogs="closeDialogs"
                :mortgage-property-card="mortgagePropertyCard"
                :current-player="currentPlayer"
                :redeem-property-card="redeemPropertyCard"
                :players-data="playersData"
            />

            <HouseDialog
                v-if="housesDialogOpen"
                :house-index="houseIndex"
                :close-dialogs="closeDialogs"
                :property-card="gameMap[houseIndex]"
                :current-player="currentPlayer"
                :players-data="playersData"
                :buy-house="buyHouse"
                :game-map="gameMap"
                :sell-house="sellHouse"
            />

            <AuctionDialog
                v-if="auctionCardDialogOpen"
                :auction="auction"
                :bid="bid"
                :players-data="playersData"
                :current-player="currentPlayer"
            />

            <!-- Logi -->
            <Logs :logs="logs" :players-data="playersData" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap");

.background {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100vh;
    background-color: #0966a5;
    background: linear-gradient(
        180deg,
        rgba(67, 164, 230, 1) 0%,
        rgba(40, 143, 211, 1) 10%,
        rgba(25, 119, 181, 1) 74%,
        rgba(14, 96, 150, 1) 96%,
        rgba(13, 89, 140, 1) 100%
    );
    overflow: hidden;
}

.game {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    width: 1920px;
    height: 950px;
    margin-block: auto;
    transform-origin: top left;
    font-family: "Open sans";

    * {
        user-select: none;
    }
}

.left-panel {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 400px;
    height: 900px;
}
</style>

<style>
.v-toast__item--info {
    border: 3px solid #ffffff;

    background: linear-gradient(
        180deg,
        rgb(39, 189, 197) 0%,
        rgb(59, 165, 226) 100%
    );

    border-radius: 0.5rem;
    color: #ffffff;
    font-family: "Open sans";

    font-size: clamp(0.25rem, 0rem + 1.25vw, 1.5rem);

    padding: 0rem clamp(0.75em, 0.45em + 1.5vw, 2.25em);

    box-shadow: 3px 2px 0px 2px #768aaf;

    .v-toast__icon {
        display: none;
    }

    @media (width < 1200px) {
        border-width: 2px;
        border-radius: 0.25rem;
        box-shadow: 2px 1px 0px 1px #768aaf;
    }

    @media (width < 800px) {
        border-width: 1px;
        border-radius: 0.15rem;
        box-shadow: 1px 1px 0px 1px #768aaf;
    }
}

.v-toast__item {
    min-height: 1rem;
}
</style>
