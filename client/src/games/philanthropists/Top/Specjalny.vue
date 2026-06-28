<script setup>
const props = defineProps(["gameData", "type"]);
</script>

<template>
    <div class="container">
        <div
            v-for="(cena, index) in [...props.gameData.ceny]"
            :key="cena"
            class="kwadrat"
            :class="index < 8 ? 'gold' : ''"
        >
            {{ cena }}
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
}

.kwadrat:first-of-type {
    border-left: none;
}
.kwadrat:last-of-type {
    border-right: none;
}

.kwadrat {
    color: white;
    display: grid;
    place-items: center;
    width: 45px;
    height: 30px;
    font-weight: bold;
    border: 1px solid #c4c4c4;
    border-top: none;
    background-image: url("/src/assets/games/gameAssets/philanthropists/grass3.jpg");
    background-size: contain;
}

.gold {
    color: rgb(236, 189, 57);
}

.hide {
    background-color: #704a04;
    border-color: #5a3c04;
}
</style>
