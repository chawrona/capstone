<script setup>
import { useAppStore } from "@/store/useAppStore";

const props = defineProps(["marriageDialogInfo", "closeDialog"]);
const store = useAppStore();

const testCityChosing = () => {
    props.closeDialog();
    store.emit("gameData", {
        data: "cityId",
        eventName: "marriageWinnerChooseReward",
    });
}

</script>

<template>
    <div class="dialog">
        <h1 class="dialogTitle">Twój ślub</h1>
        <p>Poślubiłeś!</p>
        <p>
            {{ marriageDialogInfo }}
        </p>
        <button class="dialogButton" @click="testCityChosing">
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
    transform: translate(-50%, -50%);
  z-index: 30;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    color: white;
    font-weight: normal;
    padding: 1.25rem 1rem;
    border-radius: 0.5rem;
    background-image: url("/src/assets/games/gameAssets/brianboru/yellowCard.png");
    background-size: cover;
    gap: 2rem;
    box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.358);

    img {
        height: 300px;
        border-radius: 0.25rem;
    }

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
