<script setup>
import { ref, watch } from "vue";

import crown from "@/assets/games/gameAssets/philanthropists/crown.png";
import user from "@/assets/games/gameAssets/philanthropists/user.png";
import trash from "@/assets/games/gameAssets/philanthropists/villager.png";

import SrodekKarty from "./SrodekKarty.vue";

// import useSound from "../composables/useSound";
const coPokazujemyRef = ref(false);

const props = defineProps(["gameData"]);

const dunno = () => {
    if (!coPokazujemyRef.value) coPokazujemyRef.value = true;
    else {
        if (coPokazujemyRef.value === "koniec") props.gameData.active = false;

        if (props.gameData.koniecGry) {
            // if (coPokazujemyRef.value !== "koniec") useSound("Koniec gry", 0.5);
            coPokazujemyRef.value = "koniec";
        } else {
            props.gameData.podsumowanieFazy = false;
        }
    }
};

// watch(() => props.gameData.podsumowanieFazy, (newValue) => {
//     if (newValue === true) useSound("Wygrana");
// });
</script>

<template>
    <div v-if="props.gameData.podsumowanieFazy" class="dropdown"></div>

    <div v-if="props.gameData.podsumowanieFazy" class="div">
        <h1 class="podsumowanko">
            {{
                coPokazujemyRef === "koniec"
                    ? "Podsumowanie"
                    : !coPokazujemyRef
                      ? "Przekazane karty"
                      : !props.gameData.koniecGry
                        ? "Tabela filantropów"
                        : "Końcowa tabela filantropów"
            }}
        </h1>

        <div v-if="!coPokazujemyRef" class="gracze">
            <div
                v-for="podsumowanie in props.gameData.podsumowanieFilantropii"
                class="jedenGracz"
            >
                <p class="nick">{{ podsumowanie.nick }}</p>
                <div class="tabela1">
                    <div class="row">
                        <div v-for="karta in podsumowanie.karty" class="karta">
                            <div
                                class="card"
                                :data-typ="karta.typ"
                                :style="`background-color: var(--${karta.typ})`"
                            >
                                <SrodekKarty :material="karta.typ" />
                            </div>
                            <div class="hajs">{{ karta.cena }}$</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="coPokazujemyRef === true" class="tabelaFilantropii">
            <div class="row1">
                <div class="td">Gracz</div>
                <div class="td">Dotacje</div>
                <div class="td">Majątek</div>
            </div>
            <div
                v-for="gracz in props.gameData.podsumowanieWynikow"
                class="row1"
                :class="gracz.kolor"
                :style="`--lastOrder: ${gracz.lastOrder}; --order: ${gracz.order}`"
            >
                <div class="td">{{ gracz.name }}</div>
                <div class="td">{{ gracz.dotacje }}$</div>
                <div class="td">{{ gracz.hajs }}$</div>
            </div>
        </div>

        <div v-if="coPokazujemyRef === 'koniec'" class="koniec">
            <div class="eeeee">
                {{ console.log(props.gameData.koniecDane) }}
                <p
                    v-for="(gracz, index) in props.gameData.koniecDane"
                    :class="
                        index === 0
                            ? 'filantrop'
                            : index === props.gameData.koniecDane.length - 1
                              ? 'chlop'
                              : 'mieszanie'
                    "
                >
                    <img
                        :src="
                            index === 0
                                ? crown
                                : index === props.gameData.koniecDane.length - 1
                                  ? trash
                                  : user
                        "
                    />
                    {{
                        index === 0
                            ? "Real Player:"
                            : index === props.gameData.koniecDane.length - 1
                              ? "Villager: "
                              : "Regular:"
                    }}
                    <span class="white">{{ gracz.name }}</span>
                </p>
            </div>
            <div class="wyniczki">
                <p>Tabela rekordów</p>
                <ul>
                    <li v-for="(rekord, index) in props.gameData.rekordy">
                        <span
                            >{{ index + 1 }}. {{ rekord.name }} -
                            {{ rekord.hajs }}<span class="hajss">$</span></span
                        >
                    </li>
                </ul>
            </div>
        </div>

        <button class="button" @click="dunno">
            {{
                coPokazujemyRef === "koniec"
                    ? "Menu"
                    : !coPokazujemyRef
                      ? "Dalej"
                      : props.gameData.koniecGry
                        ? "Dalej"
                        : "Zamknij"
            }}
        </button>
    </div>
</template>

<style scoped>
.kasaWynik {
    font-size: 1.5rem;
}
.eeeee {
    width: 65%;
}
.hajss {
    color: rgb(0, 175, 0);
}
.wyniczki {
    width: 35%;
    align-items: center;
    text-shadow: 2px 2px 5px rgb(0, 0, 0);
    p {
        font-weight: 600;
        font-size: 2rem;
        margin-top: 0.7rem;
    }
    ul {
        margin-top: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        list-style: none;
        margin-left: 1.6rem;
        color: #ffffff;

        li:first-of-type {
            color: gold;
        }
        li:nth-of-type(2) {
            color: #cbd8d8;
        }
        li:nth-of-type(3) {
            color: rgb(228, 132, 24);
        }
    }
}
.white {
    color: white;
}
.filantrop {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: gold;
    font-weight: bold;
    margin-bottom: 0.25rem;
    font-size: 3rem;
    img {
        width: 6rem;
        filter: drop-shadow(3px 3px 5px black);
    }
    text-shadow: 2px 2px 5px rgb(0, 0, 0);
}

