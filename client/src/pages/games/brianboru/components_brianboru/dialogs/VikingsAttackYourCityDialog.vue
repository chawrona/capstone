<script setup>
import Vikings from "@/assets/games/gameAssets/brianboru/vikings.png";
import { useAppStore } from "@/store/useAppStore";

const props = defineProps(["closeDialog"]);
</script>

<template>
    <div class="dialog">
        <h1 class="dialogTitle">Wybierz miasto <br />z którego się wycofasz</h1>

        <button class="dialogButton blueButton" @click="props.closeDialog">
            Dalej <img :src="Vikings" class="icon" />
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
    justify-content: space-between;
    padding: 2rem 1rem;
    box-shadow: 0px 2px 5px 3px rgba(0, 0, 0, 0.685);

    display: flex;
    flex-direction: column;
    align-items: center;

    position: absolute;
    color: white;
    font-weight: normal;

    z-index: 30;
    border-radius: 0.5rem;
    background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_red.jpg");
    background-size: cover;
    gap: 2rem;

    .dialogTitle {
        letter-spacing: 1px;
        font-size: 2.2rem;
        text-align: center;
        line-height: 1.4;
        margin-top: 3rem;
    }
    .dialogContent {
        width: 70%;
        font-size: 1.3rem;
        text-align: center;
        line-height: 1.5;
    }
    .dialogButton {
        font-size: 1.25rem;
        border: none;
        border-radius: 0.25rem;

        position: relative;

        color: transparent;
    }

    .icon {
        position: absolute;
        left: 50%;
        top: 50%;
        display: inline-block;
        height: 30px;
        transform: translate(-50%, -45%);
    }
}
</style>
