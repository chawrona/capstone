<script setup>
const props = defineProps(["hiddenTask", "hiddenTaskInfo"]);
const showInfo = ref(false);
</script>
<template>
    <div class="goalCard" @click="showInfo = !showInfo" :data-id="props.hiddenTask.id">
        <template v-if="!showInfo">
            <h1>{{ props.hiddenTask.title }}</h1>
            <p>{{ props.hiddenTask.description }}</p>
        </template>

        <template v-else>
            <h1>{{ props.hiddenTaskInfo }}</h1>
        </template>
    </div>
</template>

<style scoped lang="scss">
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

    &[data-id="0"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/questBoard0.png");
    }
    &[data-id="1"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/questBoard1.png");
    }
    &[data-id="2"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/questBoard2.png");
    }
    &[data-id="3"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/questBoard3.png");
    }
    &[data-id="4"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/questBoard4.png");
    }
    h1 {
        font-size: 1.8rem;
    }
}
</style>
