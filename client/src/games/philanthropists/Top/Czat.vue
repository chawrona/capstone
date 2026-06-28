<script setup>
import { ref } from "vue";

import chat from "@/assets/games/gameAssets/philanthropists/chat.svg";

const props = defineProps(["gameData"]);
const idkref = ref(true);

const switchto = () => {
    idkref.value = !idkref.value;
};
</script>

<template>
    <div class="czat" :class="idkref ? 'yes' : ''">
        <div class="wiadomosci">
            <li
                v-for="wiadomosc in props.gameData.czat"
                :key="wiadomosc.id"
                :style="`color: ${wiadomosc.color}`"
            >
                {{ wiadomosc.wiadomosc }}
            </li>
        </div>

        <button class="btn" @click="switchto">
            <img :src="chat" alt="" class="pauzaimg" />
        </button>
    </div>
</template>

<style scoped>
.pauzaimg {
    width: 1.25rem;
}

.btn {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.2rem;
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    color: white;
    width: auto;
    padding: 0.35rem;
    padding-bottom: 0.275rem;
    height: auto;
    font-size: 0.9rem;
    color: black;
    /* transform: translate(-50%, -53%); */
    text-transform: uppercase;
    border-radius: 0.25rem;

    font-weight: 600;
    background-color: #fff;

    box-shadow: 2px 2px 3px 3px rgba(0, 0, 0, 0.432);

    &:hover {
        background-color: #cfcfcf;
    }
}

.czat {
    position: relative;
    list-style: none;

    display: flex;
    justify-content: end;
    flex-direction: column;
    color: white;
    flex-direction: column;
    width: 100%;
    height: 22.5%;
    /* overflow: hidden; */
    background-color: rgb(14, 14, 14);

    z-index: 999;
}

.wiadomosci {
    padding: 0.5rem 1rem;
    margin-top: auto;
    font-size: 0.95rem;
    width: 100%;
    background-color: black;
    line-height: 1.245;
    background-color: rgb(14, 14, 14);
}

.pasek {
    margin-top: auto;
    background-color: #fff;
    height: 2rem;
    width: 100%;
    color: black;
    background-color: rgb(255, 255, 255);
}

.yes {
    overflow: hidden;
}
</style>
