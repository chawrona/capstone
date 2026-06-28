import { ref, onMounted, onUnmounted } from "vue";

import { soundBus } from "../../../audio/soundBus.js";
import { usePageSounds } from "../../../composables/usePageSounds.js";
import { useAppStore } from "../../../store/useAppStore.js";

export const useGameSettings = (cityId, props) => {
    const store = useAppStore();
    const showEndGameButton = ref(false);

    const toggleButton = () => {
        showEndGameButton.value = !showEndGameButton.value;
    };

    const sendBugReport = (message) => {
        store.emit("onBugReport", message);
    };

    const endGame = () => {
        toggleButton();
        soundBus.resetSoundtrack("/sounds/tale.mp3");
        store.emit("onEndGame");
    };

    const handleEscPress = (event) => event.key === "Escape" && toggleButton();

    onMounted(() => {
        window.addEventListener("keydown", handleEscPress);
    });

    onUnmounted(() => {
        window.removeEventListener("keydown", handleEscPress);
    });

    return { endGame, sendBugReport, showEndGameButton };
};
