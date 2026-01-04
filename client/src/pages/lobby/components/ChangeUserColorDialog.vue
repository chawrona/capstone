<script setup>
import { computed, ref } from "vue";

import { useAppStore } from "../../../store/useAppStore";
import DialogHeader from "./panels/DialogHeader.vue";
import { soundBus } from "../../../audio/soundBus";

const props = defineProps([
    "availableColors",
    "currentUser",
    "lobbyUsers",
    "userColor",
]);

const store = useAppStore();

const dialogRef = ref(null);

const closeDialog = () => dialogRef.value.close();
const openDialog = () => dialogRef.value.showModal();

defineExpose({
    closeDialog,
    openDialog,
});

const blockedColors = computed(() => {
    return props.lobbyUsers
        .filter((user) => user.color)
        .map((user) => user.color.name);
});

const userColor = computed(() => props.userColor && props.userColor.name);

const changeUserColor = (newColor) => {
    soundBus.playEffect("click");
    if (blockedColors.value.includes(newColor.name)) return;
    store.emit("changeUserColor", { newColor });
    closeDialog();
};

const dialogTitle = computed(() => {
    return userColor.value ? "Zmień kolor" : "Wybierz kolor";
});
</script>

<template>
    <dialog ref="dialogRef" class="theme-dialog change-user-color-dialog">
        <DialogHeader
            :title="dialogTitle"
            :close-dialog-callback="closeDialog"
        />
        <div class="available-colors">
            <button
                v-for="color in availableColors"
                :key="color.name"
                class="change-color-btn"
                :class="{
                    'disabled-color': blockedColors.includes(color.name),
                }"
                :data-player-color="userColor === color.name"
                @click="() => changeUserColor(color)"
            >
                <div class="color" :style="`--color: ${color.hex}; `">
                    <div class="color-name">
                        {{ color.name }}
                    </div>
                </div>
            </button>
        </div>
    </dialog>
</template>

<style scoped>
.change-user-color-dialog {
    position: relative;
    flex-direction: column;
    gap: 1.5rem;
    width: 462px;
    max-width: calc(100% - 2rem);

    &[open] {
        display: flex;
    }
}

.available-colors {
    gap: 1.5rem 1.5rem;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 0.75rem;
    justify-content: start;
}

.change-color-btn {
    border: none;
    background-color: transparent;
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;

    .color:hover .color-name {
        background-color: transparent;
    }
}

.disabled-color {
    opacity: 0.4;
    cursor: auto;

    &[data-player-color="true"] {
        opacity: 1;
    }

    .color .color-name {
        background-color: transparent;
    }
}

.color {
    position: relative;
    display: grid;
    place-items: center;
    width: 7em;
    height: 2.35rem;
    border-radius: 3px;
    color: #ffffff;
    box-shadow: -1px 1px 2px 2px rgba(0, 0, 0, 0.582);
    background: linear-gradient(
        135deg,
        var(--color),
        hsl(from var(--color) h s calc(l * 0.5))
    );
    letter-spacing: normal;
    user-select: none;

    .color-name {
        width: calc(100% - 4px);
        height: calc(100% - 4px);
        border-radius: 3px;
        display: grid;
        place-items: center;
        background-color: black;
        font-weight: bold;
    }
}

@media (width < 358px) {
    .change-user-color-dialog {
        .dialog-title {
            font-size: 1.09rem;
        }

        .close-dialog {
            width: 2.5rem;
        }

        .close-icon {
            width: 1.5rem;
        }
    }

    .available-colors {
        flex-direction: column;
        align-items: center;
    }
}
</style>
