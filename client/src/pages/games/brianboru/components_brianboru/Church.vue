<script setup>
import { ref } from "vue";

import WhiteChurch from "@/assets/games/gameAssets/brianboru/church_white.png";

const props = defineProps(["church", "marriage"]);

const flag = ref(true);

const change = () => (flag.value = !flag.value);
</script>

<template>
    <div v-if="flag" class="church" @click="change">
        <img :src="WhiteChurch" alt="" class="icon" />
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
    border-radius: 0.15rem;
    // background-color: white;
    gap: 2rem;
    background-color: #aab8c45b;
    box-shadow: 2px 2px 10px 2px rgba(0, 0, 0, 0.314);
    box-shadow:
        rgba(204, 219, 232, 0.527) 3px 3px 6px 0px inset,
        rgba(255, 255, 255, 0.259) -3px -3px 6px 1px inset;
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
    height: 72px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.35;
}

.players {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
    gap: 0.5rem;
    grid-row: 2;
    width: 150px;
    height: 100%;
}

.player {
    z-index: 3;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.349);
    background-color: hsl(from var(--color) h s calc(l * 1));
    box-shadow:
        inset 0 1.5px 3px rgba(255, 255, 255, 0.576),
        /* highlight góry */ inset 0 -3px 5px rgba(0, 0, 0, 0.247),
        0 2px 3px rgba(0, 0, 0, 0.562);
}
</style>
