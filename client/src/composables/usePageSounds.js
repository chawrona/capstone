import { onMounted, onUnmounted } from "vue";

import { soundBus } from "@/audio/soundBus";

export function usePageSounds(options = {}) {
    const { effects = [], music = [] } = options;

    const loadedResources = [];

    onMounted(() => {
        effects.forEach((e) => {
            soundBus.preload(e.name, e.url, "effect", e.pool || 1);
            loadedResources.push({ name: e.name, type: "effect" });
        });

        music.forEach((m) => {
            // Użyj resetSoundtrack zamiast stopMusic + preload + playMusic
            soundBus.resetSoundtrack(m.url);
            loadedResources.push({ name: m.name, type: "music" });
        });
    });

    onUnmounted(() => {
        loadedResources.forEach(({ name }) => {
            soundBus.unload(name);
        });
    });
}
