<script setup>
import { storeToRefs } from "pinia";

import LoadingScreen from "./components/common/LoadingScreen.vue";
import { usePageSounds } from "./composables/usePageSounds";
import useSocket from "./composables/useSocket";
import { useAppStore } from "./store/useAppStore";

const store = useAppStore();
const { socket } = storeToRefs(store);
useSocket();

usePageSounds({
    music: [{ name: "soundtrack", url: "/sounds/tale.mp3" }],
});
</script>

<template>
    <LoadingScreen />
    <router-view v-if="socket" />
</template>

<style scoped></style>
