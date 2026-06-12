import { ref, onMounted, onUnmounted } from "vue";

import { useAppStore } from "@/store/useAppStore";

export default function useGameData() {
    const store = useAppStore();
    const gameData = ref(null);
    const endGameData = ref(null);

    onMounted(() => {
        if (!store.socket) return;

        store.socket.on("gameData", (data) => {
            console.log(data);

            gameData.value = data;
            store.setLoading(false);
        });

        store.emit("gameData", {
            eventName: "gameDataRequest",
        });

        store.socket.on("endGame", (data) => {
            endGameData.value = data;
        });
    });

    onUnmounted(() => {
        store.socket.off("gameData");
        store.socket.off("endGame");
    });

    return {
        endGameData,
        gameData,
    };
}
