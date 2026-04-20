<script setup>
const props = defineProps(["player", "playerColor"]);

const color = props.playerColor ? "#fff" : props.player.color.hex;
</script>

<template>
    <span>
        <span class="player" :style="`--color: ${props.player.color.hex}`">
        </span>

        <span class="nextPlayer" :style="`--color: ${color}`">
            {{ props.player.username }}
        </span>
    </span>
</template>

<style scoped>
.nextPlayer {
    font-weight: bold;
}

.player {
    display: inline-block;
    margin-right: 0.5ch;
    transform: translateY(25%);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: hsl(from var(--color) h s calc(l * 1));
    border: 1px solid rgba(0, 0, 0, 0.349);
    box-shadow:
        inset 0 1.5px 3px rgba(255, 255, 255, 0.576),
        inset 0 -3px 5px rgba(0, 0, 0, 0.247),
        0 2px 3px rgba(0, 0, 0, 0.308);
}
</style>
