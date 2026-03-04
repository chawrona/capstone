<script setup>
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";

import plus from "@/assets/games/gameAssets/philanthropists/plus.png";

import SrodekKarty from "../SrodekKarty.vue";

const props = defineProps(["gameData"]);

import guma from "@/assets/games/gameAssets/philanthropists/guma.png";
import herbata from "@/assets/games/gameAssets/philanthropists/herbata.png";
import kawa from "@/assets/games/gameAssets/philanthropists/kawa.png";
import sol from "@/assets/games/gameAssets/philanthropists/sol.png";
import wegiel from "@/assets/games/gameAssets/philanthropists/wegiel.png";
import zboze from "@/assets/games/gameAssets/philanthropists/zboze.png";

// import useSound from "../../composables/useSound";
import { useAppStore } from "../../../../store/useAppStore";

const ikony = {
    guma,
    herbata,
    kawa,
    sol,
    wegiel,
    zboze,
};

const modalRef = ref(false);
const reff = ref(null);

onClickOutside(reff, () => {
    modalRef.value = false;
});

const store = useAppStore();

const indexRef = ref(null);

const filantropia = (typ) => {
    if (!props.gameData.twojaTura) return console.error("Nie Twoja Tura");
    if (props.gameData.dalFilantropie) return;
    if (props.gameData.pauza) return console.log("PAUZA");

    modalRef.value = false;
    props.gameData.filantropiaKarty[indexRef.value] = typ;
    // useSound("Oddanie kart na filantropię");

    store.emit("gameData", {
        data: [typ, indexRef.value],
        eventName: "oddajFilantropia",
    });
};

const oddajFilantropia = (typ, indeks) => {
    if (props.gameData.manilupujemy) return console.log("Faza manipulacji");
    if (!props.gameData.twojaTura) return console.error("Nie Twoja Tura");
    if (props.gameData.dalFilantropie) return;
    if (props.gameData.pauza) return console.log("PAUZA");

    if (!typ) {
        indexRef.value = indeks;
        modalRef.value = true;
    } else {
        console.error("Nie ma modala");
    }
};
</script>

<template>
    <div class="filantropia">
        <div class="plansza">
            <div class="hajsiwo">
                <span class="">{{ `${props.gameData.filantropiaHajs}$` }}</span>
            </div>

            <div class="karty">
                <div v-if="modalRef" ref="reff" class="modal">
                    <img
                        v-for="(karta, index) in [
                            ...new Set(props.gameData.karty),
                        ]"
                        :src="ikony[karta]"
                        :class="`wybor ${karta}`"
                        @click="() => filantropia(karta)"
                    />
                </div>
                <div
                    v-for="indeks in 4"
                    class="card"
                    :class="
                        props.gameData.filantropiaKarty[indeks - 1]
                            ? ''
                            : 'null'
                    "
                    :data-card="props.gameData.filantropiaKarty[indeks - 1]"
                    :style="`background-color: var(--${props.gameData.filantropiaKarty[indeks - 1] ? props.gameData.filantropiaKarty[indeks - 1] : 'null'})`"
                    @click="
                        () =>
                            oddajFilantropia(
                                props.gameData.filantropiaKarty[indeks - 1],
                                indeks - 1,
                            )
                    "
                >
                    <img
                        v-if="!props.gameData.filantropiaKarty[indeks - 1]"
                        :src="plus"
                        alt=""
                        class="plus"
                    />
                    <SrodekKarty
                        v-if="props.gameData.filantropiaKarty[indeks - 1]"
                        :material="props.gameData.filantropiaKarty[indeks - 1]"
                        :karta="true"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.guma {
    --kolor: var(--guma-gradient);
}

.kawa {
    --kolor: var(--kawa-gradient);
}

.herbata {
    --kolor: var(--herbata-gradient);
}

.sol {
    --kolor: linear-gradient(
        47deg,
        rgb(158, 158, 158) 0%,
        rgb(151, 151, 151) 25%,
        rgb(148, 148, 148) 50%,
        rgb(117, 117, 117) 74%,
        rgb(110, 110, 110) 100%
    );
}

.wegiel {
    --kolor: var(--wegiel-gradient);
}

.zboze {
    --kolor: var(--zboze-gradient);
}

.modal {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    position: absolute;
    place-items: center;
    inset: 0;
    background: rgba(0, 0, 0, 0.918);
    border-radius: 0.5rem;
    z-index: 999;
}

.wybor {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: var(--kolor);
    --border: #725f4a8a;
    box-shadow: 0 0 2px 3px var(--border);
    cursor: pointer;

    &:hover {
        filter: brightness(0.8);
    }
}

.plus {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 500;
    width: 3rem;
    height: 3rem;
}
.ff {
    font-size: 1.5rem;
}

.filantropia {
    width: 33%;

    height: 100%;
    position: relative;
}

.plansza {
    position: relative;
    transform: scale(0.8) translate(3.6rem, -1.75rem);

    display: flex;
    padding: 1rem 1rem;
    gap: 1rem;
    border-radius: 0.35rem;

    box-shadow: 0 0 6px 6px rgba(0, 0, 0, 0.455);
    border-radius: 1rem;
    background-image: url("/public/assets/games/gameAssets/philanthropists/podstawka.jpg");
    background-size: contain;

    isolation: isolate;
    overflow: hidden;

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background-color: rgba(26, 14, 0, 0.506);
    }
}

.hajsiwo {
    height: 100%;
    height: 247px;
    background-color: rgb(11, 99, 30);
    background-image: url("/public/assets/games/gameAssets/philanthropists/grass1.jpg");
    width: 35%;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    gap: 0.25rem;
    color: white;
    font-weight: bold;
    box-shadow: 2px 2px 4px 3px rgba(0, 0, 0, 0.5);
}

.karty {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    width: 440px;
    border-radius: 0.5rem;
    padding: 0px 0;
    gap: 0.5rem;
    display: flex;

    align-items: center;
}

.card {
    position: relative;
    width: 190px;
    height: 120px;
    border-radius: 0.5rem;
    padding: 0.5rem;
    --null: #1f201d00;
    --border: red;
    background-size: cover;
    box-shadow: 2px 2px 4px 3px rgba(0, 0, 0, 0.5);
}

.null {
    position: relative;
    cursor: pointer;
    padding: 0;
    background-size: auto;
    background-image: url("/public/assets/games/gameAssets/philanthropists/floor2.png");
    &::after {
        content: "";
        inset: 0.5rem;
        border-radius: 0.4rem;
        background-color: #1d1d1d00;
        /* background-image: url("/images/floor2.png"); */
        position: absolute;
        z-index: 100;
    }

    &:hover {
        filter: brightness(1.2);
    }
}
</style>
