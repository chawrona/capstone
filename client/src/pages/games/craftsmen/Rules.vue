<script setup>
import { ref } from "vue";

import Rules from "@/assets/games/gameAssets/craftsmen/Book.png";
import { soundBus } from "../../../audio/soundBus";

const dialogOpened = ref(false);

const toggleDialog = () => {
    if (!dialogOpened.value)   soundBus.playEffect("openBook");
    dialogOpened.value = !dialogOpened.value;
    };
</script>

<template>
    <div v-if="dialogOpened" class="dialog">
        <h1>Zasady gry</h1>
    </div>

    <img :src="Rules" alt="" class="rules" @click="toggleDialog" />
</template>

<style scoped>
.dialog {
    position: absolute;
    inset: 0;
    place-self: center;
    width: 37rem;
    height: 50rem;
    overflow-y: scroll;
    background-color: red;
    padding: 2rem 2rem;
    margin-right: 6rem;
    scrollbar-width: none;

    background-size: contain;
    background-position: center;
    z-index: 100;
    border-radius: 0.5rem;
    color: white;
    background-image: url("/src/assets/games/gameAssets/craftsmen/black1.jpg");

    h1 {
        text-align: center;
    }
}

.rules {
    padding: 1rem;
    position: absolute;
    bottom: 11.5rem;
    cursor: pointer;
    left: 4.25rem;
    width: 18rem;
    z-index: 10;
    filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.534));

    &:hover {
        filter: brightness(1.1) drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.534));
    }
}
</style>
