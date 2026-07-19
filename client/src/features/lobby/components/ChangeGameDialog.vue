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

const props = defineProps([
    "isAdmin",
    "availableGames",
    "currentGame",
    "closeDialog",
]);

const store = useAppStore();

const changeGame = (gameTitle) => {
    if (!props.isAdmin) return;
    if (props.currentGame.title != gameTitle) {
        store.emit("changeGame", { gameTitle });
    }
    soundBus.playEffect("click");
    props.closeDialog();
};
</script>

<template>
    <div class="change-game-dialog">
        <!-- <h1>Lista gier planszowych</h1> -->
        <ul ref="gamesList" class="games">
            <li
                v-for="game in props.availableGames"
                :key="game.title"
                class="game"
                :data-choosing="props.isAdmin"
                @click="() => changeGame(game.title)"
            >
                <p class="game-title">{{ game.polishTitle }}</p>

                <VintageBorderContainer
                    :smaller-inner-border="1"
                    color="#f0cd8d"
                    :image="BorderImage"
                    :padding="1"
                    background="#00000049"
                    class="boardgame-image"
                    :image-height="2"
                >
                    <img
                        :src="`assets/games/gamePreviews/${game.title}_preview.png`"
                        class="game-bgImage"
                    />

                    <!-- <div
                        class="game-info-wrapper"
                        :data-choosing="props.isAdmin"
                    >
                        <div class="container">
                            <p class="game-title">{{ game.polishTitle }}</p>

                            
                        </div>

                    
                    </div> -->
                </VintageBorderContainer>

                <div class="game-info">
                    <p>
                        <span>Poziom trudności:</span>
                        {{ game.difficulty }}
                    </p>
                    <p>
                        <span>Ilość graczy:</span>
                        {{ game.minPlayers }}-{{ game.maxPlayers }}
                    </p>
                    <p><span>Czas gry:</span> {{ game.time }}</p>
                </div>
                <div class="game-description">
                    {{ game.description }}
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
.change-game-dialog {
    display: flex;
    justify-content: center;

    width: auto;
    height: 336px;
    margin-block: 0.5rem;
    z-index: 3;

    h1 {
        font-size: 1.5rem;
        color: #e0d4b0;
        text-align: center;
        margin-bottom: 0.5rem;
    }
}

.games {
    display: flex;

    padding-inline: 2rem;

    width: 1328px;
    max-width: 90vw;
    flex-shrink: 0;
    height: 425px;
    overflow-x: scroll;
    justify-content: flex-start;
    align-items: center;

    list-style: none;

    gap: 2rem;
    transition: transform 0.5s;

    scrollbar-width: thick;
    scrollbar-color: #ab9265 rgba(0, 0, 0, 0.4);

    &::-webkit-scrollbar {
        height: 10px;
        width: 10px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.5);
        border-radius: 6px;
        border: 1px solid #332714;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #ab9265;
        border-radius: 6px;
        border: 2px solid rgba(0, 0, 0, 0);
        background-clip: padding-box;

        &:hover {
            background-color: #e0d4b0;
        }
    }
}

.game-title {
    font-weight: bold;
    font-size: 2rem;
    letter-spacing: 0.35px;
}

.game {
    display: flex;
    position: relative;

    flex-direction: column;
    max-width: none;
    gap: 0.35rem;
    width: 400px;
    border: 0px solid #ab9265;

    flex-shrink: 0;

    //    background-size: cover;
    //    background-repeat: no-repeat;
    // background-image: url("/src/assets//woodbg2.png");
    &[data-choosing="true"] {
        cursor: pointer;
    }

    &[data-choosing="true"]:hover > .boardgame-image {
        filter: brightness(1.3);
    }
}

.game-bgImage {
    width: 100%;
    height: 100%;
}

.container {
    width: 100%;

    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    justify-content: space-between;
}

.game-info {
    display: flex;

    font-size: 0.65rem;

    margin-top: 0.5rem;
    text-align: center;
    width: calc(100% + 0.6rem);
    gap: 1rem;
    transform: translateX(-0.3rem);
    justify-content: space-between;
}

.game-info-icon {
    transform: translateY(-0.1rem);
    width: 1rem;
}

.game-time,
.game-players-count,
.game-difficulty {
    display: flex;

    flex-direction: row-reverse;

    align-items: center;
    gap: 0.5rem;
    color: white;
    font-size: 1.3rem;
    line-height: 1.2;
}

.game-description {
    text-align: left;
    line-height: 1.3;
    width: calc(100% + 0.6rem);

    transform: translateX(-0.3rem);

    color: #c7c0b3;

    font-weight: 500;

    font-size: 1.05rem;
    width: 100%;
    height: 4.25rem;
}

p {
    display: flex;
    font-size: 1rem;
    text-align: left;

    align-items: start;
    flex-direction: column;
    font-weight: bold;

    text-align: left;
    span {
        font-size: 0.9rem;
        color: #f0cd8e;
    }
}
</style>
