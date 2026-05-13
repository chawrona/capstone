<script setup>
import { ref } from 'vue';
import { useGameSettings } from '../../pages/games/composables_games/useGameSettings';

const { endGame, showEndGameButton, sendBugReport } = useGameSettings();

const bugMessage = ref('');

const handleSendBugReport = () => {
    if (bugMessage.value) {
        sendBugReport(bugMessage.value);
        bugMessage.value = '';
    }
};
</script>

<template>
    <button v-if="showEndGameButton" class="end" @click="endGame">
        Zakończ grę
    </button>

    <div v-if="showEndGameButton" class="bug-report">
        <textarea
            v-model="bugMessage"
            type="text"
            placeholder="Opisz błąd..."
            class="bug-input"
        />
        <button class="bug-send" @click="handleSendBugReport">Wyślij</button>
    </div>
</template>

<style scoped>
.end {
    position: absolute;
    top: 1rem;
    right: 1rem;
    border: none;
    background-color: black;
    color: white;
    text-transform: uppercase;
    font-family: sans-serif;
    padding: 0.5rem 1rem;
    cursor: pointer;
    z-index: 9999999;
    font-weight: bold;
    font-size: 1.5rem;

    &:hover {
        background-color: white;
        color: black;
    }
}


.bug-report {
    position: absolute;
    top: 4rem;
    right: 1rem;
    display: flex;
    gap: 0.5rem;
    z-index: 9999999;
}

.bug-input {
    padding: 0.4rem 0.8rem;
    height: 20vh;
    width: 50vw;
    font-size: 1rem;
    border: 2px solid black;
    outline: none;
}

.bug-send {
    padding: 0.4rem 0.8rem;
    background-color: black;
    color: white;
    border: none;
    font-weight: bold;
    cursor: pointer;
    text-transform: uppercase;

    &:hover {
        background-color: white;
        color: black;
        outline: 2px solid black;
    }
}



</style>