import { ref, onMounted, onUnmounted, watch } from "vue";

import { usePageSounds } from "../../composables/usePageSounds.js";
import { useAppStore } from "../../store/useAppStore.js";

export const useGameSettings = (cityId, props) => {
    const store = useAppStore();
    const showEndGameButton = ref(false);
    const isGamePaused = ref(undefined);
    let unwatch = null;

    const toggleButton = () => {
        showEndGameButton.value = !showEndGameButton.value;
    };

    const endGame = () => {
        toggleButton();

        store.emit("onEndGame");
    };

    const toggleGamePause = () => {
        store.emit("toggleGamePause");
    };

    const handleEscPress = (event) => {
        if (isGamePaused.value && showEndGameButton.value) return;

        if (event.key === "Escape") {
            toggleButton();
        }
    };

    onMounted(() => {
        window.addEventListener("keydown", handleEscPress);
        if (store.socket) {
            store.socket.on("pauseStatus", (data) => {
                isGamePaused.value = data;
                console.log("Pause Status: ", data);

                if (isGamePaused.value) {
                    showEndGameButton.value = true;
                } else {
                    showEndGameButton.value = false;
                }
            });

            store.emit("gamePauseStatusRequest");

            store.socket.once("connect", () => {
                if (data === undefined) {
                    store.emit("gamePauseStatusRequest");
                }
            });
        } else {
            unwatch = watch(
                () => store.socket,
                (newSocket) => {
                    if (newSocket) {
                        store.socket.on("pauseStatus", (data) => {
                            isGamePaused.value = data;
                            console.log("Pause Status: ", data);
                            if (isGamePaused.value) {
                                showEndGameButton.value = true;
                            } else {
                                showEndGameButton.value = false;
                            }
                        });

                        store.emit("gamePauseStatusRequest");

                        store.socket.once("connect", () => {
                            if (data === undefined) {
                                store.emit("gamePauseStatusRequest");
                            }
                        });

                        unwatch();
                        unwatch = null;
                    }
                },
            );
        }
    });

    onUnmounted(() => {
        window.removeEventListener("keydown", handleEscPress);
        if (store.socket) store.socket.off("pauseStatus");
        if (unwatch) unwatch();
    });

    return {
        endGame,
        isGamePaused,
        showEndGameButton,
        toggleGamePause,
    };
};
