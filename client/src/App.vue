<script setup>
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

import LoadingScreen from "./components/common/LoadingScreen.vue";
import useAuthentication from "./composables/useAuthentication.js";
import { usePageSounds } from "./composables/usePageSounds";
import { useAppStore } from "./store/useAppStore";

const { authenticate } = useAuthentication();

onMounted(() => {
    authenticate();
});

usePageSounds({
    music: [{ name: "soundtrack", url: "/sounds/tale.mp3" }],
});
</script>

<template>
    <router-view />
</template>

<style scoped></style>
