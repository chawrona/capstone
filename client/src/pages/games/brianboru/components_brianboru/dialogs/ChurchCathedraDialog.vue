<script setup>
import Church from "@/assets/games/gameAssets/brianboru/church.png";
import { useAppStore } from "@/store/useAppStore";

const props = defineProps(["closeDialog"]);
const store = useAppStore();
</script>

<template>
    <div class="dialog">
        <h2 class="dialogTitle">Zbuduj katedrę</h2>
        <div class="dialogContent">
            <p>
                Miasto posiadające katedrę dominuję nad innymi
                <b>w regionie</b>. <br />Obecność Biskupstwa sprawia, że miasto
                jest <b>dwukrotnie ważniejsze</b>.
            </p>
        </div>
        <button
            class="dialogButton blueButton"
            @click="() => props.closeDialog()"
        >
            <img :src="Church" class="icon" />
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
    z-index: 30;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.74);
    height: 300px;
    width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 1rem;
    position: absolute;
    color: white;
    font-weight: normal;
    border-radius: 0.5rem;
    background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_blue.jpg");
    background-size: cover;
    gap: 0.5rem;
    box-shadow: 0px 2px 5px 3px rgba(0, 0, 0, 0.685);

    .dialogContent {
        width: 100%;
        line-height: 1.4;
        text-align: center;
        font-size: 1.1rem;
    }

    .dialogTitle {
        margin-bottom: 0;
        letter-spacing: 1px;
        font-size: 2rem;
    }

    .icon {
        height: 150%;
        transform: translateY(-0.28rem);
    }
}
</style>
