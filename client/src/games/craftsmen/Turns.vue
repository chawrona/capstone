<script setup>
import { resourceImages } from "./composables_craftsmen/pathImages";

const props = defineProps(["player", "round", "turn", "isYourTurn"]);
</script>

<template>
    <div class="turns">
        <h2 v-if="!props.isYourTurn">
            <span
                class="username"
                :style="`--color: ${props.player.color.hex}`"
                >{{ props.player.username }}</span
            >
        </h2>
    </div>
</template>

<style scoped>
.turns {
    padding-block: 1rem;
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 450px;
    display: flex;
    flex-direction: column;
    align-items: end;

    color: #e3edfd;

    /* 2. Odpowiednie pogrubienie fontu pomaga na wzorzystym tle */
    font-weight: 800;

    /* 3. Wyraźny cień (Drop Shadow) */
    /* Składnia: przesunięcie-X | przesunięcie-Y | rozmycie | kolor */
    text-shadow: 2px 3px 3px rgba(0, 0, 0, 0.85);
}

.username::before {
    display: inline-block;
    content: "";
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
    margin-left: 0.25rem;
    border-radius: 50%;
    transform: translateY(4px);
    background-color: var(--color);
    border: 2px solid rgba(0, 0, 0, 0.719);
}

.info {
    display: flex;
    gap: 2rem;
    justify-content: end;
}

.wheatIcon {
    width: 2.25rem;
    height: 2.25rem;
    transform: translateY(1px);
}

.wheatWrap {
    display: flex;
    gap: 0.5rem;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: center;
}
</style>
