<script setup>
import { computed, ref } from "vue";

import statuses from "../../../../../../server/models/games/brianboru/config/statuses";
import { useAppStore } from "../../../../store/useAppStore";
import Card from "./Card.vue";

const props = defineProps(["chosenCards", "you", "status"]);
const store = useAppStore();

const canChoose = computed(() => {
    return props.status === statuses.CHOOSE_CARD_EFFECT;
});

const canChooseHover = (player) => {
    return canChoose.value && player.username === props.you.username;
};

const chosenCard = ref(null)
const choosenBottom = ref('bottom1')
const dialogOpen = ref(false)
const closeDialog = () => dialogO
pen.value = true;

const dialogData = ref({
    buildCity: 
});

const openChooseCardDialog = (chosenBottom, card, player) => {
    dialogData.value = {
        buidCity:
    }
}

const chooseCardEffect = () => {
    if (!canChoose.value) return alert("Can't");

    store.emit("gameData", {
        data: "",
        eventName: "chooseCardEffect",
    });
};



</script>

<template>
    <!-- <pre>
        {{ props.chosenCards }}
    </pre> -->
    <div class="dialog" v-if="dialogOpen">
        <h1 class="dialogTitle">Efekt karty</h1>

        <div class="dialogContent">
            <p>Aktualna liczba monet: {{ props.you.money  + }}</p>
            <div>
                <button>-1</button> <p>Dokup X Y za Z monet </p> <button>+1</button>
            </div>

            <div>
                <p>Czy chcesz zbudować miasto?</p>
                Tak
                <input type="radio" name="buildCity" id="buildCityTrue">
                Nie
                <input type="radio" name="buildCity" id="buildCityFalse">
            </div>


        </div>

        <button class="dialogButton" @click="closeDialog">
            Focus na Senseia
        </button>
    </div>


    <div class="chosenCards">
        <div
            v-for="[card, player] in props.chosenCards"
            class="wrap"
            :style="`--color: ${player.color.hex};`"
            :data-type="card.type"
            @click="openChooseCardDialog(card, player)"
        >
            <Card
                :key="card.id"
                :card="card"
                :can-choose="canChooseHover(player)"
                class="chosenCard"
                :owner="player"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.wrap {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
}

.chosenCards {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    // background-color: rgba(255, 0, 0, 0.404);
    position: absolute;
    top: 8rem;
    height: 80%;
    justify-content: start;
    align-content: start;
    align-items: start;

    width: 350px;

    transform: scale(0.9);
    gap: 1rem;
    left: 8%;
    padding-bottom: 0.5rem;
}

[data-type="red"] .username {
    background-color: rgb(138, 0, 0);
}

[data-type="blue"] .username {
    background-color: rgb(0, 64, 142);
}

[data-type="yellow"] .username {
    background-color: rgb(136, 118, 0);
}

[data-type="gray"] .username {
    background-color: rgb(119, 119, 119);
}

.username {
    z-index: 2;
    //  height: 220px;
    //  width: 1.2rem;
    width: 145px;
    box-shadow: 0px 4px 4px 3px rgba(0, 0, 0, 0.658);
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    display: block;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 0.1px;
    margin-inline: auto;
    text-align: center;
    display: block;
    padding: 0.25rem 0.5rem;
    // text-orientation: sideways;
    //  writing-mode: sideways-lr;
    color: white;
}

.dialog {
    position: absolute;
    top: 50%;
    font-family: "MedievalSharp";
    left: 50%;
    transform: translate(-50%, -65%);

    text-shadow: 0 0 4px rgba(0, 0, 0, 0.74);
    height: 300px;
    width: 600px;
    justify-content: space-between;
    padding: 2rem 1rem;
    box-shadow: 0px 2px 5px 3px rgba(0, 0, 0, 0.685);

    display: flex;
    flex-direction: column;
    align-items: center;

    position: absolute;
    color: white;
    font-weight: normal;

    z-index: 30;
    border-radius: 0.5rem;
    background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_grey.jpg");
    background-size: cover;
    gap: 2rem;

    .dialogTitle {
        letter-spacing: 1px;
        font-size: 2rem;
    }
    .dialogContent {
        font-size: 1.5rem;
    }
    .dialogButton {
        font-size: 1.25rem;
        border: none;
        border-radius: 0.25rem;
        padding: 0.5rem 1.75rem;

        &[disabled="true"] {
            color: red;
        }
    }
}
</style>
