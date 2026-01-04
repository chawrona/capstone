<script setup>
import OK from "@/assets/ready.svg";
const props = defineProps([
    "chanceCard",
    "closeDialogs",
    "chanceCardDialogOpen",
]);
</script>

<template>
    <div v-if="chanceCardDialogOpen" class="chance-card">
        <h2 class="card-content">{{ chanceCard.name }}</h2>
        <button class="eurobusiness-button close-button" @click="closeDialogs">
            <img :src="OK" />
        </button>
    </div>
</template>

<style scoped lang="scss">
.chance-card {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 525px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    gap: 1rem;

    font-family: "Open Sans", sans-serif;
    font-size: 1.5rem;
    color: #ffffff;
    padding: 2rem 2rem;

    border: 4px solid #ffffff;
    border-radius: 0.5rem;
    outline: 6px solid #40a2e4;

    background: linear-gradient(
        142deg,
        rgba(64, 162, 228, 1) 0%,
        rgba(43, 135, 196, 1) 100%
    );
    box-shadow:
        rgba(0, 0, 0, 0.35) 0px 20px 40px,
        rgba(0, 0, 0, 0.32) 0px 12px 12px;
}

.chance-card .card-content {
    font-size: 2.25rem;
    margin-bottom: 0.25rem;
}

.chance-card .close-button {
    width: 200px;
    padding-block: 0.5rem;
}

.chance-card .close-button img {
    display: block;
    margin: 0 auto;
    width: 2rem;
}
</style>
