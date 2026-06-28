<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import Exit from "@/assets/exit.svg";
import Remove from "@/assets/remove.svg";

import { useAppStore } from "../../../../store/useAppStore";
import KickUserDialog from "../KickUserDialog.vue";
import OptionButton from "../OptionButton.vue";
const router = useRouter();
const props = defineProps(["currentUser", "lobbyUsers"]);

const kickUserDialogRef = ref(null);
const store = useAppStore();

const usersAvailableToKick = computed(() =>
    props.lobbyUsers.filter(
        (user) => user.publicId !== props.currentUser.publicId,
    ),
);

const leaveLobby = () => {
    store.emit("leaveLobby");
    router.push("/");
};
</script>

<template>
    <div class="panel bottom-left">
        <KickUserDialog
            v-if="currentUser.isAdmin"
            ref="kickUserDialogRef"
            :users-available-to-kick="usersAvailableToKick"
        />

        <OptionButton
            v-if="currentUser.isAdmin && usersAvailableToKick.length"
            :icon="Remove"
            content="Wyrzuć Gracza"
            @click="kickUserDialogRef?.openDialog"
        />

        <OptionButton :icon="Exit" content="Wyjdź" @click="leaveLobby" />
    </div>
</template>

<style scoped>
.bottom-left {
    bottom: 0;
    left: 0;

    @media (width < 768px) {
        order: 5;
        padding-top: 0;
    }
}
</style>
