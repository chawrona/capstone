<script setup>
import { onMounted, onUnmounted, ref } from "vue";

import { useAppStore } from "../../../store/useAppStore";
import DialogHeader from "./panels/DialogHeader.vue";
import { soundBus } from "../../../audio/soundBus";

const props = defineProps(["username"]);

const store = useAppStore();

const dialogRef = ref(null);

const closeDialog = () => dialogRef.value.close();
const openDialog = () => dialogRef.value.showModal();

defineExpose({
    closeDialog,
    openDialog,
});

const changeUsernameInput = ref(null);
const changeUsername = () => {
    soundBus.playEffect("click");
    store.emit("changeUsername", {
        newUsername: changeUsernameInput.value,
    });
  
};

onMounted(() => {
    store.socket.on("usernameChanged", () => {
        localStorage.setItem("username", changeUsernameInput.value);
        changeUsernameInput.value = "";
        closeDialog();
    })
    store.socket.on("usernameChangedError", () => {
        changeUsernameInput.value = "";
        closeDialog();
    })
})

onUnmounted(() => {
     store.socket.off("usernameChanged")
     store.socket.off("usernameChangedError")
})
</script>

<template>
    <dialog ref="dialogRef" class="theme-dialog change-username-dialog">
        <DialogHeader
            title="Zmień pseudonim"
            :close-dialog-callback="closeDialog"
        />

        <div class="input-wrap">
            <input
                v-model="changeUsernameInput"
                type="text"
                class="theme-input change-username-input"
                :placeholder="username"
                minlength="3"
                maxlength="20"
                required
            />
            <button class="theme-button" @click="changeUsername">Zmień</button>
        </div>
    </dialog>
</template>

<style scoped>
.change-username-dialog {
    display: none;
    flex-direction: column;
    gap: 0.85rem;
    width: 485px;
    max-width: calc(100% - 2rem);

    &[open] {
        display: flex;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .dialog-title {
        font-family: "Cinzel";
        font-size: 1.75rem;
        width: 100%;
    }

    .input-wrap {
        display: flex;
        gap: 1rem;
    }

    .close-dialog {
        padding: 0;
        display: grid;
        place-items: center;
        width: 2.5rem;
        aspect-ratio: 1 / 1;
        background-image: none;
        background-color: transparent;
        border: none;
        backdrop-filter: unset;
        flex-shrink: 0;
        transform: translateX(10px);

        &:hover {
            background-image: none;
            background-color: #ffffff25;
        }
    }

    .close-icon {
        width: 2rem;
    }
}

.change-username-input {
    letter-spacing: 1.5px;
    font-size: 1rem;
}

@media (width < 500px) {
    .change-username-dialog {
        .input-wrap {
            flex-direction: column;
        }

        .dialog-title {
            font-size: 1.09rem;
        }

        .close-icon {
            width: 1.5rem;
        }
    }
}
</style>
