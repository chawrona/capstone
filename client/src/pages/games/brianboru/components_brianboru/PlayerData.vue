<script setup>
import { computed, ref } from "vue";

import { cities } from "../../../../../../server/models/games/brianboru/config/cities";
import statuses from "../../../../../../server/models/games/brianboru/config/statuses";
import { soundBus } from "../../../../audio/soundBus";
import { useAppStore } from "../../../../store/useAppStore";
import Card from "./Card.vue";

const props = defineProps(["cards", "status", "cityUnderAttack", "hideCards"]);
const store = useAppStore();

const cards = computed(() => {
    return props.cards[0]
        .filter((card) => card.type !== null)
        .sort((a, b) => b.id - a.id);
});

const showCards = ref(true);

const toggleCards = () => {
    showCards.value = !showCards.value;
};

const chooseCard = (card) => {
    if (!canChooseCard(card.type)) return;

    if (props.status === statuses.CHOOSE_FIRST_CARD) {
        store.emit("gameData", {
            data: card.id,
            eventName: "chooseFirstCard",
        });
        soundBus.playEffect("chooseCard");
    } else if (props.status === statuses.CHOOSE_CARD) {
        store.emit("gameData", {
            data: card.id,
            eventName: "chooseCard",
        });
        soundBus.playEffect("chooseCard");
    }
};

const canChooseCard = (cardType) => {
    if (
        props.status !== statuses.CHOOSE_CARD &&
        props.status !== statuses.CHOOSE_FIRST_CARD
    )
        return;

    if (props.status === statuses.CHOOSE_CARD) return true;
    return (
        cardType === "gray" || cardType === cities[props.cityUnderAttack].type
    );
};
</script>

<template>
    <div class="playerData">
        <div
            class="cards"
            :class="{ show: showCards }"
            :style="`opacity: ${hideCards ? 0 : 1}`"
        >
            <Card
                v-for="card in cards"
                :key="card.id"
                :card="card"
                class="player-card"
                :class="{ hidden: showCards }"
                :can-choose="canChooseCard(card.type)"
                @click="() => chooseCard(card)"
            />
        </div>
        <div
            class="toggle"
            :style="`opacity: ${hideCards ? 0 : 1}`"
            @click="toggleCards"
        >
            {{ showCards ? "Pokaż karty" : "Ukryj karty" }}
        </div>
    </div>
</template>

<style scoped lang="scss">
.playerData {
    font-family: "MedievalSharp";
    display: flex;

    position: absolute;
    bottom: 0.5rem;
    bottom: calc(0.5rem - 157px);
    // background-color: rgba(255, 0, 0, 0.616);

    z-index: 2;
}

.toggle {
    transition: opacity 0.5s;
    position: absolute;
    display: grid;
    place-items: center;
    font-family: sans-serif;
    font-size: 1rem;
    color: white;
    font-weight: bold;
    right: 0rem;

    transform: translateX(100%);
    width: 7rem;
    padding: 0.5rem;
    height: 3.5rem;
    border-radius: 0.25rem;
    text-align: center;
    background-color: rgb(0, 0, 0);

    cursor: pointer;

    &:hover {
        background-color: rgb(42, 42, 42);
    }
}
.cards {
    transform: translateY(-71.5%);
    // flex-direction: column;
    align-items: center;
    margin-inline: auto;
    padding-inline: 1rem;

    display: flex;
    justify-content: center;
    transition:
        transform 0.2s,
        opacity 0.5s;
    gap: 0.5rem;

    .player-card {
        transition: transform 0s;
    }
}

.show {
    transform: translateY(0);
}
</style>
