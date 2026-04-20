import { ref, onMounted, onUnmounted } from "vue";

import { useAppStore } from "@/store/useAppStore";

import { soundBus } from "../../../../audio/soundBus.js";

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
    const endGame = ref(false);

    onMounted(() => {
        if (!store.socket) return;

        store.socket.on("dialogs", (dialogs) => {
            dialogsQueue.value.set(dialogs);
            allDialogs.value = dialogs;
            if (openedDialog.value === null) {
                openedDialog.value = dialogsQueue.value.get();
                if (openedDialog.value) {
                    soundBus.playEffect("pop");
                }
            }
        });

        store.socket.on("endGame", () => {
            endGame.value = true;
        });
    });

    onUnmounted(() => {
        store.socket.off("dialogs");
        store.socket.off("endGame");
    });

    const closeDialog = () => {
        openedDialog.value = dialogsQueue.value.get();

        if (!endGame.value) {
            store.emit("gameData", { eventName: "closeDialog" });
            console.log("WHY");

            soundBus.playEffect("click");
        }

        if (openedDialog.value) {
            soundBus.playEffect("pop");
        }
    };

    return {
        allDialogs,
        closeDialog,
        openedDialog,
    };
}
