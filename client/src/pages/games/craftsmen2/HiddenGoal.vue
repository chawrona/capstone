<script setup>
import { ref } from "vue";

const props = defineProps(["hiddenTask", "hiddenTaskInfo"]);
const showInfo = ref(false);
</script>
<template>
    <div
        class="goalCard"
        :data-id="props.hiddenTask.id"
        @click="showInfo = !showInfo"
    >
        <template v-if="!showInfo">
            <h1>{{ props.hiddenTask.title }}</h1>
            <p>{{ props.hiddenTask.description }}</p>
        </template>

        <template v-else>
            <p class="info">{{ props.hiddenTaskInfo }}</p>
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
    z-index: 11;
    aspect-ratio: 671 / 205;
    border-radius: 0.5rem;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    text-align: center;
    cursor: pointer;
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

    &:hover {
        filter: brightness(1.1);
    }

    .info {
        font-size: 1.25rem;
    }
}
</style>
