<script setup>
import { ref } from "vue";

import Clock from "@/assets/clock.svg";
import BorderImage from "@/assets/corner-decoration.png";
import Target from "@/assets/target.svg";
import Players from "@/assets/users.svg";

import { soundBus } from "../../../audio/soundBus";
import VintageBorderContainer from "../../../components/common/VintageBorderContainer.vue";
import { useAppStore } from "../../../store/useAppStore";
import DialogHeader from "./panels/DialogHeader.vue";

const props = defineProps(["isAdmin", "availableGames", "currentGame"]);

const store = useAppStore();

const dialogRef = ref(null);
const gamesList = ref(null);

const closeDialog = () => dialogRef.value.close();
const openDialog = () => dialogRef.value.showModal();

defineExpose({
    closeDialog,
    openDialog,
});

const handleBackdropClick = (event) => {
    if (event.target === dialogRef.value || event.target === gamesList.value) {
        soundBus.playEffect("click");
        closeDialog();
    }
};

const changeGame = (gameTitle) => {
    if (!props.isAdmin) return;
    if (props.currentGame.title != gameTitle) {
        store.emit("changeGame", { gameTitle });
    }
    soundBus.playEffect("click");
    closeDialog();
};
</script>

<template>
    <dialog
        ref="dialogRef"
        class="theme-dialog change-game-dialog"
        @click="handleBackdropClick"
    >
        <ul ref="gamesList" class="games">
            <li
                v-for="game in props.availableGames"
                :key="game.title"
                class="game"
                :data-choosing="props.isAdmin"
                @click="() => changeGame(game.title)"
            >
                <VintageBorderContainer
                    color="#f0cd8d"
                    :image="BorderImage"
                    :padding="1"
                    background="#00000049"
                    class="boardgame-image"
                    :image-height="2.5"
                >
                    <img
                        :src="`assets/games/gamePreviews/${game.title}_preview.png`"
                        class="game-bgImage"
                    />

                    <div
                        class="game-info-wrapper"
                        :data-choosing="props.isAdmin"
                    >
                        <div class="container">
                            <p class="game-title">{{ game.polishTitle }}</p>

                            <div class="game-info">
                                <p class="game-difficulty">
                                    <img class="game-info-icon" :src="Target" />
                                    <span class="value">{{
                                        game.difficulty
                                    }}</span>
                                </p>
                                <p class="game-players-count">
                                    <img
                                        class="game-info-icon"
                                        :src="Players"
                                    />
                                    <span class="value">
                                        {{
                                            game.minPlayers === game.maxPlayers
                                                ? game.minPlayers
                                                : `${game.minPlayers}-${game.maxPlayers}`
                                        }}
                                    </span>
                                </p>
                                <p class="game-time">
                                    <img class="game-info-icon" :src="Clock" />
                                    <span class="value">{{ game.time }}</span>
                                </p>
                            </div>
                        </div>

                        <p class="game-description">
                            {{ game.description }}
                        </p>
                    </div>
                </VintageBorderContainer>
            </li>
        </ul>
    </dialog>
</template>

<style scoped lang="scss">
.change-game-dialog {
    top: 0;
    display: none;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
    transform: none;
    user-select: none;
    padding: 4rem 3rem;
    border: none;
    background-image: none;
    background: none;

    &.theme-dialog::backdrop {
        background: linear-gradient(
            135deg,
            rgba(0, 14, 0, 0.8) 0%,
            rgba(9, 0, 0, 0.8) 50%,
            rgba(13, 11, 0, 0.8) 100%
        );
    }

    &[open] {
        display: flex;
    }

    .close-dialog {
        padding: 0;
        display: grid;
        place-items: center;
        width: 2.5rem;
        aspect-ratio: 1 / 1;
        background-image: none;
        background-color: transparent;
        border: none;
        backdrop-filter: unset;
        flex-shrink: 0;
        transform: translateX(10px);

        &:hover {
            background-image: none;
            background-color: #ffffff25;
        }
    }

    .close-icon {
        width: 2rem;
    }
}

.games {
    margin-inline: auto;
    display: flex;
    justify-content: start;
    width: 90%;

    flex-wrap: wrap;
    list-style: none;
    gap: 3rem;
}

.game {
    border-radius: 3px;
    margin-left: 0.25rem;
    max-width: 600px;
    width: 100%;
    min-height: 325px;
    height: auto;
    background-position: center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    font-weight: bold;
    text-align: left;
    container-type: inline-size;

    position: relative;

    & > p {
        z-index: 10;
    }

    &[data-choosing="true"] {
        cursor: pointer;
    }
}

.boardgame-image {
    .game-bgImage {
        position: absolute;
        inset: 0;
        height: 100%;
        width: 100%;
    }

    .game-info-wrapper {
        position: absolute;
        inset: 0;

        padding: 2rem 2rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: rgba(0, 0, 0, 0.7);

        .container {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
        }

        .game-title {
            color: #ffffff;
            font-size: 1.6rem;
            font-family: "Cinzel Decorative";
        }

        .game-info {
            display: flex;
            gap: 1rem;
            justify-content: space-between;
        }

        .game-info-icon {
            transform: translateY(-0.1rem);
            width: 1.5rem;
        }

        .game-time,
        .game-players-count,
        .game-difficulty {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: white;
            font-size: 1.05rem;
            line-height: 1.2;
        }

        .game-description {
            align-items: start;
            justify-self: start;
            grid-column: -1 / 1;
            font-size: 1rem;
            color: #ffffff;
        }
    }
}

.boardgame-image:hover {
    .game-info-wrapper[data-choosing="true"] {
        background-color: rgba(0, 0, 0, 0.4);
    }
}

@media (width < 800px) {
    .container {
        flex-direction: column;
    }

    .boardgame-image {
        .game-info-wrapper {
            position: relative;
            background-color: #ffffff00;
            .game-info {
                flex-direction: column;
            }
        }

        .game-bgImage {
            position: absolute;
            filter: brightness(0.26);
            width: 100%;
            height: 100%;
        }
    }

    .boardgame-image:hover {
        .game-info-wrapper[data-choosing="true"] {
            background-color: hsl(39, 77%, 3%);
        }
    }
}
</style>
