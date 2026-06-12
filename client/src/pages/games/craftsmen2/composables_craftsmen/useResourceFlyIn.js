// useResourceFlyIn.js
import { ref, watch, nextTick } from "vue";

export function useResourceFlyIn(playersRef) {
    const flyingIn = ref(new Set());

    async function triggerFlyIn(key) {
        flyingIn.value.add(key);
        await nextTick();

        const source = document.querySelector(".innerPath");
        const target = document.querySelector(`[data-fly-key="${key}"]`);

        if (source && target) {
            const srcRect = source.getBoundingClientRect();
            const tgtRect = target.getBoundingClientRect();

            const ox =
                srcRect.left +
                srcRect.width / 2 -
                (tgtRect.left + tgtRect.width / 2);
            const oy =
                srcRect.top +
                srcRect.height / 2 -
                (tgtRect.top + tgtRect.height / 2);

            target.style.setProperty("--ox", `${ox}px`);
            target.style.setProperty("--oy", `${oy}px`);
        }

        setTimeout(() => flyingIn.value.delete(key), 700);
    }

    watch(playersRef, (newPlayers, oldPlayers) => {
        if (!oldPlayers) return;

        newPlayers.forEach((player) => {
            const old = oldPlayers.find((p) => p.publicId === player.publicId);
            if (!old) return;

            for (const [resource, count] of Object.entries(player.inventory)) {
                const prevCount = old.inventory[resource] ?? 0;
                if (count > prevCount) {
                    for (let i = prevCount; i < count; i++) {
                        triggerFlyIn(`${player.publicId}:${resource}:${i}`);
                    }
                }
            }
        });
    });

    return { flyingIn };
}
