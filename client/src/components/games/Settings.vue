<script setup>
import { ref } from "vue";

import Clock from "@/assets/clock.svg";
import Cancel from "@/assets/exit.svg";
import Ready from "@/assets/ready.svg";

import { useGameSettings } from "../../games/shared/useGameSettings.js";
import OptionButton from "../common/OptionButton.vue";
import PlaySoundtrack from "../common/PlaySoundtrack.vue";

const props = defineProps(["url"]);

const { endGame, sendBugReport, showEndGameButton, toggleGamePause, isGamePaused } = useGameSettings();

const bugMessage = ref("");
const sfxVolume = ref(80)
const musicVolume = ref(60)

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
        <PlaySoundtrack :url="props.url" />

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
                :content="
                    isGamePaused ? 'Wznów grę' : 'Zatrzymaj grę'
                "
                @click="toggleGamePause"
                :icon="isGamePaused ? Ready : Clock"
            />
            <OptionButton
                class="theme-button settings-button"
                content="Wymuś koniec gry"
                @click="endGame"
                :icon="Cancel"
            />
        </div>

        <!-- <div class="settings-sound">
            <div class="sound-control">
                <div class="sound-control__header">
                    <label for="sfx-volume">Dźwięki</label>
                    <span class="sound-control__value">{{ sfxVolume }}</span>
                </div>
                <input
                    id="sfx-volume"
                    v-model.number="sfxVolume"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    class="slider"
                />
            </div>

            <div class="sound-control">
                <div class="sound-control__header">
                    <label for="music-volume">Muzyka</label>
                    <span class="sound-control__value">{{ musicVolume }}</span>
                </div>
                <input
                    id="music-volume"
                    v-model.number="musicVolume"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    class="slider"
                />
            </div>
        </div> -->

        <!-- <div class="settings-buttons" v-if="settingsStatus === 'options'">
      
        
       
            <OptionButton class="theme-button settings-button"
                content="Zakończ grę"
            />
               
     
            
        </div> -->

        <!-- <div class="bug-report">
        <textarea
            v-model="bugMessage"
            type="text"
            placeholder="Opisz błąd..."
            class="bug-input"
        />
        <button class="bug-send" @click="handleSendBugReport">Wyślij</button>
    </div> -->
    </div>
</template>

<style scoped lang="scss">
.settings {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    color: white;
    font-family: sans-serif;
    position: fixed;
    z-index: 999;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.849);

    &-status {
        position: absolute;
        top: 2rem;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;

        &_title {
            text-align: center;
            font-size: 3rem;
            margin-bottom: 0.5rem;

            &.paused {
                color: rgb(255, 66, 66);
            }

            &.inProgress {
                color: rgb(66, 255, 75);
            }
        }

        .settings-button {
            width: 247px;
        }
    }

    &-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    &-button {
        width: 300px;
        font-size: 1rem;
    }

    &-sound {
        position: absolute;
        top: 4rem;
        right: 0.5rem;
        width: 500px;
        height: 300px;
        background-color: red;
    }
}

.end {
    border: none;
    background-color: black;
    color: white;
    text-transform: uppercase;
    font-family: sans-serif;
    padding: 0.5rem 1rem;
    cursor: pointer;

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
