<script setup>
import { computed } from "vue";

import Card from "./Card.vue";

const props = defineProps([
    "propertyCard",
    "closeDialogs",
    "houseIndex",
    "currentPlayer",
    "playersData",
    "sellHouse",
    "buyHouse",
]);

const houseAmount = computed(() => {
    return props.currentPlayer.properties[props.houseIndex] ?? 0;
});

const canBuyHouse = computed(() => {
    if (houseAmount.value <= 5) return false;

    props.currentPlayer.ownerships;

    const setAmount = props.propertyCard.set[1];
    let currentAmount = 0;

    for (const tile of currentPlayer.ownerships) {
        if (tile.set[0] === props.propertyCard.set[0]) {
            currentAmount++;
        }
    }

    if (setAmount !== currentAmount) {
        return false;
    }

    return true;
});

const canSellHouse = computed(() => {
    return houseAmount.value > 0;
});
</script>

<template>
    <div class="dialog">
        <h2 class="question">Rezerwacje sal</h2>
        <p>Aktualna liczba rezerwacji: {{ houseAmount }}</p>
        <div class="wrapper">
            <Card :property-card="propertyCard" :players-data="playersData" />

            <div class="buttons">
                <button
                    class="eurobusiness-button reservation-button"
                    :disabled="!canBuyHouse"
                    @click="() => buyHouse(houseIndex)"
                >
                    Zarezerwuj salę -{{ propertyCard.housePrice }}$
                </button>
                <button
                    class="eurobusiness-button cancel-button"
                    :disabled="!canSellHouse"
                    @click="() => sellHouse(houseIndex)"
                >
                    Odwołaj rezerwację +{{
                        (propertyCard.housePrice / 2).toFixed(0)
                    }}$
                </button>
                <button
                    class="eurobusiness-button close-button"
                    @click="closeDialogs"
                >
                    Wyjdź
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.dialog {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 550px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    gap: 0rem;

    font-family: "Open Sans", sans-serif;
    font-size: 1.5rem;
    color: #ffffff;
    padding: 2rem 2rem;

    border: 4px solid #ffffff;
    border-radius: 0.5rem;
    outline: 6px solid #40a2e4;

    background: linear-gradient(
        142deg,
        rgba(64, 162, 228, 1) 0%,
        rgba(43, 135, 196, 1) 100%
    );
    box-shadow:
        rgba(0, 0, 0, 0.35) 0px 20px 40px,
        rgba(0, 0, 0, 0.32) 0px 12px 12px;

    h2 {
        margin-bottom: 0rem;
    }
    .buttons {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .cancel-button {
        margin-bottom: auto;
        background-color: rgb(211, 107, 38);
        padding-block: 0.85rem;
        &:hover {
            background-color: rgb(233, 135, 70);
        }

        &[disabled] {
            cursor: not-allowed;
            color: #bebebe;
            background-color: rgb(141, 141, 141);
        }
    }

    .reservation-button {
        padding-block: 0.85rem;
        background-color: #1f3d6b;
        &:hover {
            background-color: #2456a0;
        }

        &[disabled] {
            cursor: not-allowed;
            color: #bebebe;
            background-color: rgb(141, 141, 141);
        }
    }

    .close-button {
        background-color: rgb(211, 38, 38);
        padding-block: 0.85rem;

        &:hover {
            background-color: rgb(172, 8, 8);
        }
    }
}

.wrapper {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}
</style>
