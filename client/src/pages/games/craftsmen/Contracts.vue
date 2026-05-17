<script setup>
import ContractCard from './ContractCard.vue';



const resources = [{
    id: 1,
required: [{type: "wood", amount: 7}, {type: "stone", amount: 4}],
show: true,
title: "Dębowa szafa"

},
{
 id: 2,
required: [{type: "stone", amount: 4}],
show: true,
title: "Marmurowa łazienka"

},
{
     id: 3,
required: [{type: "brick", amount: 4}],
show: true,
title: "Ceglany piec"
}]

</script>

<template>
<div class="contracts">

    <ContractCard v-for="(resource, index) in resources" :key="index" :resource="resource"/>

</div>
</template>

<style scoped>
.contracts {
    position: absolute;
    display: flex;
    justify-content: space-between;
    bottom: 1rem;
    right: 1rem;
    width: 500px;
    height: 250px;


    
  




}
</style>