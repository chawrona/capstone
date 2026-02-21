<script setup>
const props = defineProps(["firstPlayer", "closeDialog"]);
</script>

<template>
    <div class="dialog">
        <h2 class="dialogTitle">Pierwszy gracz</h2>
        <h2>
            Znacznik pierwszego gracza wędruje do: {{ firstPlayer.username }}
        </h2>
        <p>Kolor: {{ firstPlayer.color }}</p>
        <button class="dialogButton" @click="props.closeDialog">Dalej</button>
    </div>
</template>

<style scoped>
.dialog {
    position: absolute;
    top: 50%;  z-index: 30;
    font-family: "MedievalSharp";
    left: 50%;
    transform: translate(-50%, -50%);

    height: 250px;
    width: 600px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    color: white;
    font-weight: normal;
    padding: 1.25rem 1rem;
    border-radius: 0.5rem;
    background-image: url("/src/assets/games/gameAssets/brianboru/grayCard.png");
    background-size: cover;
    gap: 2rem;
    box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.358);

    .dialogTitle {
        font-weight: normal;
        letter-spacing: 1px;
        font-size: 2rem;
    }

    .dialogButton {
        font-size: 1.25rem;
        border: none;
        border-radius: 0.25rem;
        padding: 0.5rem 1.75rem;

        &[disabled="true"] {
            color: red;
        }
    }
}
</style>
