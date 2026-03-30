import { ref, onMounted, onUnmounted } from "vue";

import { useAppStore } from "@/store/useAppStore";

export default function useGameData() {
    const store = useAppStore();
    const gameData = ref(null);

    onMounted(() => {
        if (!store.socket) return;

        store.socket.on("gameData", (data) => {
            gameData.value = data;
            store.setLoading(false);
        });

        store.emit("gameData", {
            eventName: "gameDataRequest",
        });
    });

    onUnmounted(() => {
        store.socket.off("gameData");
    });

    return {
        gameData,
    };
}