.mieszanie {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #0099ff;
    text-shadow: 2px 2px 5px rgb(0, 0, 0);
    font-size: 2rem;
    font-weight: 700;

    margin-top: 0.25rem;
    img {
        width: 4rem;
        margin-left: 1rem;
        filter: drop-shadow(3px 3px 5px black);
    }
}
.chlop {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #ce0000;
    font-weight: bold;
    font-size: 2.5rem;
    text-shadow: 2px 2px 5px rgb(0, 0, 0);
    margin-top: 0.5rem;
    img {
        width: 7rem;
        margin-left: -0.5rem;
        filter: drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.877));
    }
}

.koniec {
    font-size: 2rem;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    color: white;
    grid-template-columns: 1fr;
    padding: 2rem 3rem 2rem 3rem;

    & > div {
        display: flex;
        flex-direction: column;
        /* align-items: start; */
        justify-content: start;
    }
}

.tabelaFilantropii {
    font-size: 2rem;
    width: 100%;
    position: relative;
    display: grid;
    color: white;
    grid-template-columns: 1fr;
}

.row1 {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.row1:first-of-type {
    font-weight: 600;
    border-radius: 0.5rem;

    &::before {
        background-color: rgba(177, 138, 12, 0.734);
        background-color: rgba(20, 20, 20, 0.8);
    }
}

.row1 {
    position: relative;

    border-radius: 0.5rem;
    background-image: url("/public/assets/games/gameAssets/philanthropists/floor.png");
    background-size: contain;

    &::before {
        background-color: rgba(35, 35, 37, 0.8);
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;

        border-radius: 0.5rem;
    }
}

.zloto {
    z-index: 200;
    border-radius: 0.5rem;

    &::before {
        background-color: rgba(151, 119, 13, 0.8);
    }
}
/* .srebro {
    background-color: rgba(116, 116, 116, 0);
    border-radius: 0.5rem;
}
.braz {
    background-color: rgba(85, 28, 2, 0);
    border-radius: 0.5rem;

} */

.ostatni {
    border-radius: 0.5rem;
    z-index: 199;
    &::before {
        background-color: rgba(49, 2, 2, 0.8);
    }
}

.td:nth-of-type(1) {
    width: 75%;
    padding-left: 0.75rem;
}
.td:nth-of-type(2) {
    width: 12.5%;
    text-align: center;
}
.td:nth-of-type(3) {
    width: 12.5%;
    text-align: center;
}

.row1 {
    position: absolute;
    padding: 0.5rem;
    width: calc(100% - 8rem);
    margin-inline: 4rem;
    transform: translateY(
        calc(
            0.5rem * (var(--lastOrder) + 1) + 2rem + 100% *
                (var(--lastOrder) + 1)
        )
    );
    animation: moveElement 1.5s forwards;
    box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.438);
}

@keyframes moveElement {
    0%,
    30% {
        transform: translateY(
            calc(
                0.5rem * (var(--lastOrder) + 1) + 2rem + 100% *
                    (var(--lastOrder) + 1)
            )
        );
    }
    100% {
        transform: translateY(
            calc(0.5rem * (var(--order) + 1) + 2rem + 100% * (var(--order) + 1))
        );
    }
}

.row1:first-of-type {
    position: relative;
}

.div {
    min-height: 636px;
    min-width: 1410px;
    border-radius: 1rem;
    background-image: url("/src/assets/games/gameAssets/philanthropists/podstawka.jpg");
    box-shadow: 1px 1px 3px 5px rgba(0, 0, 0, 0.555);
}

.card {
    background: var(--kolor);
    --border: #725f4a8a;
    box-shadow: 0 0 2px 3px var(--border);
}

.null + .hajs {
    color: transparent;
}
.tabelaFilantropii {
    width: 100%;
    padding: 2rem 0rem;
}

.button {
    margin-top: auto;
    margin-left: auto;

    display: flex;
    justify-content: center;
    align-items: center;
    width: 10rem;
    gap: 0.5rem;
    border-radius: 0.5rem;
    height: 3.5rem;
    padding: 0;
    font-size: 1.5rem;
    font-weight: 600;
    background-color: #fff;

    box-shadow: 2px 2px 3px 3px rgba(0, 0, 0, 0.432);

    &:hover {
        background-color: #cfcfcf;
    }
}
.gracze {
    width: 100%;
    display: grid;
    gap: 1.5rem 3rem;
    padding: 2rem 4rem;
    grid-template-columns: 1fr 1fr 1fr;
}
.nick {
    font-weight: 600;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: white;
}
.row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.karta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    gap: 0.5rem;
    color: white;
}

.card {
    width: 90px;
    height: 112px;
    background-color: rgb(31, 32, 29);
    border-radius: 0.5rem;
    padding: 0.3rem;
    box-shadow: 2px 2px 4px 3px rgba(0, 0, 0, 0.5);
    cursor: pointer;
}

.null {
    position: relative;
    cursor: auto;
    &::after {
        content: "";
        inset: 0.5rem;
        border-radius: 0.4rem;
        background-color: #1d1d1d;
        position: absolute;
        z-index: 100;
    }

    &:hover {
        filter: none;
    }
}

.nic {
    cursor: auto;
    background-color: transparent;
    box-shadow: none;

    &:hover {
        filter: none;
    }
}

.podsumowanko {
    font-size: 2.5rem;
    text-align: center;
    color: white;
    font-weight: 600;
}

.row {
    display: flex;
}

.dropdown {
    position: absolute;
    width: 1920px;
    top: 0;
    left: 0;
    height: 1080px;
    background-color: rgba(0, 0, 0, 0.473);
    z-index: -1;
    z-index: 99999;
}

.div {
    padding: 1rem 1rem;
    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);
    position: absolute;
    z-index: 100000;
    isolation: isolate;
    display: flex;
    flex-direction: column;
}
</style>
