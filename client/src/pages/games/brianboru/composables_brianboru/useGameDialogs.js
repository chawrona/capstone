import { ref, onMounted, onUnmounted } from "vue";

import { useAppStore } from "@/store/useAppStore";

class Queue {
    constructor() {
        this.queue = [];
    }

    getLength() {
        return this.queue.length;
    }

    get() {
        const dialog = this.queue.shift();
        return dialog === undefined ? null : dialog;
    }

    set(dialogs) {
        this.queue = dialogs;
    }
}

export default function useGameDialogs() {
    const store = useAppStore();
    const dialogsQueue = ref(new Queue());
    const openedDialog = ref(null);
    const allDialogs = ref(null);

    onMounted(() => {
        if (!store.socket) return;

        store.socket.on("dialogs", (dialogs) => {
            dialogsQueue.value.set(dialogs);
            allDialogs.value = dialogs;
            if (openedDialog.value === null) {
                openedDialog.value = dialogsQueue.value.get();
            }
        });
    });

    onUnmounted(() => {
        store.socket.off("dialogs");
    });

    const closeDialog = () => {
        openedDialog.value = dialogsQueue.value.get();
        store.emit("gameData", { eventName: "closeDialog" });
    };

    return {
        allDialogs,
        closeDialog,
        openedDialog,
    };
}
