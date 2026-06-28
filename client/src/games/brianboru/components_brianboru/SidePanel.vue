<script setup>
import { ref } from "vue";

import SideInfo from "./SideInfo.vue";
</script>

<template>
    <div class="sidePanel">
        <SideInfo direction="down" />
        <SideInfo direction="up" />
    </div>
</template>

<style scoped lang="scss">
.sidePanel {
    padding: 1rem;
    align-items: center;
    justify-content: center;
    width: 12.5%;
    background-color: rgba(68, 255, 0, 0.616);
    height: 100%;
}
</style>
