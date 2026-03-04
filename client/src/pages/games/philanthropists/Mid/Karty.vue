<script setup>
import { useAppStore } from "../../../../store/useAppStore";
import SrodekKarty from "../SrodekKarty.vue";
// import useSound from "../../composables/useSound";

const props = defineProps(["gameData"]);
const store = useAppStore();
const sortKarty = (k) => {
    const order = ["wegiel", "zboze", "kawa", "guma", "herbata", "sol"];
    return k.sort((a, b) => order.indexOf(a) - order.indexOf(b));
};

const sprzedaj = (typ) => {
    if (props.gameData.manilupujemy) return console.log("Faza manipulacji");
    if (!props.gameData.twojaTura) return console.error("Nie Twoja Tura");
    if (
        props.gameData.czyMozeSprzedac ||
        props.gameData.licznikSprzedazyLubKupowania === 3
    )
        return;

    if (props.gameData.pauza) return console.log("PAUZA");
    // useSound("Sprzedanie kart");

    store.emit("gameData", {
        data: typ,
        eventName: "sprzedaj",
    });
};
</script>

<template>
    <div class="karty">
        <div
            v-for="typ in sortKarty(props.gameData.karty)"
            class="card"
            :data-typ="typ"
            :style="`background-color: var(--${typ})`"
            @click="() => sprzedaj(typ)"
        >
            <SrodekKarty :material="typ" />
        </div>
    </div>
</template>

<style scoped>
.karty {
    align-items: start;
    justify-content: start;
    display: flex;
    flex-wrap: wrap;
    width: 33%;
    height: 100%;
    gap: 0.75rem 0.75rem;
    padding: 0rem 0rem;
    padding-bottom: 0;
    transform: scale(0.8) translate(-3.6rem, -1.75rem);
}

.card {
    width: 108px;
    height: 151px;
    background-color: rgb(31, 32, 29);
    border-radius: 0.5rem;
    padding: 0.4rem;
    box-shadow: 2px 2px 4px 3px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition: filter 0.2s;
    &:hover {
        filter: brightness(0.75);
    }
}
</style>
