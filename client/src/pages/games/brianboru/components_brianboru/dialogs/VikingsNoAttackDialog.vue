<script setup>
const props = defineProps(["closeDialog"]);
</script>

<template>
    <div class="dialog">
        <h1 class="dialogTitle">Wikingowie odparci</h1>
        <p class="subtitle">
            Wszyscy wikingowie zostali pokonani.<br />
            Żadne miasto nie jest zagrożone
        </p>
        <button class="dialogButton blueButton" @click="props.closeDialog">
            Dalej
        </button>
    </div>
</template>

<style scoped>
.dialog {
    position: absolute;
    top: 50%;
    font-family: "MedievalSharp";
    left: 50%;
    transform: translate(-50%, -65%);

    height: 300px;
    width: 600px;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.74);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    color: white;
    z-index: 30;
    font-weight: normal;
    padding: 1.25rem 1rem;
    border-radius: 0.5rem;
    background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_red.webp");
    background-size: cover;
    gap: 2rem;
    box-shadow: 0px 2px 5px 3px rgba(0, 0, 0, 0.685);
    justify-content: space-between;
    padding: 2rem 1rem;

    .subtitle {
        text-align: center;
        font-size: 1.5rem;
        line-height: 1.4;
    }
    .dialogTitle {
        letter-spacing: 1px;
        font-size: 2rem;
    }
}
</style>
