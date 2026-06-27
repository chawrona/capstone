<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

import { soundBus } from "../audio/soundBus";
import PlaySoundtrack from "../components/common/PlaySoundtrack.vue";
import { usePageSounds } from "../composables/usePageSounds";
import { useAppStore } from "../store/useAppStore";

const store = useAppStore();
const router = useRouter();

usePageSounds({
    effects: [{ name: "click", poolSize: 5, url: "/sounds/click.mp3" }],
});

const lobbyId = ref("");
const awaitingCreateLobby = ref(false);
const awaitingJoinLobby = ref(false);
const blockEverything = computed(
    () => awaitingCreateLobby.value || awaitingJoinLobby.value,
);

const hangleSocketError = () => {
    awaitingCreateLobby.value = false;
    awaitingJoinLobby.value = false;
};

onMounted(() => {});

const createLobby = () => joinLobby(true);

const joinLobby = async (createLobby) => {
    const toast = useToast();
    awaitingJoinLobby.value = true;
    soundBus.playEffect("click");
    try {
        const response = await fetch(
            `${import.meta.env.VITE_APP_IP}/api/joinLobby`,
            {
                body: JSON.stringify({
                    lobbyId: createLobby ? "create" : lobbyId.value,
                }),
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
            },
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        router.push(data.redirect);
    } catch (error) {
        toast.error(error.message, {
            duration: 4000,
            position: "top-left",
            type: "error",
        });
    } finally {
        awaitingJoinLobby.value = false;
    }
};
</script>

<template>
    <div class="app-container">
        <PlaySoundtrack url="/sounds/tale.mp3" />
        <main class="content">
            <h2 class="theme-subtitle">Hungarian Vegas</h2>
            <h1 class="theme-title">BOARD GAMES</h1>

            <div class="wrap">
                <button
                    class="theme-button create"
                    :data-awaiting="awaitingCreateLobby"
                    :disabled="blockEverything"
                    @click="createLobby"
                >
                    Stwórz Pokój
                </button>
                <div class="separator" />
                <form class="form" @submit.prevent="joinLobby">
                    <input
                        v-model="lobbyId"
                        type="text"
                        maxlength="6"
                        placeholder="Wprowadź kod pokoju"
                        class="theme-input"
                        :disabled="blockEverything"
                    />
                    <!-- :disabled="blockEverything || lobbyId.length < 4" -->
                    <button
                        class="theme-button join"
                        :data-awaiting="awaitingJoinLobby"
                    >
                        Dołącz
                    </button>
                </form>
            </div>
        </main>
    </div>
</template>

<style lang="scss" scoped>
.content {
    display: flex;
    padding: 0.75rem 1.5rem;
    align-items: center;
    container-type: inline-size;
    flex-direction: column;
    justify-content: space-between;
    margin-inline: auto;
    margin-top: 40vh;
    max-width: 580px;
    transform: translateY(-50%);
}

.theme-subtitle {
    font-size: 1.1rem;
    text-align: center;
}

.theme-title {
    font-size: 1.85rem;
    margin-bottom: 1.25rem;
    text-align: center;
}

.wrap {
    display: flex;
    width: 100%;
    flex-direction: column;
    font-size: 18px;
    gap: 1.25rem;
    max-width: 425px;
}

.separator {
    width: 100%;
    height: 1px;
    background-color: #f5eac652;
}

.form {
    display: flex;
    gap: 0.5rem;
}

.theme-input {
    width: 100%;
    font-size: 13px;
}

.theme-button {
    font-size: 13px;
}

.sound-button {
    position: fixed;
    right: 2rem;
    padding: 0.75rem;
    bottom: 2rem;
    img {
        width: 1.25rem;
    }
}

@media (width > 400px) {
    .theme-title {
        font-size: 2.4rem;
    }

    .theme-subtitle {
        font-size: 1.3rem;
        text-align: center;
    }

    .theme-input {
        width: 100%;
        font-size: 16px;
    }

    .theme-button {
        font-size: 16px;
    }

    .container {
        padding: 0.75rem 1.5rem;
    }
}

@media (width > 470px) {
    .theme-title {
        font-size: 2.88rem;
    }
}

@media (width > 800px) {
    .content {
        align-items: center;
        max-width: 835px;
    }

    .theme-title {
        font-size: 4.5rem;
        margin-bottom: 1.5rem;
    }

    .theme-subtitle {
        font-size: 2rem;
        margin-bottom: 0.1rem;
    }

    .wrap {
        flex-direction: row;
        gap: 2.15rem;
        justify-content: center;
        max-width: 100%;
    }

    .form {
        gap: 0.75rem;
    }

    .separator {
        width: 1px;
        height: auto;
    }

    .theme-input {
        width: 100%;
    }
}
</style>
