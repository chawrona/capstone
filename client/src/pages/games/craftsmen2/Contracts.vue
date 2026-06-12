<script setup>
import ContractCard from "./ContractCard.vue";

const props = defineProps([
    "rerollCost",
    "contracts",
    "availableActions",
    "you",
    "canReroll",
]);
</script>

<template>
    <div class="contracts">
        <ContractCard
            v-for="(contract, index) in props.contracts"
            :id="index"
            :key="index"
            :can-reroll="props.canReroll"
            :contract="contract"
            :reroll-cost="props.rerollCost"
            :available-actions="props.availableActions"
            :you="props.you"
            :style="`z-index: -${index}`"
            :show-reroll="index === 2"
        />
    </div>
</template>

<style scoped>
.contracts {
    position: absolute;
    display: flex;
    justify-content: space-between;
    bottom: 1rem;
    right: 1rem;
    isolation: isolate;
    height: 250px;
}
</style>
