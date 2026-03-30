<script setup>
import SrodekKarty from "../SrodekKarty.vue";
import Kwadraty from "./Kwadraty.vue";
import Specjalny from "./Specjalny.vue";

const props = defineProps(["gameData"]);

import guma from "@/assets/games/gameAssets/philanthropists/guma.png";
import herbata from "@/assets/games/gameAssets/philanthropists/herbata.png";
import kawa from "@/assets/games/gameAssets/philanthropists/kawa.png";
import sol from "@/assets/games/gameAssets/philanthropists/sol.png";
import wegiel from "@/assets/games/gameAssets/philanthropists/wegiel.png";
import zboze from "@/assets/games/gameAssets/philanthropists/zboze.png";

import { useAppStore } from "../../../../store/useAppStore";

// import useSound from "../../composables/useSound";

const store = useAppStore();

const kup = (typ) => {
    if (props.gameData.manilupujemy) return console.log("Faza manipulacji");
    if (!props.gameData.twojaTura) return console.error("Nie Twoja Tura");
    if (
        props.gameData.czyMozeKupic ||
        props.gameData.licznikSprzedazyLubKupowania === 3
    )
        return;
    if (props.gameData.pauza) return console.log("PAUZA");
    // useSound("Kupowanie kart");

    store.emit("gameData", {
        data: typ,
        eventName: "kup",
    });
};
</script>
<template>
    <div class="plansza">
        <div class="pola">
            <div class="wrapper">
                <div class="row">
                    <Specjalny :game-data="props.gameData" />
                </div>

                <div
                    v-for="(row, index) in props.gameData.plansza"
                    :key="index"
                    class="row"
                >
                    <img
                        v-if="index === 0"
                        class="ikoneczka1 wegiel"
                        :src="wegiel"
                        alt=""
                    />
                    <img
                        v-if="index === 1"
                        class="ikoneczka1"
                        :src="zboze"
                        alt=""
                    />
                    <img
                        v-if="index === 2"
                        class="ikoneczka1"
                        :src="kawa"
                        alt=""
                    />
                    <img
                        v-if="index === 3"
                        class="ikoneczka1"
                        :src="guma"
                        alt=""
                    />
                    <img
                        v-if="index === 4"
                        class="ikoneczka1"
                        :src="herbata"
                        alt=""
                    />
                    <img
                        v-if="index === 5"
                        class="ikoneczka1"
                        :src="sol"
                        alt=""
                    />

                    <Kwadraty
                        :current-field="row.current"
                        :type="row.type"
                        :grass="index % 2 ? 'grass1' : 'grass2'"
                        :last-or-first="
                            index === 5 ? 'last' : index === 0 ? 'first' : ''
                        "
                    />

                    <img
                        v-if="index === 0"
                        class="ikoneczka2 wegiel"
                        :src="wegiel"
                        alt=""
                    />
                    <img
                        v-if="index === 1"
                        class="ikoneczka2"
                        :src="zboze"
                        alt=""
                    />
                    <img
                        v-if="index === 2"
                        class="ikoneczka2"
                        :src="kawa"
                        alt=""
                    />
                    <img
                        v-if="index === 3"
                        class="ikoneczka2"
                        :src="guma"
                        alt=""
                    />
                    <img
                        v-if="index === 4"
                        class="ikoneczka2"
                        :src="herbata"
                        alt=""
                    />
                    <img
                        v-if="index === 5"
                        class="ikoneczka2"
                        :src="sol"
                        alt=""
                    />
                </div>
            </div>
        </div>

        <div class="karty">
            <div
                v-for="(type, index) in Object.entries(props.gameData.bank)"
                :key="index"
                class="card"
                :class="type[1] === 0 ? 'wyzerowane' : ''"
                :data-card="type"
                :style="`background-color: ${type[1] !== 0 ? 'var(--' + type[0] + ')' : ''}`"
                @click="() => kup(type[0])"
            >
                <SrodekKarty
                    :material="type[0]"
                    :karta="true"
                    :czy-wyzerowane="type[1] === 0"
                />

                <span class="ilosc1">{{ type[1] !== 0 ? type[1] : "" }}</span>
                <span class="ilosc2">{{ type[1] !== 0 ? type[1] : "" }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.wrapper::before {
    position: absolute;
    content: "";
    left: 0;
    top: 0;
    height: 100%;
    transform: translateX(-100%);
    width: 45px;
    z-index: 998;
    background-image: url("/src/assets/games/gameAssets/philanthropists/podstawka3.jpg");
    border-bottom-left-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
    box-shadow: 0 0 3px 5px rgba(0, 0, 0, 0.555);
}
.wrapper::after {
    position: absolute;
    content: "";
    right: 0;
    top: 0;
    height: 100%;
    transform: translateX(100%);
    width: 45px;
    z-index: 998;
    background-image: url("/src/assets/games/gameAssets/philanthropists/podstawka3.jpg");
    border-bottom-right-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    box-shadow: 0 0 3px 5px rgba(0, 0, 0, 0.555);
}

.ikoneczka1 {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(calc(-100% - 10px), calc(-50% - 10px));
    z-index: 999;
    width: 45px;
    height: 45px;
    margin: 10px;

    &:first-of-type {
        filter: brightness(1.3);
    }
}

.ikoneczka1.wegiel,
.ikoneczka2.wegiel {
    filter: drop-shadow(0px 0px 3px rgba(255, 255, 255, 0.589));
}

.ikoneczka2 {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(100%, -50%);
    z-index: 999;
    width: 45px;
    height: 45px;

    &:first-of-type {
        filter: brightness(1.5);
    }
}

.ilosc1 {
    position: absolute;
    top: 0.75rem;
    left: 1.15rem;
    font-size: 1.4rem;
    color: rgb(29, 20, 11);
}

.ilosc2 {
    position: absolute;
    bottom: 0.75rem;
    right: 1.15rem;
    font-size: 1.4rem;
    color: rgb(29, 20, 11);
}

.pola {
    display: grid;
    place-items: center;
    height: 75%;
    width: 100%;

    justify-content: center;
}
.wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;

    /* padding: 0.5rem; */
    box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.555);
    background-size: cover;
    border-radius: 0.5rem;
}

