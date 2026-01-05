<script setup>
import Music from "@/assets/music.svg";

import { soundBus } from "../../audio/soundBus";
const props = defineProps(["url"]);
</script>

<template>
    <button
        v-if="soundBus.isSoundtrackNotPlaying()"
        class="play-soundtrack-button theme-button"
        @click="soundBus.resetSoundtrack(url)"
    >
        Włącz ścieżkę dźwiękową
        <img :src="Music" alt="" />
    </button>
</template>

<style scoped>
.play-soundtrack-button {
    display: flex;
    position: fixed;
    align-items: center;

    font-size: 0.95rem;
    border-radius: 0.25rem;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.5rem 1rem;
    height: auto;
    gap: 0.5rem;

    z-index: 4000000;

    img {
        height: 18px;
    }
}
</style>
