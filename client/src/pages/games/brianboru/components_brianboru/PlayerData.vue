<script setup>
import { computed, ref } from "vue";

import Card from "./Card.vue";

const props = defineProps(["cards"]);

const cards = computed(() => {
    return props.cards[0]
        .filter((card) => card.type !== null)
        .sort((a, b) => b.id - a.id);
});

const showCards = ref(true)

const toggleCards = () => {
    showCards.value = !showCards.value
}

</script>

<template>
    <div class="playerData">
        <div class="cards" :class="{show: showCards}">
            <Card v-for="card in cards" :key="card.id" :card="card" class="player-card"/>
        </div>
        <div class="toggle" @click="toggleCards">
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
    // background-color: rgba(255, 0, 0, 0.616);
    
    z-index: 2;
}


.toggle {
    position: absolute;
    display: grid;
    place-items: center;
    font-family: sans-serif;
    font-size: 1rem;
    color: white;
    font-weight: bold;
    right: 0rem;
    bottom: 0rem;
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
    transform: translateY(75%);
    // flex-direction: column;
    align-items: center;
margin-inline: auto;
  padding-inline: 1rem;

    display: flex;
 justify-content: center;
  transition: transform 0.2s;
    gap: 0.5rem;

    .player-card {
        transition: transform 0.2s;
    }
}

.show {
    transform: translateY(0);
}

</style>
