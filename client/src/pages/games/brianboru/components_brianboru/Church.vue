<script setup>
import { ref } from "vue";

import Church from "@/assets/games/gameAssets/brianboru/church_icon.png";

const props = defineProps(["church", "marriage"]);

const flag = ref(true);

const change = () => (flag.value = !flag.value);
</script>

<template>
    <div v-if="flag" class="church" @click="change">
        <img :src="Church" alt="" class="icon" />
        <div class="players">
            <div
                v-for="(color, index) in props.church"
                :key="index"
                class="player"
                :style="`--color: ${color.hex}`"
            />
        </div>
    </div>
    <div v-else class="marriage" @click="change">
        <img
            :src="`/src/assets/games/gameAssets/brianboru/${marriage.name.toLowerCase()}.jpg`"
        />
    </div>
</template>

<style scoped lang="scss">
.church,
.marriage {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    padding: 1.25rem 1rem;
    border-radius: 0.5rem;
    // background-color: white;
    gap: 2rem;
    background-color: #ffffff11;
    box-shadow: 2px 2px 10px 2px rgba(0, 0, 0, 0.314);
    width: 202px;
    height: 283px;
    cursor: pointer;

    &:hover {
        filter: brightness(1.1);
    }
}

.marriage {
    padding: 0;
    overflow: hidden;
    background-image: url("/src/assets/games/gameAssets/brianboru/pergamin.webp");
    box-shadow: 0 1px 5px 5px rgba(0, 0, 0, 0.219);

    img {
        width: 100%;
        height: 100%;
    }
}

.icon {
    height: 96px;
}

.players {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    align-items: start;
    align-content: start;
    gap: 0.5rem;
    grid-row: 2;
    width: 170px;
    height: 115px;
}

.player {
    width: 27px;
    height: 27px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.349);
    background-color: hsl(from var(--color) h s calc(l * 1));
    box-shadow:
        inset 0 1.5px 3px rgba(255, 255, 255, 0.576),
        /* highlight góry */ inset 0 -3px 5px rgba(0, 0, 0, 0.247),
        0 2px 3px rgba(0, 0, 0, 0.308);
}
</style>
