import { ref, onMounted, onUnmounted, watch } from "vue";

import { useAppStore } from "@/store/useAppStore";

export default function useGameEndGame() {
    const store = useAppStore();
    const endGameData = ref(null);
    let unwatch = null;

    onMounted(() => {
        if (store.socket) {
            store.socket.on("endGame", (data) => {
                endGameData.value = data;
            });
        } else {
            unwatch = watch(
                () => store.socket,
                (newSocket) => {
                    if (newSocket) {
                        store.socket.on("endGame", (data) => {
                            endGameData.value = data;
                        });

                        unwatch();
                        unwatch = null;
                    }
                },
            );
        }
    });

    onUnmounted(() => {
        if (store.socket) store.socket.off("endGame");
        if (unwatch) unwatch();
    });

    return {
        endGameData,
    };
}
