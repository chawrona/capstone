import { ref, onMounted, onUnmounted, watch } from "vue";

import { useAppStore } from "@/store/useAppStore";

export default function useGameData() {
    const store = useAppStore();
    const gameData = ref(null);
    let unwatch = null;

    onMounted(() => {
        if (store.socket) {
            store.socket.on("gameData", (data) => {
                gameData.value = data;
            });

            store.emit("gameData", {
                eventName: "gameDataRequest",
            });

            store.socket.once("connect", () => {
                if (!data) {
                    store.emit("gameDataRequest");
                }
            });
        } else {
            unwatch = watch(
                () => store.socket,
                (newSocket) => {
                    if (newSocket) {
                        store.socket.on("gameData", (data) => {
                            gameData.value = data;
                        });

                        store.emit("gameData", {
                            eventName: "gameDataRequest",
                        });

                        store.socket.once("connect", () => {
                            if (!gameData.value) {
                                store.emit("gameDataRequest");
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
        if (store.socket) store.socket.off("gameData");
        if (unwatch) unwatch();
    });

    return {
        gameData,
    };
}
