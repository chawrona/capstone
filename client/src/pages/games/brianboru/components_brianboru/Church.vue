<script setup>
import { ref } from "vue";

import WhiteChurch from "@/assets/games/gameAssets/brianboru/church_white.png";
import Map from "@/assets/games/gameAssets/brianboru/map_icon.png";
import Points from "@/assets/games/gameAssets/brianboru/points.png";
import Sun from "@/assets/games/gameAssets/brianboru/sun.png";
import City from "@/assets/games/gameAssets/brianboru/triquetra.png";
import Vikings from "@/assets/games/gameAssets/brianboru/vikings.png";

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
            class="marriage-image"
            :src="`/src/assets/games/gameAssets/brianboru/marriages/${marriage.name}.png`"
        />
        <p class="marriageName">{{ marriage.name }}</p>
        <div class="marriagePoints">
            <div v-if="marriage.name === 'Estrid'" class="estrid">
                <img :src="Vikings" class="estrid-icon" />
                <span> Lub </span>
                <img :src="Map" class="estrid-icon" />
            </div>

            <div
                v-if="marriage.points && marriage.name !== 'Estrid'"
                class="points"
            >
                <img :src="Points" alt="" />
                <span>{{ marriage.points }}</span>
            </div>
            <div
                v-if="marriage.suns && marriage.name !== 'Estrid'"
                class="suns"
            >
                <img :src="Sun" alt="" />
                <span>{{ marriage.suns }}</span>
            </div>
            <div
                v-if="marriage.region && marriage.name !== 'Estrid'"
                class="region"
                :class="{
                    longName: marriage.region.length > 10,
                }"
            >
                <span>{{ marriage.region }}</span>
                <img :src="City" />
            </div>
        </div>
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
    width: 187px;
    height: 283px;
    cursor: pointer;

    &:hover {
        filter: brightness(1.1);
    }
}

.marriage {
    padding: 0;
    overflow: hidden;

    box-shadow: 0 1px 5px 5px rgba(0, 0, 0, 0.219);

    background-color: transparent;
    background-repeat: no-repeat;
    background-size: contain;
    height: 283px;
    width: 187px;

    .marriageName {
        top: 0.75rem;
        width: 100%;
        position: absolute;
        height: 38px;
        display: grid;
        place-items: center;
        // background-color: red;
        font-family: "MedievalSharp";
        font-weight: bold;
        color: white;
        font-size: 1.5rem;
        transform: translateY(2px);
        filter: drop-shadow(1px 1px 3px rgb(8, 8, 0));
    }

    .marriagePoints {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        bottom: 14px;
        width: 115px;
        position: absolute;
        height: 49px;

        background-color: rgba(182, 170, 147, 0.603);
        font-family: "MedievalSharp";
        font-weight: bold;
        border-radius: 0.2rem;
        color: white;
        // background: rgba(0, 0, 255, 0.671);
        font-size: 1.5rem;
        box-shadow: 0px 1px 2px 3px rgba(58, 22, 2, 0.582);
    }

    .estrid {
        display: flex;
        width: 100%;
        align-items: center;
        font-size: 1.2rem;
        justify-content: space-evenly;
        filter: drop-shadow(1px 1px 2px rgba(33, 36, 1, 0.952));
        img {
            height: 24px;
        }
    }

    .region {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 48px;
        width: 55px;
        font-size: 0.7rem;
        padding: 2px;
        padding-top: 4px;
        text-align: center;
        // background-color: red;
        filter: drop-shadow(1px 1px 2px rgba(33, 36, 1, 0.952));

        img {
            height: 28px;
        }

        &.longName {
            font-size: 0.85rem;
            justify-content: center;
            img {
                display: none;
                // height: 12px;
            }
        }
    }

    .points {
        flex-shrink: 0;
        display: flex;
        position: relative;
        height: 35px;
        transform: translateY(-1px);

        filter: drop-shadow(1px 1px 2px rgba(33, 36, 1, 0.952));
        img {
            transform: translateY(-1px);
            height: 100%;
        }

        span {
            position: absolute;
            top: 50%;
            font-size: 1.1rem;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .suns {
        flex-shrink: 0;
        display: flex;
        position: relative;
        height: 30px;

        transform: translateY(-1px);

        filter: drop-shadow(1px 1px 2px rgba(33, 36, 1, 0.952));
        img {
            transform: translateY(-1px);
            height: 100%;
        }

        span {
            position: absolute;
            filter: drop-shadow(1px 1px 3px rgb(0, 0, 0));
            top: 50%;
            font-size: 1.1rem;
            left: 50%;
            transform: translate(-55%, -48%);
        }
    }
}

.marriage-image {
    width: 100%;
    height: 100%;
    max-width: none;
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
