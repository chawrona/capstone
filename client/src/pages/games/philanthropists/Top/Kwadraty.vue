<script setup>
const divCount = 30;

defineProps({
    currentField: Number,
    grass: String,
    lastOrFirst: String,
    type: String,
});

import guma from "@/assets/games/gameAssets/philanthropists/pionek_guma.png";
import herbata from "@/assets/games/gameAssets/philanthropists/pionek_herbata.png";
import kawa from "@/assets/games/gameAssets/philanthropists/pionek_kawa.png";
import sol from "@/assets/games/gameAssets/philanthropists/pionek_sol.png";
import wegiel from "@/assets/games/gameAssets/philanthropists/pionek_wegiel.png";
import zboze from "@/assets/games/gameAssets/philanthropists/pionek_zboze.png";

const ikony = {
    guma,
    herbata,
    kawa,
    sol,
    wegiel,
    zboze,
};
</script>

<template>
    <div class="container" :class="lastOrFirst">
        <img
            :src="ikony[type]"
            class="pioneczek"
            :data-current="currentField"
            :style="`transform: translate(${currentField * 45 + 2.5}px ,2.5px);`"
        />

        <div
            v-for="(n, index) in divCount"
            :key="n"
            class="kwadrat"
            :class="
                index === 8 && grass === 'grass1'
                    ? 'grass4'
                    : index === 8 && grass === 'grass2'
                      ? 'grass3'
                      : grass === 'grass1'
                        ? 'grass1'
                        : grass === 'grass2'
                          ? 'grass2'
                          : ''
            "
        ></div>
    </div>
</template>

<style scoped>
.pioneczek {
    position: absolute;
    width: 40px;
    height: 40px;
    transition: transform 0.5s;
    transform: translateY(2.5px);
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.486)) brightness(1.15);
}

.container {
    display: flex;
    position: relative;
}

.kwadrat {
    width: 45px;
    height: 45px;
    border: 1px solid #c4c4c4;
}

.first .kwadrat {
    border-top: none;
}

.last .kwadrat {
    border-bottom: none;
}

.kwadrat:first-of-type {
    border-left: none;
}

.kwadrat:last-of-type {
    border-right: none;
}

.grass1 {
    background-image: url("/src/assets/games/gameAssets/philanthropists/grass1.jpg");
    background-size: contain;
}
.grass2 {
    background-image: url("/src/assets/games/gameAssets/philanthropists/grass2.jpg");
    background-size: contain;
}
.grass3 {
    background-image: url("/src/assets/games/gameAssets/philanthropists/grass3.jpg");
    background-size: contain;
}

.grass4 {
    background-image: url("/src/assets/games/gameAssets/philanthropists/grass4.jpg");
    background-size: contain;
}

.tlo {
    background-color: #704a04;
}

[data-current="true"] {
    position: relative;
    background-color: #fff;

    &::after {
        position: absolute;
        inset: 0;
        background-color: red;
        content: "";
    }
}

.tlo {
    border-color: #5a3c04;
}
</style>