.row {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    /* background-color: #6a7e58; */
}

.row:nth-of-type(2n) {
    background-color: #a5c28a;
}

.card {
    position: relative;
    display: grid;
    place-items: center;
    font-size: 2rem;
    font-weight: bold;
    width: 170px;
    height: 105px;
    background-color: rgb(31, 32, 29);
    border-radius: 0.5rem;
    padding: 0.4rem;

    box-shadow: 2px 2px 4px 3px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition: filter 0.1s;
    &:hover {
        filter: brightness(0.75);
    }
}

.card.wyzerowane:hover {
    filter: brightness(1.1);
}

[data-card="guma"] {
    background-color: var(--guma);
}
[data-card="kawa"] {
    background-color: var(--kawa);
}
[data-card="sol"] {
    background-color: var(--sol);
}
[data-card="zboze"] {
    background-color: var(--zboze);
}
[data-card="wegiel"] {
    background-color: var(--wegiel);
}
[data-card="herbata"] {
    background-color: var(--herbata);
}

.plansza {
    position: relative;
    display: flex;
    flex-direction: column;
    height: calc(100% - 2rem);
    margin: 1rem;
    width: calc(78% - 2rem);
    padding: 1rem;

    box-shadow: 0 0 8px 8px rgba(0, 0, 0, 0.555);
    border-radius: 1rem;
    background-image: url("/public/assets/games/gameAssets/philanthropists/podstawka.jpg");
    isolation: isolate;

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        border-radius: 0.5rem;
        background-color: rgba(26, 14, 0, 0.396);
    }
}

.pola {
    height: 75%;
}

.karty {
    display: flex;
    justify-content: space-between;
    height: 25%;
    padding: 1rem 1rem;
    align-items: center;
}
</style>
