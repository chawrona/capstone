<script setup>
import { computed } from "vue";

import Card from "./Card.vue";

const props = defineProps([
    "propertyCard",
    "closeDialogs",
    "mortgagePropertyCard",
    "redeemPropertyCard",
    "currentPlayer",
    "playersData"
]);

const mortgage = computed(() => {
    return props.currentPlayer.mortgagedCards.includes(
        props.propertyCard.position,
    );
});
</script>

<template>
    <div class="dialog">
        <h2 class="question">
            {{
                mortgage
                    ? "Czy chcesz odkupić kartę?"
                    : "Czy chcesz zastawić kartę?"
            }}
        </h2>
        <Card :property-card="propertyCard" :players-data="playersData"/>
        <div class="buttons">
            <button
                class="eurobusiness-button mortgage-button"
                @click="
                    () =>
                        mortgage
                            ? redeemPropertyCard(propertyCard)
                            : mortgagePropertyCard(propertyCard)
                "
            >
                {{ mortgage ? "Odkup" : "Zastaw" }}
            </button>
            <button
                class="eurobusiness-button close-button"
                @click="closeDialogs"
            >
                Odpuść
            </button>
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
    gap: 1rem;

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

    .question {
        font-size: 2.25rem;
        margin-bottom: 0.25rem;
    }

    .buttons {
        display: flex;
        gap: 2rem;
    }

    .mortgage-button,
    .close-button {
        width: 120px;
        padding-block: 0.5rem;
    }

    .mortgage-button {
        background-color: rgb(47, 192, 18);

        &:hover {
            background-color: rgb(35, 172, 8);
        }
    }

    .close-button {
        background-color: rgb(211, 38, 38);

        &:hover {
            background-color: rgb(172, 8, 8);
        }
    }
}
</style>
