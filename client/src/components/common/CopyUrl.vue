<script setup>
import { useRoute } from "vue-router";
import { useToast } from "vue-toast-notification";
import { soundBus } from "../../audio/soundBus";

const route = useRoute();
const toast = useToast();

const copyUrl = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        soundBus.playEffect("click");
        toast.success("Skopiowano pomyślnie!", {
            duration: 2000,
            position: "top-right",
        });
    } catch (err) {
        toast.error("Wystąpił błąd przy kopiowaniu.", {
            duration: 2000,
            position: "top-right",
        });
    }
};
</script>

<template>
    <span class="lobby-code" @click="copyUrl">
        <div class="code">
            <span>#{{ route.params.id }} </span>
            <img :src="Copy" alt="" />
        </div>
    </span>
</template>

<style scoped>
.lobby-code {
    font-size: 1.25rem;
    color: #ffffff;
    text-align: right;
    padding: 0.25rem;
    border-radius: 4px;
    font-family: serif;
    letter-spacing: 0.04rem;
}

.lobby-code:hover {
    cursor: copy;
    background-color: #3d3d3d5b;
}

.code {
    font-size: 1.5rem;
    align-items: center;
    justify-content: end;
    display: flex;
    gap: 0.5rem;
    padding: 0.25rem;
    padding-right: 0;
    padding-bottom: 0;
}

.code img {
    height: 1.75rem;
    transform: translateY(-2px);
}
</style>
