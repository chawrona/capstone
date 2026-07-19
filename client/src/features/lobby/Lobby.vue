<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

import GlobalSettings from "../../components/common/GlobalSettings.vue";
import { usePageSounds } from "../../composables/usePageSounds.js";
import { useAppStore } from "../../store/useAppStore.js";
import BottomLeftPanel from "./components/panels/BottomLeftPanel.vue";
import BottomRightPanel from "./components/panels/BottomRightPanel.vue";
import CenterPanel from "./components/panels/CenterPanel.vue";
import TopCenterPanel from "./components/panels/TopCenterPanel.vue";
import TopLeftPanel from "./components/panels/TopLeftPanel.vue";
import TopRightPanel from "./components/panels/TopRightPanel.vue";

const store = useAppStore();

usePageSounds({
    effects: [{ name: "click", poolSize: 5, url: "/sounds/click.mp3" }],
});

const data = ref(null);
let unwatch = null;

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
    if (store.socket) {
        store.socket.on("lobbyData", (lobbyData) => {
            data.value = lobbyData;
        });

        store.socket.emit("lobbyDataRequest");

        store.socket.once("connect", () => {
            if (!data.value) {
                store.socket.emit("lobbyDataRequest");
            }
        });
    } else {
        unwatch = watch(
            () => store.socket,
            (newSocket) => {
                if (newSocket) {
                    store.socket.on("lobbyData", (lobbyData) => {
                        data.value = lobbyData;
                    });

                    store.socket.emit("lobbyDataRequest");

                    store.socket.once("connect", () => {
                        if (!data.value) {
                            store.socket.emit("lobbyDataRequest");
                        }
                    });

                    unwatch();
                    unwatch = null;
                }
            },
        );
    }
});

onUnmounted(() => {
    if (store.socket) store.socket.off("lobbyData");
    if (unwatch) unwatch();
});
</script>

<template>
    <div class="app-container">
        <main v-if="data" class="container">
            <GlobalSettings />
            <TopLeftPanel
                :current-game="data.currentGame"
                :lobby-users="data.lobbyUsers"
                :current-user="currentUser"
                :ready-users="readyUsers"
                :available-games="data.availableGames"
                :available-colors="data.currentGame.colors"
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
        <div v-else class="loading"></div>
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

.loading {
    &::before {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 2;
        display: inline-block;
        height: 20%;
        border: 15px solid #e0d4b0;
        animation: rotation 1s linear infinite;
        aspect-ratio: 1 / 1;
        border-bottom-color: transparent;
        border-radius: 50%;
        box-sizing: border-box;
        content: "";
        transform: translate(-50%, -50%);
    }

    @keyframes rotation {
        0% {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }
}
</style>
