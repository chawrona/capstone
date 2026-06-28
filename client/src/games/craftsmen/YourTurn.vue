<script setup>
import { ref, watch } from "vue";

import { soundBus } from "../../audio/soundBus";

const props = defineProps({
    isYourTurn: Boolean,
});

const visible = ref(false);

watch(
    () => props.isYourTurn,
    (newValue, oldValue) => {
        // pokazuj tylko przy zmianie false -> true
        console.log("XD");

        if (!oldValue && newValue) {
            visible.value = true;
            console.log("XD 1");
            soundBus.playEffect("nextLevel");
            setTimeout(() => {
                visible.value = false;
                console.log("XD2");
            }, 650);
        }
    },
);
</script>

<template>
    <Transition name="turn-popup">
        <div v-if="visible" class="overlay">
            <div class="popup">
                <h1>Twoja tura</h1>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.overlay {
    position: absolute;
    left: 47%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    pointer-events: none;
}

.popup {
    padding: 18px 36px;
    width: 700px;
    height: 350px;
    border-radius: 16px;

    background: rgba(0, 0, 0, 0.8);
    color: white;

    font-size: 28px;
    font-weight: 700;
    letter-spacing: 0.5px;
    display: grid;
    transform: translateY(-15%);
    place-items: center;
    backdrop-filter: blur(6px);

    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);

    h1 {
        transform: translateY(-20%);
    }
}

/* enter */
.turn-popup-enter-active {
    transition:
        opacity 0.25s ease,
        transform 0.25s ease;
}

.turn-popup-enter-from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9) translateY(-15%);
}

/* leave */
.turn-popup-leave-active {
    transition:
        opacity 0.5s ease,
        transform 0.5s ease;
}

.turn-popup-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.05) translateY(-15%);
}
</style>
