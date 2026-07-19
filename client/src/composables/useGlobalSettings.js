import { ref, onMounted, onUnmounted } from "vue";
import { useToast } from "vue-toast-notification";

import { useAppStore } from "../store/useAppStore.js";

export const useGlobalSettings = () => {
    const store = useAppStore();
    const toast = useToast();
    const showSettings = ref(false);

    const toggleSettings = () => {
        showSettings.value = !showSettings.value;
    };

    const closeSettings = () => {
        showSettings.value = false;
    };

    const sendBugReport = (message) => {
        store.emit("onBugReport", message);
        toast.info("Informacja o błędzie została wysłana", {
            duration: 4000,
            position: "top-left",
        });
    };

    const handleEscPress = (event) => {
        if (event.key === "Escape") {
            toggleSettings();
        }
    };

    onMounted(() => {
        window.addEventListener("keydown", handleEscPress);
    });

    onUnmounted(() => {
        window.removeEventListener("keydown", handleEscPress);
    });

    return {
        closeSettings,
        sendBugReport,
        showSettings,
        toggleSettings,
    };
};
