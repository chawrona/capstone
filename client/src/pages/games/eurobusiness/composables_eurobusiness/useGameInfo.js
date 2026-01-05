import { onMounted, onBeforeUnmount } from "vue";
import { useToast } from "vue-toast-notification";

import { useAppStore } from "@/store/useAppStore";

export default function useGameInfo() {
    const store = useAppStore();
    const toast = useToast();

    onMounted(() => {
        if (!store.socket) return;

        store.socket.on("gameInfo", (message) => {
            console.log("Message: ", message);

            toast.success(message, {
                position: "top",
                type: "info",
            });
        });
    });

    onBeforeUnmount(() => {
        if (!store.socket) return;

        store.socket.off("gameInfo");
    });

    const createInfo = (message) => {
        toast.success(message, {
            duration: 2000,
            position: "top",
            type: "info",
        });
    };

    return { createInfo };
}
