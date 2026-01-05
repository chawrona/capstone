<script setup>
import { useRouter, useRoute } from "vue-router";

import { soundBus } from "../../../../audio/soundBus";
import { useAppStore } from "../../../../store/useAppStore";

const store = useAppStore();
const props = defineProps(["endGameData", "playersData"]);
const router = useRouter();
const route = useRoute();

const goToLobby = () => {
    store.setLoading(true);
    soundBus.playMusic("soundtrack");
    setTimeout(() => {
        router.push(`/${route.params.id}`);
    }, 1000);
};

const getPlayerName = (publicId) => {
    const player = props.playersData.find((p) => p.publicId === publicId);
    return player ? [player.username, player.color.hex] : "Nieznany gracz";
};
</script>

<template>
    <div class="end-game">
        <div class="container">
            <h1>Koniec gry</h1>
            <h2>Leaderboard:</h2>
            <ol>
                <li v-for="(player, index) in endGameData" :key="player">
                    <span :style="`color: ${getPlayerName(player)[1]}`">
                        {{ index + 1 }}. {{ getPlayerName(player)[0] }}
                    </span>
                </li>
            </ol>

            <button class="eurobusiness-button" @click="goToLobby">
                Powrót do pokoju
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.end-game {
    position: absolute;
    z-index: 9998;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.952);

    padding-top: 5%;
    color: white;
    font-family: sans-serif;

    .container {
        display: flex;
        align-items: center;
        justify-content: start;
        flex-direction: column;
    }

    h1 {
        max-width: 700px;
        text-align: center;
        font-size: 4rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        text-align: center;
    }
    h2 {
        margin-top: 1rem;
        font-size: 2.5rem;
        text-align: center;
    }

    ol {
        list-style: none;
        padding: 1rem;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
        font-size: 2rem;
        margin-bottom: 2rem;
    }

    .eurobusiness-button {
        width: 300px;
    }
}
</style>
