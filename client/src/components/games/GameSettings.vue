<script setup>
import { ref } from "vue";

import Clock from "@/assets/clock.svg";
import Cancel from "@/assets/exit.svg";
import Ready from "@/assets/ready.svg";

import { useGameSettings } from "../../games/shared/useGameSettings.js";
import OptionButton from "../common/OptionButton.vue";
import PlaySoundtrack from "../common/PlaySoundtrack.vue";
import SoundSettings from "../common/SoundSettings.vue";

const props = defineProps(["url"]);

const {
    endGame,
    isGamePaused,
    sendBugReport,
    showEndGameButton,
    toggleGamePause,
} = useGameSettings();

const bugMessage = ref("");
const sfxVolume = ref(80);
const musicVolume = ref(60);

const handleSendBugReport = () => {
    if (bugMessage.value) {
        sendBugReport(bugMessage.value);
        bugMessage.value = "";
    }
};

const settingsStatus = ref("options");
</script>

<template>
    <div v-if="showEndGameButton" class="settings">
        <PlaySoundtrack />

        <div class="settings-status">
            <h1
                class="settings-status_title"
                :class="{
                    paused: isGamePaused,
                    inProgress: !isGamePaused,
                }"
            >
                {{ isGamePaused ? "Gra wstrzymana" : "Gra w toku" }}
            </h1>
            <OptionButton
                class="theme-button settings-button"
                :content="isGamePaused ? 'Wznów grę' : 'Zatrzymaj grę'"
                :icon="isGamePaused ? Ready : Clock"
                @click="toggleGamePause"
            />
            <OptionButton
                class="theme-button settings-button"
                content="Zakończ grę"
                :icon="Cancel"
                @click="endGame"
            />
        </div>

        <SoundSettings />

        <div class="bug-report">
            <h2>Zgłoś błąd</h2>
            <textarea
                v-model="bugMessage"
                type="text"
                placeholder="Opisz błąd..."
                class="bug-input theme-input"
            />
            <button class="bug-send theme-button" @click="handleSendBugReport">
                Wyślij
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.settings {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.75rem;
    position: fixed;
    z-index: 999;
    inset: 0;
    overflow-y: auto;
    padding: 3rem 1.5rem;
    background-color: rgba(0, 0, 0, 0.849);
    color: #e0d4b0;
    font-family: "Cinzel", sans-serif;

    &-status {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1.75rem 2.5rem;
        border: 1px solid rgba(255, 230, 180, 0.2);
        max-width: 600px;
        width: 100%;
        border-radius: 6px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

        background-image: url("/src/assets/successBg.png");

        &:has(.paused) {
            background-image: url("/src/assets/errorBg.png");
        }

        &_title {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.6em;
            margin: 0 0 0.25rem;
            color: #f5eac6;
            font-family: "Cinzel Decorative", "Cinzel", serif;
            font-size: 1.6rem;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-align: center;

            &.paused {
                color: #db083d;
            }

            &.inProgress {
                color: #b7c99a;
            }
        }

        .settings-button {
            width: 280px;
        }
    }
}

.bug-report {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.75rem 2.5rem;
    border: 1px solid rgba(255, 230, 180, 0.2);
    max-width: 600px;
    width: 100%;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

    background-image: url("/src/assets/dialogBg.png");
}

.bug-input {
    overflow-y: scroll;
    height: 8rem;
    resize: none;
}

.bug-send {
    flex-shrink: 0;
}
</style>
