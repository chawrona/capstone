<script setup>
const props = defineProps(["gameData"]);
</script>

<template>
    <div class="bottom-center">
        <h1 class="nick">{{ props.gameData.nick }}</h1>
        <h2 class="hajs">{{ props.gameData.hajs }}$</h2>
    </div>
</template>

<style scoped>
.bottom-center {
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10%;
}

.nick {
    text-align: center;
    font-size: 1.5rem;
    color: white;
}

.hajs {
    text-align: center;
    font-size: 2.5rem;
    color: white;
}
</style>
