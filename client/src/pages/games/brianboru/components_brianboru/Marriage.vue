<script setup>
import MoneyDouble from "@/assets/games/gameAssets/brianboru/money_double_plus.png";
import Money from "@/assets/games/gameAssets/brianboru/money_plus.png";
import Sun from "@/assets/games/gameAssets/brianboru/sun.png";
import City from "@/assets/games/gameAssets/brianboru/triquetra.png";

const props = defineProps(["marriages"]);

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
];
</script>

<template>
    <div class="marriage">
        <div class="level">
            <!-- <div class="top"></div> -->
            <!-- <div class="left"></div> -->
            <div class="circle"></div>
            <!-- <div class="right"></div> -->
        </div>

        <div v-for="(image, index) in images" :key="index" class="level">
            <div class="prize">
                <img v-if="image" :src="image" :class="classes[index]" />
            </div>
            <div class="circle">
                <span v-if="props.marriages[index]">
                    {{ props.marriages[index] }}
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.marriage {
    position: absolute;
    left: 0.5rem;
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
    transform: translate(-50%, -50%);
    // background-color: rgba(0, 0, 255, 0.116);
    width: 90%;
    aspect-ratio: 1 / 1;
}

.circle {
    width: 45px;
    height: 45px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    box-shadow: 0 1px 5px 5px rgba(0, 0, 0, 0.219);
    // background-color: rgb(238, 201, 35);
    background-color: rgb(136, 118, 0);

    &:hover span {
        opacity: 0;
    }

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

.top {
    // background-color: #666666;
    top: 0;
    transform: translate(-50%, -85%);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("/src/assets/games/gameAssets/brianboru/ozdobnik.png");
}

.left {
    left: 0;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("/src/assets/games/gameAssets/brianboru/ozdobnik.png");
    transform: translate(50%, -35%);

    rotate: -90deg;
    transform-origin: center;
}

.right {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    left: auto;
    right: 0;
    rotate: 90deg;
    transform: translate(-52%, -33%);
    transform-origin: center;
    background-image: url("/src/assets/games/gameAssets/brianboru/ozdobnik.png");
}
</style>
