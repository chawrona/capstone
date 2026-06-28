import { ref, onMounted, onBeforeUnmount } from "vue";

import { useAppStore } from "@/store/useAppStore";

export function useGamePause() {
    const timeoutId = ref(null);
    const isPaused = ref(false);
    const store = useAppStore();

    onMounted(() => {
        if (!store.socket) return;

        store.socket.on("pause", () => {
            timeoutId.value = setTimeout(() => {
                isPaused.value = true;
            }, 500);
        });

        store.socket.on("resume", () => {
            clearTimeout(timeoutId.value);
            isPaused.value = false;
        });
    });

    onBeforeUnmount(() => {
        store.socket?.off("pause");
        store.socket?.off("resume");
    });

    return { isPaused };
}
