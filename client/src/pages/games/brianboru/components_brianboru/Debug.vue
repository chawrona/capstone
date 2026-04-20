<script setup>
import { onMounted, onUnmounted, ref } from "vue";

import { useAppStore } from "../../../../store/useAppStore";

const store = useAppStore();
const command = ref("");
const isActive = ref(false);

const MAX_HISTORY = 50;
const LOCAL_STORAGE_KEY = "debugCommandHistory";

const commandHistory = ref([]);
let historyIndex = -1;

// --- Wczytanie historii z localStorage przy starcie ---
const loadHistory = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) commandHistory.value = parsed;
        } catch (e) {
            console.error("Nie udało się wczytać historii komend", e);
        }
    }
};

// --- Zapis historii do localStorage ---
const saveHistory = () => {
    localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(commandHistory.value),
    );
};

const handleKeyPress = (event) => {
    const target = event.target;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

    if (event.key === "d") {
        isActive.value = !isActive.value;
    }
};

const handleInputKey = (event) => {
    if (event.key === "ArrowUp") {
        if (commandHistory.value.length === 0) return;

        if (historyIndex < commandHistory.value.length - 1) {
            historyIndex++;
            command.value =
                commandHistory.value[
                    commandHistory.value.length - 1 - historyIndex
                ];
        }
    } else if (event.key === "ArrowDown") {
        if (historyIndex > 0) {
            historyIndex--;
            command.value =
                commandHistory.value[
                    commandHistory.value.length - 1 - historyIndex
                ];
        } else if (historyIndex === 0) {
            historyIndex--;
            command.value = "";
        }
    }
};

onMounted(() => {
    loadHistory();

    store.socket.on("debug", (response) => {
        alert(response);
        console.log(response);
    });
    window.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
    store.socket.off("debug");
    window.removeEventListener("keydown", handleKeyPress);
});

const sendCommand = () => {
    const trimmed = command.value.trim();
    if (!trimmed) return;

    store.emit("gameData", {
        data: trimmed,
        eventName: "debugCommand",
    });

    // Dodanie komendy do historii
    commandHistory.value.push(trimmed);

    // Ograniczenie do MAX_HISTORY
    if (commandHistory.value.length > MAX_HISTORY) {
        commandHistory.value = commandHistory.value.slice(-MAX_HISTORY);
    }

    saveHistory();

    historyIndex = -1;
    command.value = "";
};
</script>

<template>
    <div v-if="isActive" class="debug">
        <div>
            <strong>Dostępne komendy:</strong>
            <ul>
                <li>
                    <code
                        ><span class="command">/addCards</span> &lt;id |
                        id,id,...&gt;</code
                    >
                </li>
                <li>
                    <code
                        ><span class="command">/removeCards</span> &lt;id |
                        id,id,...&gt;</code
                    >
                </li>
                <li>
                    <code
                        ><span class="command">/setGamePhase</span> &lt;phase |
                        last&gt;</code
                    >
                </li>
                <li>
                    <code
                        ><span class="command">/setAttackingPhase</span>
                        &lt;phase | last&gt;</code
                    >
                </li>
                <li>
                    <code
                        ><span class="command">/setMarriage</span>
                        &lt;name&gt;</code
                    >
                </li>
                <li>
                    <code><span class="command">/debugEstrid</span></code>
                </li>
                <li>
                    <code><span class="command">/debugGameEnd</span></code>
                </li>
                <li>
                    <code
                        ><span class="command">/getProperty </span
                        >&lt;properties&gt;</code
                    >
                </li>
            </ul>
        </div>

        <div style="margin-top: 10px">
            <input
                v-model="command"
                placeholder="Wpisz komendę i naciśnij Enter"
                @keyup.enter="sendCommand"
                @keydown.up.prevent="handleInputKey"
                @keydown.down.prevent="handleInputKey"
            />
        </div>
    </div>
</template>

<style scoped>
.debug {
    width: 550px;
    position: absolute;
    top: 1rem;
    left: 1rem;
    background-color: black;
    color: white;
    padding: 1rem;
}

.command {
    color: gold;
}

li {
    margin-top: 8px;
    font-size: 12px;
}

code {
    font-size: 16px;
}

input {
    width: 100%;
    padding: 6px;
    font-size: 14px;
}
ul {
    list-style: none;
}
</style>
