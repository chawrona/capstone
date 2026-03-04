<script setup>
import { watch } from "vue";

import hourglass from "@/assets/games/gameAssets/philanthropists/hourglass.png";

import { useAppStore } from "../../../../store/useAppStore";
// import useSound from "../../composables/useSound";

const store = useAppStore();

const props = defineProps(["gameData"]);

const dalej = () => {
    if (props.gameData.pauza) return console.log("PAUZA");
    // useSound("Kliknięcie");

    store.emit("gameData", {
        data: {},
        eventName: "dalej",
    });
};

watch(
    () => props.gameData.twojaTura,
    () => {
        console.log("??????????????????????????????");

        // if (props.gameData.twojaTura) {
        //   useSound("Nowa Tura");
        // }
    },
    { immediate: true },
);
</script>

<template>
    <div class="decyzje">
        <h1 class="info">
            {{ props.gameData.graczCoRobi }}
        </h1>

        <div class="div">
            <button
                v-if="props.gameData.twojaTura && props.gameData.faza % 2 !== 0"
                class="button"
                @click="dalej"
            >
                <img class="img" :src="hourglass" />
            </button>
        </div>
    </div>
</template>

<style scoped>
.button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 9rem;
    gap: 0.5rem;
    border-radius: 0.5rem;
    height: 4rem;
    padding: 0;
    font-size: 1.5rem;
    font-weight: 600;
    background-color: #fff;

    box-shadow: 2px 2px 3px 3px rgba(0, 0, 0, 0.432);

    &:hover {
        background-color: #dfcba3;
    }
}

.img {
    width: 3rem;
    height: 3rem;
}

.div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: auto;
    justify-content: end;
}

.decyzje {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    margin: 0 auto;
    width: 30%;
    height: 100%;
    padding: 0.5rem;
}

.info {
    font-weight: 600;
    color: white;
    text-align: center;
    font-size: 2.35rem;
    width: 20ch;
    margin: 0 auto;
}
</style>
