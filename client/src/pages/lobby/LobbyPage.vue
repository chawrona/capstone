<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

import { useAppStore } from "../../store/useAppStore";
import BottomLeftPanel from "./components/panels/BottomLeftPanel.vue";
import BottomRightPanel from "./components/panels/BottomRightPanel.vue";
import CenterPanel from "./components/panels/CenterPanel.vue";
import TopCenterPanel from "./components/panels/TopCenterPanel.vue";
import TopLeftPanel from "./components/panels/TopLeftPanel.vue";
import TopRightPanel from "./components/panels/TopRightPanel.vue";
import { usePageSounds } from "../../composables/usePageSounds";
import PlaySoundtrack from "../../components/common/PlaySoundtrack.vue";

const store = useAppStore();

usePageSounds({
    effects: [
        { name: "click", url: "/sounds/click.mp3", poolSize: 5 },
    ],
});


const data = ref(null);

const currentUser = computed(() =>
    data.value.lobbyUsers.find(
        (user) => user.publicId === data.value.currentUser,
    ),
);

const readyUsers = computed(
    () =>
        data.value.lobbyUsers.filter((user) => user.isReady || user.isAdmin)
            .length,
);

onMounted(() => {
    store.socket.on("lobbyData", (lobbyData) => {
        console.log(lobbyData);
        console.log("DATA PREV:", data.value);

        data.value = lobbyData;
        store.setLoading(false);
    });

    store.emit("lobbyDataRequest");
});

onUnmounted(() => {
    if (store.socket) store.socket.off("lobbyData");
});
</script>

<template>
    <div class="app-container">
        <main v-if="data" class="container">
            <PlaySoundtrack url="/sounds/tale.mp3" />
            <TopLeftPanel
                :current-game="data.currentGame"
                :lobby-users="data.lobbyUsers"
                :current-user="currentUser"
                :ready-users="readyUsers"
                :available-games="data.availableGames"
                :available-colors="data.availableColors"
            />
            <TopCenterPanel :username="currentUser.username" />
            <CenterPanel
                :available-games="data.availableGames"
                :current-game="data.currentGame"
                :is-admin="currentUser.isAdmin"
            />
            <TopRightPanel
                :current-user="currentUser"
                :current-game="data.currentGame"
                :ready-users="readyUsers"
                :lobby-users="data.lobbyUsers"
            />
            <BottomLeftPanel
                :current-user="currentUser"
                :lobby-users="data.lobbyUsers"
            />
            <BottomRightPanel />
        </main>
    </div>
</template>

<style lang="scss" scoped>
.app-container {
    position: relative;
    display: flex;
    padding: 0.75rem 1.5rem;
    padding-top: 2rem;
    flex-direction: column;
    gap: 0.5rem;
    margin-inline: auto;
    container-type: inline-size;
}

.container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.panel {
    padding: 2rem;
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    justify-content: center;

    @media (width < 768px) {
        position: relative;
        align-items: center;
        padding: 0.5rem;
    }
}
</style>
