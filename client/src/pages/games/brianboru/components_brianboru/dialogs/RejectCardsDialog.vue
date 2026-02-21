<script setup>
import { computed, ref } from "vue";

import { useAppStore } from "@/store/useAppStore";

import Card from "../Card.vue";

const props = defineProps(["cards", "phases", "closeDialog"]);
const store = useAppStore();
const selectedCards = ref(new Set());

const cardsToReject = computed(() => {
    return 1;
    // return 4 - props.phases.passing.current;
});

const selectCard = (id) => {
    if (selectedCards.value.has(id)) return selectedCards.value.delete(id);
    if (selectedCards.value.size < cardsToReject.value)
        selectedCards.value.add(id);
};

const cards = computed(() => {
    const [cards, lockedCards] = props.cards
    const lockedCardsIds = lockedCards.map(card => card.id)
    return cards
        .filter(
            (card) =>
                card.type !== null && !lockedCardsIds.includes(card.id),
        )
        .sort((a, b) => b.id - a.id);
});

const rejectCards = () => {
    props.closeDialog();
    store.emit("gameData", {
        data: Array.from(selectedCards.value),
        eventName: "selectCardsToPass",
    });
    selectedCards.value = new Set();
};
</script>

<template>
    <div class="dialog">
        <!-- <pre>
            {{ props.cards[1] }}
            {{ props.cards[0] }}
        </pre> -->
        <h2 class="dialogTitle">Wybierz 2 karty, które zostawisz</h2>
        <div class="cards">
            <Card
                v-for="card in cards"
                :key="card.id"
                :card="card"
                :class="{
                    selectedCard: selectedCards.has(card.id),
                    blockedCard: selectedCards.size >= cardsToReject,
                }"
                @click="() => selectCard(card.id)"
            />
        </div>
        <button
            class="dialogButton"
            :disabled="selectedCards.size < cardsToReject"
            @click="rejectCards"
        >
            Odrzuć
        </button>
    </div>
</template>

<style scoped>
.dialog {
    position: absolute;
    top: 50%;
    font-family: "MedievalSharp";
    left: 50%;  z-index: 30;
    transform: translate(-50%, -50%);

    height: 300px;

    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    color: white;
    font-weight: normal;
    padding: 1.25rem 1rem;
    border-radius: 0.5rem;
    background-image: url("/src/assets/games/gameAssets/brianboru/brownTexture.png");
    background-size: cover;
    gap: 2rem;
    box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.358);

    .dialogTitle {
        font-weight: normal;
        letter-spacing: 1px;
        font-size: 2rem;
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
.selectedCard {
    box-shadow: 0 0 5px 3px rgba(255, 255, 255, 0.515);
}

.card:not(.blockedCard),
.selectedCard {
    &:hover {
        cursor: pointer;
        filter: brightness(1.4);
    }
}

.cards {
    display: flex;
    justify-content: space-around;
    width: 100%;
    gap: 1rem;
}
</style>
