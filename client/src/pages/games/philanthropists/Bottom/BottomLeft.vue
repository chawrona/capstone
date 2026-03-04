<script setup>
import guma from "@/assets/games/gameAssets/philanthropists/guma.png";
import herbata from "@/assets/games/gameAssets/philanthropists/herbata.png";
import ikonka from "@/assets/games/gameAssets/philanthropists/ikonka.png";
import kawa from "@/assets/games/gameAssets/philanthropists/kawa.png";
import sol from "@/assets/games/gameAssets/philanthropists/sol.png";
import wegiel from "@/assets/games/gameAssets/philanthropists/wegiel.png";
import zboze from "@/assets/games/gameAssets/philanthropists/zboze.png";

import { useAppStore } from "../../../../store/useAppStore";
import SrodekKarty from "../SrodekKarty.vue";
// import useSound from "../../composables/useSound";

const props = defineProps(["gameData"]);

const ikony = {
    guma,
    herbata,
    kawa,
    sol,
    wegiel,
    zboze,
};

const store = useAppStore();

const manipuluj = (index, wartosc) => {
    if (!props.gameData.mozeManipulować) return console.error("Nie Twoja Tura");
    if (!props.gameData.twojaTura) return console.error("Nie Twoja Tura");
    if (!props.gameData.manilupujemy) return console.log("Faza manipulacji");
    if (props.gameData.pauza) return console.log("PAUZA");

    // if (wartosc > 0 ) {
    //   useSound("Kliknięcie");
    // } else {
    //   useSound("Manipulacja na minus");
    // }

    store.emit("gameData", {
        data: ["lewa", index],
        eventName: "uzyjManipulacji",
    });
};
</script>

<template>
    <div class="bottom-left">
        {{ console.log(props.gameData.lewyNick) }}
        <h2 class="nick">
            {{ props.gameData.lewyNick }}
            <span class="graczObok">(Gracz po lewej)</span>
        </h2>
        <div class="cards">
            <div
                v-for="(card, index) in props.gameData.leweKarty"
                class="card"
                :class="card ? 'cardShadow' : 'pusta'"
                :data-card="card ? card.typ : 'pusta'"
                @click="() => manipuluj(index, card.wartosc)"
            >
                <div v-if="card" class="wrapper">
                    <div class="informacja numberFont">
                        <p>
                            {{
                                card.wartosc > 0
                                    ? `+${card.wartosc}`
                                    : card.wartosc
                            }}
                        </p>
                        <img :src="ikonka" alt="" class="idk" />
                        <p>
                            {{
                                card.wartosc > 0
                                    ? `+${card.wartosc}`
                                    : card.wartosc
                            }}
                        </p>
                    </div>
                    <div class="obrazek">
                        <div class="obrazek1" :class="card.typ">
                            <img
                                :src="ikony[card.typ]"
                                alt=""
                                class="ikoneczka"
                                :class="card.typ"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.bottom-left {
    height: 100%;
    width: 45%;
    display: flex;
    padding: 1rem;
    flex-direction: column;
    gap: 0.25rem;
}

.obrazek1 {
    background-size: cover;
    &.guma {
        background-image: url("/src/assets/games/gameAssets/philanthropists/gumCard.jpeg");
    }

    &.kawa {
        background-image: url("/src/assets/games/gameAssets/philanthropists/coffeeCard.png");
    }

    &.herbata {
        background-image: url("/src/assets/games/gameAssets/philanthropists/teaCard.png");
    }

    &.sol {
        background-image: url("/src/assets/games/gameAssets/philanthropists/saltCard.png");
    }

    &.wegiel {
        background-image: url("/src/assets/games/gameAssets/philanthropists/coalCard.jpeg");
    }

    &.zboze {
        background-image: url("/src/assets/games/gameAssets/philanthropists/wheatCard.jpeg");
    }
}

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
    --border: #5f4d39;
}

.zboze {
    --kolor: var(--zboze-gradient);
}

.ikoneczka {
    position: absolute;
    width: 2.1rem;
    height: 2.1rem;
    background-color: rgb(4, 0, 255);
    left: 50%;
    bottom: 0%;
    transform: translate(-50%, 19%);
    border-radius: 50%;

    --border: #000000a9;
    background: var(--kolor);
    box-shadow: 0 0 1px 2px rgba(90, 52, 2, 0.63);
    background-size: 175%;

    filter: drop-shadow(0 0 0.25rem rgba(0, 0, 0, 0.534));
}

.informacja {
    height: 22.5%;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.05rem;
    padding-top: 0.2rem;
    justify-content: space-evenly;
    font-size: 1.3rem;
    color: #291501;
}

.idk {
    align-self: center;

    width: 1rem;
    height: 1rem;
}

.wrapper {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
    background: url("/src/assets/games/gameAssets/philanthropists/karta.webp");
}

.obrazek {
    height: 77.5%;
    width: 100%;
    padding: 0.25rem 0.4rem;
    padding-top: 0.25rem;
}

.obrazek1 {
    position: relative;
    height: 95%;
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.15rem;
    box-shadow: 0 0 1px 3px rgba(90, 52, 2, 0.63);
}

.graczObok {
    font-size: 0.65em;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.699);
}

.nick {
    align-self: start;
    font-size: 1.9rem;
    color: white;
}

.cards {
    width: 100%;
    display: flex;
    gap: 0.25rem;
}

.card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    font-weight: bold;
    width: 13%;
    padding: 0.3rem;
    aspect-ratio: 3.5/5;
    border-radius: 0.5rem;
    background: var(--bg);

    cursor: pointer;
    transition: filter 0.2s;
    &:hover {
        filter: brightness(0.75);
    }
}

.cardShadow {
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.692);
}

.pusta {
    cursor: auto;
}
</style>
