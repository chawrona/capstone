<script setup>
import { computed, ref } from "vue";
import { useToast } from "vue-toast-notification";

import Cancel from "@/assets/cancel.svg";
import Color from "@/assets/color.svg";
import Edit from "@/assets/edit.svg";
import Ready from "@/assets/ready.svg";
import Start from "@/assets/start.svg";

import { useAppStore } from "../../../../store/useAppStore";
import ChangeUserColorDialog from "../ChangeUserColorDialog.vue";
import ChangeUsernameDialog from "../ChangeUsernameDialog.vue";
import OptionButton from "../OptionButton.vue";
import { soundBus } from "../../../../audio/soundBus";

const props = defineProps([
    "currentUser",
    "currentGame",
    "readyUsers",
    "availableColors",
    "lobbyUsers",
    "availableGames",
]);

const toast = useToast();
const store = useAppStore();

const changeUsernameDialogRef = ref(null);
const changeUserColorDialogRef = ref(null);

const toggleReadyDisabled = ref(false);

const blockButtons = () => {
    if (toggleReadyDisabled.value) return true;
    toggleReadyDisabled.value = true;
    setTimeout(() => (toggleReadyDisabled.value = false), 1000);

    return false;
};

const toggleReady = () => {
    if (blockButtons()) return;
    store.emit("toggleReady");
        soundBus.playEffect("click");
};

const areColorDuplicatedOrNotSelected = computed(() => {
    const usedColors = [];
    for (const user of props.lobbyUsers) {
        if (!user.color || usedColors.includes(user.color.name)) return true;
        usedColors.push(user.color.name);
    }
    return false;
});

const areUsersReady = computed(() => {
    return props.lobbyUsers.every((user) => user.isAdmin || user.isReady);
});

const duplicatedColorMessage =
    "Wszyscy gracze muszą mieć wybrany, unikalny kolor.";

const canStartTheGame = computed(() => {
    try {
        if (blockButtons()) return;

        if (areColorDuplicatedOrNotSelected.value) {
            throw new Error(duplicatedColorMessage);
        }

        if (!areUsersReady.value) {
            throw new Error("Nie wszyscy gracze są gotowi.");
        }

        return true;
    } catch (err) {
        toast.error(err.message, {
            duration: 1000,
            position: "top",
            type: "error",
        });
        return false;
    }
});

const isCorrentCountOfPlayers = computed(
    () =>
        props.readyUsers >= props.currentGame.minPlayers &&
        props.readyUsers <= props.currentGame.maxPlayers,
);

const handleGameStart = () => {
    if (!canStartTheGame.value) return;
    store.emit("gameStart");
    soundBus.playEffect("click");
};
</script>

<template>
    <div class="panel top-left">
        <ChangeUsernameDialog
            ref="changeUsernameDialogRef"
            :username="props.currentUser.username"
        />

        <ChangeUserColorDialog
            ref="changeUserColorDialogRef"
            :current-user="props.currentUser"
            :lobby-users="props.lobbyUsers"
            :available-colors="props.availableColors"
            :user-color="props.currentUser?.color"
        />

        <OptionButton
            :icon="Edit"
            content="Zmień pseudonim"
            @click="changeUsernameDialogRef?.openDialog"
        />

        <OptionButton
            :icon="Color"
            :content="props.currentUser.color ? 'Zmień kolor' : 'Wybierz kolor'"
            @click="changeUserColorDialogRef?.openDialog"
        />

        <OptionButton
            v-if="!props.currentUser.isAdmin"
            :icon="!props.currentUser.isReady ? Ready : Cancel"
            :content="
                !props.currentUser.isReady
                    ? 'Jestem gotowy(-a)'
                    : 'Anuluj gotowość'
            "
            @click="toggleReady"
        />

        <OptionButton
            v-if="props.currentUser.isAdmin"
            :disabled="
                !isCorrentCountOfPlayers || areColorDuplicatedOrNotSelected
            "
            :icon="Start"
            content="Zacznij grę"
            @click="handleGameStart"
        />
    </div>
</template>

<style scoped>
.top-left {
    top: 0;
    left: 0;

    @media (width < 768px) {
        order: 4;
        padding-bottom: 0;
    }
}
</style>
