<script setup>

const props = defineProps(["goalCard"])

</script>
<template>
<div class="goalCard">
    <h1>{{props.goalCard.title}}</h1>
    <p>{{props.goalCard.task}}</p>
</div>
</template>

<style scoped>
.goalCard {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 0.5rem;
    padding-block: 1rem;
    position: absolute;
      top: 1rem;
    left: 1rem;
    width: 450px;
    padding: 1rem;
    color: white;
    height: 9rem;
    box-shadow: 3px 3px 3px 0px rgba(51, 48, 48, 0.671);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    text-align: center;
    background-image: url("/src/assets/games/gameAssets/craftsmen/board.png");
}
</style>