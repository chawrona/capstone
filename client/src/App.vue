<script setup>
import { onMounted } from "vue";

import useAuthentication from "./composables/useAuthentication.js";
import { usePageSounds } from "./composables/usePageSounds";

const { authenticate } = useAuthentication();

onMounted(() => {
    authenticate();
});

usePageSounds({
    music: [{ name: "soundtrack", url: "/sounds/tale.mp3" }],
});
</script>

<template>
    <div class="small-screen-block">
        <p>
            Gry planszowe nie mieszczą się realnie na małych ekranach, dlatego
            aplikacja wymaga komputera lub tabletu.
        </p>
    </div>
    <router-view />
</template>

<style scoped>
.small-screen-block {
    display: none;
}

@media (max-width: 767px), (max-height: 600px) {
    .small-screen-block {
        display: flex;
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: #000;
        color: #fff;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 2rem;
    }
}
</style>
