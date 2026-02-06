<script setup>
import Vikings from "@/assets/games/gameAssets/brianboru/vikings.png";

import Marriage from "./Marriage.vue";
import Players from "./Players.vue";
import Church from "./Church.vue";
import Island from "./Island.vue";
</script>

<template>
    <div class="map">
        <div class="vikings">
            <img :src="Vikings" alt="" class="vikings-icon" />
            <span class="vikings-count">14</span>
        </div>
        <Marriage />
        <Players />
        <Church />
        <Island />
    </div>
</template>

<style scoped>
.map {
    position: relative;
    width: 87.5%;
    background-color: rgba(48, 119, 250, 0.616);
    background-image: url("/src/assets/games/gameAssets/brianboru/sea.png");
    height: 100%;
}

.vikings {
    position: relative;
    top: 1rem;
    left: 1rem;
    border-radius: 50%;
    width: 75px;
    color: white;
    font-size: 2.5rem;
    font-weight: bold;
    display: grid;
    place-items: center;
    height: 75px;
}
.vikings-count {
    transform: translateY(2px);
    font-family: "MedievalSharp";
    position: absolute;
    text-shadow: 0 0 6px black;
}

.vikings-icon {
    filter: brightness(1.1);
}
</style>
