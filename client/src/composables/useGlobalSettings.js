import { ref, onMounted, onUnmounted } from "vue";

export const useGlobalSettings = () => {
    const showSettings = ref(false);

    const toggleSettings = () => {
        showSettings.value = !showSettings.value;
    };

    const closeSettings = () => {
        showSettings.value = false;
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
        showSettings,
        toggleSettings,
    };
};
