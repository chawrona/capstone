<script setup>
const props = defineProps(["currentVikings", "closeDialog"]);
import Axe from "@/assets/games/gameAssets/brianboru/axe.png";
import Vikings from "@/assets/games/gameAssets/brianboru/vikings.png";
</script>

<template>
    <div class="dialog">
        <h1 class="dialogTitle">Wikingowie</h1>

        <div class="dialogContent">
            Zwiadowcy donoszą o obecności statku z

            <span class="wrap">
                {{ props.currentVikings }}
                <img :src="Vikings" alt="" class="vikings" />
            </span>

            wikingami na pokładzie.
        </div>

        <button class="dialogButton blueButton" @click="props.closeDialog">
            Dalej <img :src="Axe" class="icon" />
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
    background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_red.webp");
    background-size: cover;
    gap: 2rem;

    .dialogTitle {
        letter-spacing: 1px;
        font-size: 2rem;
    }
    .dialogContent {
        font-size: 1.4rem;
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

    .wrap {
        font-size: 2rem;
        font-weight: bold;
        display: flex;
        gap: 0.5rem;
        align-items: center;
        justify-content: center;
    }

    .vikings {
        display: inline-block;
        height: 38px;
        transform: translateY(-3px);
    }
}
</style>
