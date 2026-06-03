<script setup>
const props = defineProps(["hiddenTask"]);
</script>
<template>
    <div class="goalCard">
        <h1>{{ props.hiddenTask.title }}</h1>
        <p>{{ props.hiddenTask.description }}</p>
    </div>
</template>

<style scoped>
.goalCard {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 0rem;
    padding-block: 1rem;
    position: absolute;
    top: 1rem;
    left: 1rem;
    width: 400px;
    padding: 1rem;
    color: white;

    aspect-ratio: 671 / 205;
    border-radius: 0.5rem;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    text-align: center;
    background-image: url("/src/assets/games/gameAssets/craftsmen/board.png");

    h1 {
        font-size: 1.8rem;
    }
}
</style>
