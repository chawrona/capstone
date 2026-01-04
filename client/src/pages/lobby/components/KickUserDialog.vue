<script setup>
import { ref } from "vue";

import ExitWhite from "@/assets/exitWhite.svg";

import { useAppStore } from "../../../store/useAppStore";
import DialogHeader from "./panels/DialogHeader.vue";
import { soundBus } from "../../../audio/soundBus";

const props = defineProps(["usersAvailableToKick"]);

const store = useAppStore();

const dialogRef = ref(null);

const closeDialog = () => dialogRef.value.close();
const openDialog = () => dialogRef.value.showModal();

defineExpose({
    closeDialog,
    openDialog,
});

const removeUser = (publicId) => {
    soundBus.playEffect("click")
    store.emit("removeUser", {
        userToKickPublicId: publicId,
    });
    closeDialog();
};
</script>

<template>
    <dialog ref="dialogRef" class="theme-dialog kick-user-dialog">
        <DialogHeader
            title="Wyrzuć gracza"
            :close-dialog-callback="closeDialog"
        />
        <ul class="players">
            <li
                v-for="user in usersAvailableToKick"
                :key="user.publicId"
                class="player"
            >
                <button
                    class="kick-btn"
                    :style="`--color: ${user.color ? user.color.hex : '#868686'}`"
                    @click="() => removeUser(user.publicId)"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        :fill="user.color ? user.color.hex : '#868686'"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                    >
                        <path
                            d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z"
                        />
                    </svg>
                    <span>{{ user.username }} </span>
                </button>
            </li>
        </ul>
    </dialog>
</template>

<style scoped>
.kick-user-dialog {
    width: 375px;

    .players {
        width: 100%;
        display: flex;
        flex-direction: column;
        list-style: none;
        margin: 0.75rem 0;
        margin-bottom: 1rem;
    }

    .player {
        width: 100%;
    }

    .kick-btn {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        font-size: 1rem;

        border: none;
        transform: translateX(-0.5rem);
        border-radius: 4px;
        padding: 0.75rem 0.5rem;
        background-color: transparent;
        cursor: pointer;
        color: white;
        font-family: "Cinzel";
        width: calc(100% + 0.5rem);
        transition: backgroundColor 0.2s;

        &:hover {
            background-color: #ffffff18;
            background-color: hsla(from var(--color) h s l / 0.3);
        }
    }
}
</style>
