<script setup>
import { computed } from "vue";

const props = defineProps([
    "bid",
    "auctionPrice",
    "bidIncrement",
    "currentPlayer",
    "cannotBid",
]);

const isDisable = computed((money) => {
    return (
        props.currentPlayer.publicId === props.cannotBid ||
        props.auctionPrice + props.bidIncrement > props.currentPlayer.money
    );
});
</script>

<template>
    <button
        v-if="!isDisable"
        class="bid-button"
        @click="() => bid(bidIncrement)"
    >
        {{ bidIncrement }}$
    </button>
</template>
<style scoped lang="css">
.bid-button {
    padding-block: 0.65rem;
    width: 80px;
    text-align: center;
    opacity: 0.5;
    background-color: #40a2e4;
    color: white;
    border: none;
    border-radius: 0.35rem;
    font-family: "Open sans";
    font-size: 1.25rem;
    cursor: not-allowed;

    &:not([disabled]) {
        opacity: 1;
        cursor: pointer;
        &:hover {
            filter: brightness(0.95);
        }
    }
}
</style>
