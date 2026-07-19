<script setup>
import { ref } from "vue";

import BoardGame from "@/assets/boardGame.svg";
import BorderImage from "@/assets/corner-decoration.png";

import { soundBus } from "../../../../audio/soundBus";
import OptionButton from "../../../../components/common/OptionButton.vue";
import VintageBorderContainer from "../../../../components/common/VintageBorderContainer.vue";
import ChangeGameDialog from "../ChangeGameDialog.vue";

const props = defineProps(["availableGames", "currentGame", "isAdmin"]);

const isDialogOpen = ref(false);

const toggleDialog = () => {
    isDialogOpen.value = !isDialogOpen.value;
    soundBus.playEffect("click");
};
</script>

<template>
    <div class="panel center" :data-awaiting="!props.currentGame">
        <div class="title-wrapper">
            <h1 class="game-title">
                {{
                    isDialogOpen
                        ? "Dostępne gry"
                        : props.currentGame.polishTitle
                }}
            </h1>
            <OptionButton
                :icon="BoardGame"
                :content="isDialogOpen ? 'Zamknij' : 'Inne gry'"
                class="games-button"
                @click="toggleDialog"
            />
        </div>
        <ChangeGameDialog
            v-if="isDialogOpen"
            :is-admin="props.isAdmin"
            :available-games="props.availableGames"
            :current-game="props.currentGame"
            :close-dialog="toggleDialog"
        />
        <VintageBorderContainer
            v-else
            color="#f0cd8d"
            :image="BorderImage"
            :padding="1"
            background="#00000049"
            class="boardgame-image"
            :image-height="4"
        >
            <div class="game-image-wrapper">
                <img
                    :src="`assets/games/selectedGames/${props.currentGame.title}.png`"
                    alt=""
                    class="game-image"
                />
            </div>
        </VintageBorderContainer>

        <div class="game-card" :class="{ hide: isDialogOpen }">
            <div class="game-info">
                <p>
                    <span>Poziom trudności:</span>
                    {{ props.currentGame.difficulty }}
                </p>
                <p>
                    <span>Ilość graczy:</span>
                    {{ props.currentGame.minPlayers }}-{{
                        props.currentGame.maxPlayers
                    }}
                </p>
                <p><span>Czas gry:</span> {{ props.currentGame.time }}</p>
            </div>
            <p class="game-description">{{ props.currentGame.description }}</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
.panel.center {
    padding: 0;
}

.title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.games-button {
    width: 180px;
    padding: 0.5rem 1rem;
}

.center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: grid;
    width: 650px;
    padding: 0;
    min-height: 550px;
    font-size: 1.5rem;
    color: #ffffff;
    user-select: none;
    font-family: "Cinzel";
}

.center[data-awaiting="true"] {
    &::before {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 2;
        display: inline-block;
        height: 30%;
        border: 20px solid #e0d4b0;
        animation: rotation 1s linear infinite;
        aspect-ratio: 1 / 1;
        border-bottom-color: transparent;
        border-radius: 50%;
        box-sizing: border-box;
        content: "";
        transform: translate(-50%, -50%);
    }

    @keyframes rotation {
        0% {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }
}

// Title
.game-title {
    width: 100%;
    font-size: 2.5rem;
    line-height: 0.8em;
    text-align: left;
    color: #ffffff;
    font-family: "Cinzel Decorative";
}

// VintageBorderContainer
.boardgame-image {
    margin-block: 0.5rem;
}

.game-image-wrapper {
    position: relative;
    display: grid;
    place-items: center;
    z-index: 2;
}

.game-image {
    aspect-ratio: 2 / 1;
    margin: 0;
}

// Info container
.game-card {
    max-width: 100%;
}

.game-info {
    display: flex;
    justify-content: space-between;

    p {
        font-weight: bold;
        font-size: 1rem;
        text-align: left;
        span {
            color: #f0cd8e;
        }
    }
}

.game-description {
    font-size: 1.25rem;
    text-align: left;
    line-height: 1.3;
    height: 5.5rem;

    color: #c7c0b3;
    margin-top: 0.5rem;
    font-weight: 500;
}

.hide {
    opacity: 0;
}

@media (width < 1250px) {
    .center {
        transform: translate(-50%, -40%);
    }
}
</style>
