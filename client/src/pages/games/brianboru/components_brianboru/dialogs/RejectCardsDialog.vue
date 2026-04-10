<script setup>
import { computed, ref } from "vue";

import { useAppStore } from "@/store/useAppStore";

import Card from "../Card.vue";
import PlayerIcon from "../PlayerIcon.vue";

const props = defineProps(["cards", "phases", "closeDialog", "nextPlayer"]);
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
    const [cards, lockedCards] = props.cards;
    const lockedCardsIds = lockedCards.map((card) => card.id);
    return cards
        .filter(
            (card) => card.type !== null && !lockedCardsIds.includes(card.id),
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
        <h1 class="dialogTitle">Przekazywanie kart</h1>

        <div class="dialogContent">
            <p>
                Wybierz 2 karty, które sobie zostawisz.

                <PlayerIcon :player="nextPlayer" />
                otrzyma pozostałe
            </p>
            <div class="cards-wrap">
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
        </div>

        <button
            class="dialogButton blueButton"
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
    left: 50%;
    z-index: 30;
    transform: translate(-50%, -65%);

    text-shadow: 0 0 4px rgba(0, 0, 0, 0.74);

    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    color: white;
    font-weight: normal;
    padding: 1.2rem 2rem;
    border-radius: 0.5rem;
    background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_grey_big.jpg");
    background-size: cover;
    gap: 0rem;

    height: 440px;
    /* width: 600px; */
    justify-content: space-between;
    padding: 2rem 1rem;
    box-shadow: 0px 2px 5px 3px rgba(0, 0, 0, 0.685);

    .dialogTitle {
        letter-spacing: 1px;
        font-size: 2rem;
    }

    .dialogContent {
        p {
            max-width: none;
            margin-block: 1rem;
        }
        font-size: 1.5rem;
        text-align: center;
    }

    .dialogButton {
        margin-top: 1rem;
        font-size: 1.25rem;
        border: none;
        border-radius: 0.25rem;
        padding: 0.5rem 1.75rem;

        &[disabled="true"] {
            background-color: red;
        }
    }
}
.selectedCard {
    box-shadow: 0px 0px 5px 4px rgba(255, 255, 255, 0.658);
}

.card:not(.blockedCard),
.selectedCard {
    &:hover {
        cursor: pointer;
        filter: brightness(1.2);
    }
}

.cards-wrap {
    display: flex;
    justify-content: space-around;
    width: 100%;
    gap: 0rem;

    .card {
        scale: 0.9;
    }
}

</style>
