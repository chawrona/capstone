<script setup>
import ContractCard from "./ContractCard.vue";

const props = defineProps(["rerollCost", "contracts", "availableActions", "you", "canReroll"])


</script>

<template>
    <div class="contracts">
        <ContractCard
            v-for="(contract, index) in props.contracts"
            :key="index"
            :canReroll="props.canReroll"
            :contract="contract"
            :rerollCost="props.rerollCost"
            :availableActions="props.availableActions"
            :you="props.you"
            :id="index"
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
    
    height: 250px;
}
</style>
