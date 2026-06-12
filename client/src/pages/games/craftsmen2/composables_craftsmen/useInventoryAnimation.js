import { ref, watch, nextTick } from "vue";

import { soundBus } from "../../../../audio/soundBus.js";

export function useInventoryAnimation(youRef) {
    const explicitFlyOut = ref(null);
    const flyingIn = ref(new Set()); // klucze nowych surowców
    const flyingOut = ref(new Map()); // klucz → {name} surowców które znikają
    const coinsAnimating = ref(false);

    // --- SYSTEM KOLEJKOWANIA DŹWIĘKÓW ---
    const soundQueue = [];
    let isPlayingSounds = false;
    const SOUND_DELAY = 200; // Zwiększony delay na 200ms

    const playNextSound = () => {
        if (soundQueue.length === 0) {
            isPlayingSounds = false;
            return;
        }
        isPlayingSounds = true;
        const soundName = soundQueue.shift();
        soundBus.playEffect(soundName);

        setTimeout(playNextSound, SOUND_DELAY);
    };

    const enqueueSound = (soundName) => {
        soundQueue.push(soundName);
        if (!isPlayingSounds) {
            playNextSound();
        }
    };
    // ------------------------------------

    async function triggerFlyIn(key, targetSelector) {
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

        setTimeout(() => flyingIn.value.delete(key), 1000);
    }

    async function triggerFlyOut(key, name) {
        flyingOut.value.set(key, name);
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

        setTimeout(() => flyingOut.value.delete(key), 850);
    }

    watch(youRef, (newYou, oldYou) => {
        if (!oldYou) return;

        if (newYou.coins !== oldYou.coins) {
            const oldCoins = oldYou.coins ?? 0;
            const newCoins = newYou.coins ?? 0;

            // Sprawdzamy czy monety przybyły, czy ubyły
            if (newCoins > oldCoins) {
                enqueueSound("sell");
            } else if (newCoins < oldCoins) {
                enqueueSound("spendMoney");
            }

            // Twoja dotychczasowa animacja monet
            coinsAnimating.value = false;
            nextTick(() => {
                coinsAnimating.value = true;
            });
            setTimeout(() => {
                coinsAnimating.value = false;
            }, 600);
        }

        // Inventory — porównaj surowce (bez empty)
        const oldInv = oldYou.inventory;
        const newInv = newYou.inventory;
        const allResources = new Set([
            ...Object.keys(oldInv),
            ...Object.keys(newInv),
        ]);

        let addedInThisTick = 0; // Śledzimy ile dodano w tej rundzie, by grać naprzemiennie
        let removedInThisTick = 0; // Śledzimy ile usunięto, by grać rosnące dźwięki

        for (const resource of allResources) {
            const oldCount = oldInv[resource] ?? 0;
            const newCount = newInv[resource] ?? 0;

            if (newCount > oldCount) {
                // Pojawiają się nowe
                for (let i = oldCount; i < newCount; i++) {
                    triggerFlyIn(`${resource}:${i}`);

                    // Kolejkowanie dźwięku przychodzącego surowca
                    const sound =
                        addedInThisTick % 2 === 1
                            ? "getResource2"
                            : "getResource";
                    enqueueSound(sound);
                    addedInThisTick++;
                }
            } else if (newCount < oldCount) {
                const takeSounds = [
                    "takeResource",
                    "takeResource2",
                    "takeResource3",
                    "takeResource4",
                    "takeResource5",
                    "takeResource6",
                    "takeResource7",
                    "takeResource8",
                ];

                for (let i = newCount; i < oldCount; i++) {
                    let key = `${resource}:${i}`;

                    if (explicitFlyOut.value?.startsWith(resource)) {
                        key = explicitFlyOut.value;
                        explicitFlyOut.value = null;
                    }

                    triggerFlyOut(key, resource);

                    enqueueSound(
                        takeSounds[removedInThisTick % takeSounds.length],
                    );
                    removedInThisTick++;
                }
            }
        }
    });

    return { coinsAnimating, explicitFlyOut, flyingIn, flyingOut };
}
