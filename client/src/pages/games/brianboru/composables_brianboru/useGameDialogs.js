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

    const timeoutId = ref(null);

    onMounted(() => {
        if (!store.socket) return;

        store.socket.on("dialogs", (dialogs) => {
            console.log("Dialogi: ", dialogs);

            if (timeoutId.value) {
                clearTimeout(timeoutId.value);
                timeoutId.value = null;
                openedDialog.value = dialogsQueue.value.get();
            }

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
        if (dialogsQueue.value.getLength() > 0) {
            openedDialog.value = dialogsQueue.value.get();
        } else {
            timeoutId.value = setTimeout(() => {
                openedDialog.value = dialogsQueue.value.get();
                timeoutId.value = null;
            }, 300); // Magiczna liczba, tak naprawdę zależy miganie od tego jak szybko pakiet z nową informacją o dialogu pójdzie
        }

        store.emit("gameData", { eventName: "closeDialog" });
    };

    return {
        allDialogs,
        closeDialog,
        openedDialog,
    };
}
