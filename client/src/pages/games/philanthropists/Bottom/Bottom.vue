<script setup>
import BottomCenter from "./BottomCenter.vue";
import BottomLeft from "./BottomLeft.vue";
import BottomRight from "./BottomRight.vue";

const props = defineProps(["gameData"]);
</script>

<template>
    <div class="bottom">
        <BottomLeft :game-data="props.gameData"></BottomLeft>
        <BottomCenter :game-data="props.gameData"></BottomCenter>
        <BottomRight :game-data="props.gameData"></BottomRight>
    </div>
</template>

<style scoped>
.bottom {
    display: flex;
    width: 100%;
    height: 216px;
}
</style>
