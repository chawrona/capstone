import { onMounted, onUnmounted } from "vue";

import { soundBus } from "@/audio/soundBus";

export function usePageSounds(options = {}) {
    const { effects = [], music = null, sharedMusic = null } = options;

    const loadedEffectNames = [];

    onMounted(() => {
        effects.forEach((e) => {
            soundBus.preload(e.name, e.url, "effect", e.poolSize || 1);
            loadedEffectNames.push(e.name);
        });

        if (sharedMusic) {
            soundBus.setSharedMusic(sharedMusic);
        }

        if (music) {
            soundBus.enterMusic(music);
        }
    });

    onUnmounted(() => {
        loadedEffectNames.forEach((name) => {
            soundBus.unload(name);
        });

        if (music) {
            soundBus.exitMusic();
        }
    });
}
