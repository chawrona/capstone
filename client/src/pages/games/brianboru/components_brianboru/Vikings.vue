<script setup>
import { computed } from "vue";

import WhiteAxe from "@/assets/games/gameAssets/brianboru/axe_white.png";
import Sun from "@/assets/games/gameAssets/brianboru/sun.png";
import Vikings from "@/assets/games/gameAssets/brianboru/vikings.png";

const props = defineProps(["vikings", "players"]);

const data = [
    {
        color: "#d72638",
        color: { hex: "#d72638" },
        money: 2,
        points: 13,
        publicId: "XX",
        suns: 2,
        username: "SenseiW",
        vikings: 2,
    },
    {
        color: "#3b82f6",
        color: { hex: "#3b82f6" },
        firstPlayer: true,
        money: 2,
        points: 11,
        publicId: "XX",
        suns: 3,
        username: "ArekiS",
        vikings: 3,
    },
    {
        color: "#22c55e",
        color: { hex: "#22c55e" },
        money: 14,
        points: 12,
        publicId: "XX",
        suns: 2,
        username: "TDS",
        vikings: 1,
    },
    {
        color: { hex: "#9333ea" },
        money: 6,
        points: 8,
        publicId: "XX",
        suns: 2,
        username: "Versus137",
        vikings: 2,
    },
    {
        color: "#f97316",
        color: { hex: "#f97316" },
        money: 4,
        points: 10,
        publicId: "XX",
        suns: 1,
        username: "Dawid",
        vikings: 4,
    },
];
</script>

<template>
    <div class="wrap">
        <img :src="WhiteAxe" alt="" class="axe-icon" />
        <div v-if="14" class="vikingsWrapper">
            <div v-for="viking in 0" :key="viking" class="vikings">
                <img :src="Vikings" class="vikings-icon" />
            </div>
        </div>

        <div class="rightContainer">
            <div
                v-for="player in props.players"
                class="playerData"
                :style="`--color: ${player.color.hex}`"
            >
                <div class="vikingsPlayers">
                    <div class="player"></div>
                    <img
                        v-for="viking in player.vikings"
                        :key="viking"
                        :src="Vikings"
                        alt=""
                        class="icon"
                        :data-size="player.vikings"
                    />
                </div>
            </div>
        </div>

        <div class="vikingsPlayers">
            <!-- <div class="playerData"
                v-for="player in props.players"
                :style="`--color: ${player.color.hex}`"
            >

                <div class="player"></div>

                {{ player.suns }}
                <img
                    v-for="sun in player.suns"
                    :key="sun"
                    :src="Sun"
                    class="icon sun"
                /> 

                {{ player.vikings }}
                <div class="vikingsIcons">
                 
                </div>
            </div> -->
        </div>
    </div>
</template>

<style scoped>
.wrap {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    box-shadow: 2px 2px 10px 2px rgba(0, 0, 0, 0.314);
    box-shadow:
        rgba(0, 0, 0, 0.12) 0px 1px 3px,
        rgba(0, 0, 0, 0.24) 0px 1px 2px;

    box-shadow:
        rgba(6, 24, 44, 0.4) 0px 0px 0px 2px,
        rgba(6, 24, 44, 0.65) 0px 4px 6px -1px,
        rgba(255, 255, 255, 0.08) 0px 1px 0px inset;

    box-shadow:
        rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset,
        rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
    box-shadow:
        rgba(0, 0, 0, 0.19) 0px 10px 20px,
        rgba(0, 0, 0, 0.23) 0px 6px 6px;
    box-shadow:
        rgb(204, 219, 232) 3px 3px 6px 0px inset,
        rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
    box-shadow:
        rgba(204, 219, 232, 0.527) 3px 3px 6px 0px inset,
        rgba(255, 255, 255, 0.259) -3px -3px 6px 1px inset;
}

.axe-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.35;
}

.vikingsWrapper {
    padding: 0.5rem;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    width: calc((55px * 7) + 6 * 0.5rem + 1rem);
    height: calc(1rem + 0.5rem + 2 * 55px);
    background-color: #aab8c45b;
    border-radius: 0.15rem;
}

.vikings {
    position: relative;
    border-radius: 50%;
    width: 55px;
    color: white;
    font-size: 2.5rem;
    font-weight: bold;
    display: grid;
    background-color: red;
    place-items: center;
    height: 55px;
    box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.477);
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

.vikingsPlayers {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.15rem;

    & > .icon:first-of-type {
        margin-left: 0.5rem;
    }

    .icon {
        width: 21px;
        height: 21px;
        filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.767));
    }
}

.playersData {
    display: flex;
}

.player {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.349);
    background-color: hsl(from var(--color) h s calc(l * 1));
    box-shadow:
        inset 0 1.5px 3px rgba(255, 255, 255, 0.576),
        /* highlight góry */ inset 0 -3px 5px rgba(0, 0, 0, 0.247),
        0 2px 3px rgba(0, 0, 0, 0.308);
}

.rightContainer {
    display: flex;
    justify-content: start;
    gap: 0.15rem;
    flex-direction: column;
    position: absolute;
    left: 458px;
    top: 0;
    height: 134px;
    width: max-content;
}
</style>
