<script setup>
import { ref } from "vue";

import BoardGame from "@/assets/boardGame.svg";
import BorderImage from "@/assets/corner-decoration.png";

import { soundBus } from "../../../../audio/soundBus";
import VintageBorderContainer from "../../../../components/common/VintageBorderContainer.vue";
import ChangeGameDialog from "../ChangeGameDialog.vue";
import OptionButton from "../OptionButton.vue";

const props = defineProps(["availableGames", "currentGame", "isAdmin"]);

const changeGameDialogRef = ref(null);
</script>

<template>
    <div class="panel center">
        <div class="title-wrapper">
            <h1 class="game-title">{{ props.currentGame.polishTitle }}</h1>
            <OptionButton
                :icon="BoardGame"
                content="Inne gry"
                class="games-button"
                @click="
                    () => {
                        changeGameDialogRef?.openDialog();
                        soundBus.playEffect('click');
                    }
                "
            />
        </div>
        <VintageBorderContainer
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

        <ChangeGameDialog
            ref="changeGameDialogRef"
            :is-admin="props.isAdmin"
            :available-games="props.availableGames"
            :current-game="props.currentGame"
        />

        <div class="game-card">
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
    width: 600px;
    padding: 0;
    min-height: 550px;
    font-size: 1.5rem;
    color: #ffffff;
    user-select: none;
    font-family: "Cinzel";
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
    color: #c7c0b3;
    margin-top: 0.5rem;
    font-weight: 500;
}

@media (width < 1200px) {
    .center {
        transform: translate(-40%, -40%);
        width: 450px;
    }

    .game-title {
        font-size: 1.75rem;
        line-height: 0.8em;
    }

    .game-info p {
        display: flex;
        flex-direction: column;
    }

    .game-description {
        font-size: 1rem;
    }

    .games-button {
        font-size: 0.6rem;
        width: 160px;
        padding: 0.35rem 0.75rem;
    }
}

@media (width < 768px) {
    .center {
        order: 4;
        left: auto;
        top: auto;
        transform: none;
        margin: 2rem auto;
    }

    .game-info p {
        font-size: 0.85rem;
    }
}

@media (width < 540px) {
    .center {
        width: 300px;
    }

    .title-wrapper {
        flex-direction: column;
        gap: 1rem;
    }

    .game-title {
        line-height: 1.2;
    }

    .games-button {
        width: 218px;
        padding: 1rem;
        font-size: 0.83rem;
    }

    .game-image-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 160px;
        transform: translate(-50%, -50%);
    }

    .game-info {
        flex-direction: column;
        align-items: center;
        p {
            align-items: center;
        }
    }

    .game-description {
        text-align: center;
    }
}

@media (width < 360px) {
    .center {
        width: 250px;
    }
}
</style>
