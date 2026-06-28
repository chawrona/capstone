<script setup>
import { computed } from "vue";

import MoneyDouble from "@/assets/games/gameAssets/brianboru/money_double_plus.png";
import Money from "@/assets/games/gameAssets/brianboru/money_plus.png";
import Sun from "@/assets/games/gameAssets/brianboru/sun.png";
import City from "@/assets/games/gameAssets/brianboru/triquetra.png";

const props = defineProps(["marriages", "players"]);

const images = [City, Sun, MoneyDouble, MoneyDouble, Money, Money, Money, null];
const classes = [
    "city",
    "sun",
    "doubleMoney",
    "doubleMoney",
    "money",
    "money",
    "money",
    "",
    "",
];

const playersNotInMarriageQueue = computed(() => {
    const playersColor = new Set(
        props.players.map((player) => player.color.hex),
    );
    const colorsToBase = [];

    for (const candidate of props.marriages) {
        if (candidate && playersColor.has(candidate.hex)) {
            colorsToBase.push(candidate.hex);
        }
    }

    return props.players
        .map((player) => player.color.hex)
        .filter((color) => !colorsToBase.includes(color));
});
</script>

<template>
    <div class="marriage">
        <div class="level">
            <div class="circle end">
                <span v-if="props.marriages[props.marriages.length - 1]">
                    <div
                        class="player"
                        :style="`--color: ${props.marriages[props.marriages.length - 2]?.hex}`"
                    ></div>
                </span>
            </div>
        </div>

        <div v-for="(image, index) in images" :key="index" class="level">
            <div class="prize">
                <img v-if="image" :src="image" :class="classes[index]" />
            </div>
            <div class="circle">
                <span
                    v-if="props.marriages[props.marriages.length - index - 2]"
                >
                    <div
                        class="player"
                        :style="`--color: ${props.marriages[props.marriages.length - index - 2]?.hex}`"
                    ></div>
                </span>
            </div>
        </div>
        <div
            class="circle bigCircle"
            :class="{ smallerPadding: playersNotInMarriageQueue.length > 4 }"
        >
            <span
                v-for="(color, index) in playersNotInMarriageQueue"
                :key="index"
                class="player"
                :style="`--color: ${color}`"
            >
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.marriage {
    position: absolute;
    left: 1.5rem;
    bottom: 0.5rem;

    display: flex;
    flex-direction: column;

    gap: 0.5rem;
    background-color: rgba(255, 255, 255, 0);
}

.level {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
}

.prize {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-165%, -50%);
    // background-color: rgba(0, 0, 255, 0.116);
    width: 50px;
    aspect-ratio: 1 / 1;
}
.end.circle {
    position: relative;
}

.end.circle::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    inset: 0;
    height: 260%;
    width: 260%;
    opacity: 0.6;
    transform: translate(-31%, -31%);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("/src/assets/games/gameAssets/brianboru/ozdobnik.png");
    // background-color: red;
}

.circle {
    display: grid;
    place-items: center;
    width: 50px;
    height: 50px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    box-shadow: 0 1px 5px 5px rgba(0, 0, 0, 0.219);
    // background-color: rgb(238, 201, 35);
    background-color: rgb(136, 118, 0);

    background-color: #aab8c45b;

    box-shadow:
        inset 0 1.5px 3px rgba(255, 255, 255, 0.576),
        /* highlight góry */ inset 0 -3px 5px rgba(0, 0, 0, 0.247),
        0 2px 3px rgba(0, 0, 0, 0.308);

    span {
        opacity: 1;
        transition: opacity 0.1s;
    }
}

.money {
    transform: scale(0.85) translateX(-2px);
}

.doubleMoney {
    transform: scale(0.92);
}

.sun,
.city {
    transform: scale(0.9);
}

.sun {
    transform: translateX(-0.5px);
}

.top,
.left,
.right {
    position: absolute;
    width: 50px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 50px;
    // background-color: red;
}

.bigCircle {
    // display: grid;
    // place-items: center;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    justify-content: center;

    align-content: center;
    gap: 0.5rem;
    width: 130px;
    height: 130px;

    &::after {
        content: "";
        position: absolute;
        width: 120px;
        height: 120px;
        top: 50%;
        left: 50%;

        background-repeat: no-repeat;
        background-position: center;

        transform: translate(-50%, -50%);
        opacity: 0.15;
        background-image: url("/src/assets/games/gameAssets/brianboru/letter_white.png");
    }
}

.smallerPadding {
    padding: 1rem;
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
        0 2px 3px rgba(0, 0, 0, 0.308);
}
</style>
