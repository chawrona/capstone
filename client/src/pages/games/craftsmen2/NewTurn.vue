<script setup>
import Hourglass from "@/assets/games/gameAssets/craftsmen/glasshour.png";

import actions from "../../../../../server/models/games/craftsmen/config.js/actions";
import { useAppStore } from "../../../store/useAppStore";
import { useGameActions } from "./composables_craftsmen/useGameActions";

const props = defineProps(["isYourTurn", "availableActions"]);

const { newTurn } = useGameActions(() => props.availableActions);
</script>

<template>
    <button
        v-if="props.isYourTurn"
        class="newTurn"
        :disabled="!props.availableActions.includes(actions.NEW_TURN)"
        @click="newTurn"
    >
        Zakończ ruch
        <img :src="Hourglass" alt="" class="icon" />
    </button>
</template>

<style scoped>
.newTurn {
    display: flex;
    color: white;
    font-weight: bold;

    height: 2.8rem;

    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 6;

    right: 1rem;
    top: 5.25rem;

    cursor: pointer;
    color: #000000;
    font-size: 1.15rem;
    background-size: contain;
    border-radius: 0.25rem;

    --background: #f4ecd0;
    background-color: var(--background);
    filter: drop-shadow(2px 2px 5px black);
    border: none;

    &[disabled] {
        opacity: 0.5;
    }

    &:not([disabled]) {
        cursor: pointer;
        &:hover {
            background-color: #e4b975;
        }
    }

    font-weight: bold;
    padding: 0.3rem 1.25rem;
    font-size: 1.5rem;
    color: rgb(0, 0, 0);
    padding-left: 1.5rem;
    padding-right: 0.8rem;
}

.icon {
    width: 1.4rem;
    transform: translateY(1px);
    margin-left: 0.5rem;
}
</style>
