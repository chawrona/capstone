<script setup>
import { storeToRefs } from "pinia";
import Logo from "@/assets/logo.png"
import { useAppStore } from "@/store/useAppStore";

const store = useAppStore();
const { isLoading } = storeToRefs(store);
</script>

<template>
    <Transition>
        <div v-if="isLoading" class="background">
            <img :src="Logo" alt="Logo" class="logo" />
            <p class="info">Loading. Please wait</p>
        </div>
    </Transition>
</template>

<style scoped>
.background {
    position: absolute;
    z-index: 99999999;
    display: flex;
    align-items: center;
    background: radial-gradient(circle, #2c1901 0%, rgba(23, 14, 1, 1) 80%);
    flex-direction: column;
    gap: 1rem;
    inset: 0;
    justify-content: center;
    padding-bottom: 15vh;
}

.info {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    color: gray;
    font-size: 1.2rem;
    text-align: center;
    transform: translateX(-50%);
    user-select: none;
}

.logo {
    width: 155px;
    animation: glowing 2s ease-in-out infinite alternate;
    user-select: none;
}

@keyframes glowing {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0.55;
    }
}
</style>
