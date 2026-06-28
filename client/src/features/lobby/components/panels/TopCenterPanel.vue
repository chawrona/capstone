<script setup>
const props = defineProps(["username"]);
</script>

<template>
    <div class="panel top-center theme-title">
        {{ props.username }}
    </div>
</template>

<style scoped>
.top-center {
    font-family: "Cinzel";
    color: #e0d4b0;

    top: 0;
    font-size: 1.5rem;
    left: 50%;
    transform: translateX(-50%);

    @media (width < 1200px) {
        transform: translateX(-40%);
    }

    @media (width < 768px) {
        order: 1;
        transform: translateX(-50%);
    }
}
</style>
