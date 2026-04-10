<script setup>
const props = defineProps(["vikingsDialogInfo", "closeDialog"]);
</script>

<template>
    <div class="dialog">
        <h1 class="dialogTitle">Łupy wojenne</h1>
        <p>
            {{ vikingsDialogInfo.map((el) => el.reward) }}
        </p>
        <button class="dialogButton" @click="props.closeDialog">
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

       text-shadow: 0 0 4px rgba(0, 0, 0, 0.74);
    height: 300px;
    width: 600px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    color: white;
    font-weight: normal;
    padding: 1.25rem 1rem;
    z-index: 30;
    border-radius: 0.5rem;
    background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_red.jpg");
    background-size: cover;
    gap: 2rem;
     justify-content: space-between;
 padding: 2rem 1rem;
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
}
</style>
