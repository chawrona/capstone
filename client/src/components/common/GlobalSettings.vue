<script setup>
import { ref } from "vue";

import Cancel from "@/assets/exit.svg";

import { sendBugReport } from "../../composables/sendBugReport.js";
import { useGlobalSettings } from "../../composables/useGlobalSettings.js";
import OptionButton from "../common/OptionButton.vue";
import PlaySoundtrack from "../common/PlaySoundtrack.vue";
import SoundSettings from "../common/SoundSettings.vue";

const { closeSettings, showSettings, toggleSettings } = useGlobalSettings();

const bugMessage = ref("");

const isSendingBug = ref(false);

const handleSendBugReport = async () => {
    if (!bugMessage.value.trim() || isSendingBug.value) return;

    isSendingBug.value = true;
    // czyścimy tylko po sukcesie, żeby treść nie przepadła
    if (await sendBugReport(bugMessage.value)) bugMessage.value = "";
    isSendingBug.value = false;
};
</script>

<template>
    <div v-if="showSettings" class="settings">
        <PlaySoundtrack />
        <SoundSettings />

        <div class="bug-report">
            <h2>Zgłoś błąd</h2>
            <textarea
                v-model="bugMessage"
                placeholder="Opisz błąd..."
                maxlength="1000"
                class="bug-input theme-input"
            />
            <button
                class="bug-send theme-button"
                :disabled="isSendingBug"
                @click="handleSendBugReport"
            >
                Wyślij
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.global-settings-toggle {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 998;
}

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
    background-color: rgba(0, 0, 0, 0.649);
    color: #e0d4b0;
    font-family: "Cinzel", sans-serif;
}

.panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.75rem 2.5rem;
    border: 1px solid rgba(255, 230, 180, 0.2);
    background-color: rgba(255, 230, 180, 0.05);
    max-width: 600px;
    width: 100%;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
}

.bug-input {
    height: 8rem;
    resize: none;
    overflow-y: scroll;
}

.bug-send {
    flex-shrink: 0;
}

.settings-close {
    width: 280px;
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

    background-image: url("/src/assets/dialogbg.png");
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
