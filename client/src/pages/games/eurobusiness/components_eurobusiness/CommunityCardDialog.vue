<script setup>
import OK from "@/assets/ready.svg";
const props = defineProps([
    "communityCard",
    "closeDialogs",
    "communityCardDialogOpen",
]);
</script>

<template>
    <div v-if="communityCardDialogOpen" class="community-card">
        <h2 class="card-content">{{ communityCard.name }}</h2>
        <button class="eurobusiness-button close-button" @click="closeDialogs">
            <img :src="OK" />
        </button>
    </div>
</template>

<style scoped lang="scss">
.community-card {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 525px;
    height: 225px;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    text-align: center;

    font-family: "Open Sans", sans-serif;
    font-size: 1.5rem;
    color: #ffffff;
    padding: 0.75rem 2rem;

    border: 4px solid #ffffff;
    border-radius: 0.5rem;
    outline: 6px solid #e47440;

    background: linear-gradient(142deg, #e47440 0%, #ce6433 100%);
    box-shadow:
        rgba(0, 0, 0, 0.35) 0px 20px 40px,
        rgba(0, 0, 0, 0.32) 0px 12px 12px;
}

.community-card .card-title {
    font-size: 3rem;
    line-height: 1;
    margin-bottom: 0;
}

.community-card .card-content {
    font-size: 2.25rem;
    margin-bottom: 0.25rem;
}

.community-card .close-button {
    width: 200px;
    padding-block: 0.5rem;
    background-color: #ffffff;

    &:hover {
        background-color: #dfdfdf;
    }
}

.community-card .close-button img {
    display: block;
    margin: 0 auto;
    width: 2rem;
    filter: invert(1);
}
</style>
