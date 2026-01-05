<script setup>
import X from "@/assets/X.svg";
const props = defineProps(["title", "closeDialogCallback"]);
import { soundBus } from "../../../../audio/soundBus";
</script>

<template>
    <header class="header">
        <h1 class="dialog-title">{{ props.title }}</h1>
        <button
            class="theme-button close-dialog"
            @click="
                () => {
                    closeDialogCallback();
                    soundBus.playEffect('click');
                }
            "
        >
            <img :src="X" alt="" class="close-icon" />
        </button>
    </header>
</template>

<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.dialog-title {
    font-family: "Cinzel";
    font-size: 1.75rem;
    width: 100%;
}

.header .theme-button.close-dialog {
    padding: 0.5rem;
    display: grid;
    place-items: center;
    width: 3rem;
    border: none;
    background-image: none;
    background-color: transparent;
    backdrop-filter: unset;
    flex-shrink: 0;
    aspect-ratio: 1 / 1;
    transform: translateX(10px);

    &:hover {
        background-color: #ffffff25;
    }
}

.close-icon {
    width: 2rem;
}

@media (width < 358px) {
    .close-dialog {
        width: 2.5rem;
    }

    .close-icon {
        width: 1.5rem;
    }
}
</style>
