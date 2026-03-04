<script setup>
import { ref, watch } from "vue";

import gwiazda from "@/assets/games/gameAssets/philanthropists/gwiazda.png";

// import useSound from "../../composables/useSound";

const props = defineProps(["gameData"]);

const radius = 115;

const czas = ref(props.gameData.timer);
watch(
    () => props.gameData.timer,
    (newVal) => {
        czas.value = newVal;
    },
);

let interval = null;

const startCountdown = () => {
    if (interval) clearInterval(interval);

    interval = setInterval(() => {
        if (props.gameData.pauza) return;

        //  if (czas.value < 11 && props.gameData.active) {
        //   useSound("Tykanie zegara")
        //  }

        if (czas.value > 0) {
            czas.value--;
        } else {
            clearInterval(interval);
        }
    }, 1000);
};

watch(
    () => props.gameData.nickAktualnegoGracza,
    (newTimer) => {
        czas.value = props.gameData.timer;
        startCountdown();
    },
    { immediate: true },
);

function getXY(index) {
    const theta =
        (2 * Math.PI * (index - props.gameData.whosTurn)) /
            props.gameData.gracze.length +
        Math.PI / 2;
    const x = radius * Math.cos(theta) + radius;
    const y = radius * Math.sin(theta) + radius;
    return { x, y };
}

const getStyle = (index) => {
    const { x, y } = getXY(index);
    return `top: ${y}px; left: ${x}px;`;
};
</script>

<template>
    <div class="stolik">
        <div class="faza">
            <p>
                Faza: <span class="numberFont">{{ props.gameData.faza }}/</span
                ><span class="numberFont">{{ props.gameData.fazy }}</span>
            </p>
            <p>
                Tura: <span class="numberFont">{{ props.gameData.tura }}/</span
                ><span class="numberFont">{{ props.gameData.tury }}</span>
            </p>
        </div>

        <div class="stol">
            <div class="stol_image">
                <div class="timer">
                    {{
                        `0${parseInt(czas / 60)}:${czas % 60 < 10 ? "0" : ""}${czas % 60}`
                    }}
                </div>
            </div>

            <div
                v-for="(gracz, index) in props.gameData.gracze"
                class="gracz"
                :data-gracz="index"
                :style="getStyle(index)"
            >
                <span
                    :class="
                        props.gameData.firstPlayerIndex === index
                            ? 'gracznazwa'
                            : ''
                    "
                >
                    <img
                        v-if="props.gameData.firstPlayerIndex === index"
                        :src="gwiazda"
                        class="gwiazda"
                    />
                    {{ gracz.name }}
                </span>

                <div class="filantropiaInfo">
                    <div class="filantropiaKarty">
                        <div
                            v-for="karta in gracz.filantropiaKarty"
                            :class="{ jestKarta: karta }"
                            class="karta"
                        ></div>
                    </div>

                    <div class="hajsssss">{{ gracz.filantropiaHajs }}$</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.stolik {
    position: relative;
    width: 100%;
    height: 77.5%;
    background-image: url("/public/assets/games/gameAssets/philanthropists/floor.png");
}

/* @import url('src/assets/stolik.jpg'); */

.stol {
    position: absolute;
    top: 52.5%;
    left: 50%;
    width: 260px;
    aspect-ratio: 1 / 1;
    transform: translate(-50%, -50%);
    z-index: 999;
}

.gwiazda {
    width: 1.5rem;
    height: 1.5rem;
}

.stol_image {
    width: 260px;
    aspect-ratio: 1 / 1;
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    box-shadow: 0px 0px 10px 8px rgba(0, 0, 0, 0.807);
    transform: translate(-50%, -50%);
    background-image: url("/src/assets/games/gameAssets/philanthropists/stolik.jpg");
}

.faza {
    color: white;
    font-weight: bold;
    font-size: 1.5rem;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
}

.gracz {
    position: absolute;
    /* font-weight: bold; */
    /* background-color: red; */
    width: max-content;
    font-size: 1.25rem;
    text-transform: uppercase;
    color: white;
    transform: translate(calc(-50% + 15px), calc(-50% + 15px));
    transition:
        top 0.7s,
        left 0.7s;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.35rem;
}

.filantropiaInfo {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 4rem;
    width: 3rem;
    background-color: #0e0e0e;
    border-radius: 0.25rem;
    /* background-image: url("/src/assets/games/gameAssets/philanthropists/deska.png"); */
    background-size: contain;
    cursor: pointer;

    &:hover {
        .hajsssss {
            opacity: 1;
        }
    }
}

.filantropiaKarty {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.2rem;
    padding: 0.25rem;
    width: 100%;
    height: 100%;
}

.karta {
    border-radius: 0.1rem;
    background-color: rgb(36, 36, 36);
}

.jestKarta {
    /* background-color: #fff; */
    background-image: url("/src/assets/games/gameAssets/philanthropists/karta.webp");
}

.gracznazwa {
    display: flex;
    align-items: center;
    gap: 0.15rem;
    font-weight: bold;
    transform: translateX(-0.75rem);
    font-weight: bold;
    color: rgb(234, 251, 255);
    letter-spacing: 0.4px;
}

.timer {
    position: absolute;
    top: 50%;
    left: 50%;
    color: white;
    font-size: 2.4rem;
    transform: translate(-50%, -53%);
}

.hajsssss {
    display: grid;
    place-items: center;
    opacity: 0;
    background-color: rgb(0, 19, 1);
    transition: opacity 0.1s;
    position: absolute;
    inset: 0;
    font-size: 1rem;
    border-radius: 0.25rem;
}
</style>
