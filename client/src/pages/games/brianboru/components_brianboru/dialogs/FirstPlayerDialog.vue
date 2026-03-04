<script setup>
const props = defineProps(["firstPlayer", "closeDialog"]);
</script>

<template>
    <div class="dialog">
        <h1 class="dialogTitle">Pierwszy gracz</h1>

        <div class="dialogContent">
            <span :style="`--color: ${firstPlayer.color.hex}`">
                {{ firstPlayer.username }}
            </span>
            zostaje pierwszym graczem
        </div>

        <button class="dialogButton" @click="props.closeDialog">Dalej</button>
    </div>
</template>

<style scoped lang="scss">
.dialog {
    position: absolute;
    top: 50%;
    z-index: 30;
    font-family: "MedievalSharp";
    left: 50%;
    transform: translate(-50%, -65%);
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.74);

    height: 300px;
    width: 600px;
    justify-content: space-between;
    padding: 2rem 1rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    color: rgb(255, 255, 255);
    font-weight: normal;

    border-radius: 0.5rem;
    background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_grey.jpg");
    background-size: cover;
    gap: 2rem;
    box-shadow: 0px 2px 5px 3px rgba(0, 0, 0, 0.685);

    .dialogTitle {
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

    .dialogContent {
        font-size: 1.5rem;
    }
}
</style>
