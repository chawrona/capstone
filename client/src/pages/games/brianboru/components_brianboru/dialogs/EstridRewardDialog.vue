<script setup>
import { computed, ref } from "vue";

import Mapa from "@/assets/games/gameAssets/brianboru/map_icon.png";
import Vikings from "@/assets/games/gameAssets/brianboru/vikings.png";

import statuses from "../../../../../../../server/models/games/brianboru/config/statuses";
import { useAppStore } from "../../../../../store/useAppStore";
import Card from "../Card.vue";

const props = defineProps(["closeDialog"]);
const store = useAppStore();

const chooseEstridReward = (reward) => {
    props.closeDialog();
    store.emit("gameData", {
        data: reward,
        eventName: "estridReward",
    });
};
</script>

<template>
    <div class="dialog">
        <h1 class="dialogTitle">Estrid użycza pomocy</h1>
        <div class="dialogContent">
            <p class="subtitle">
                Wybierz rodzaj wsparcia od Księżniczki Danii Estrid
            </p>
            <div>
                <img :src="Vikings" class="icon-text" /><b class="red"
                    >Wsparcie Wojskowe</b
                >
                - wszystkie miasta należące do Wikingów zostaną oddane pod Twoją
                kontrolę
            </div>
            <div>
                <img :src="Mapa" class="icon-text" /><b class="blue"
                    >Wsparcie Regionalne</b
                >
                - Miasta wikingów namacają regiony, w których się znajdują Twoją
                obecnością
            </div>
        </div>
        <div class="buttons">
            <button
                class="dialogButton blueButton"
                @click="() => chooseEstridReward('vikings')"
            >
                <img :src="Vikings" class="icon" />
            </button>
            <button
                class="dialogButton blueButton"
                @click="() => chooseEstridReward('regions')"
            >
                <img :src="Mapa" class="icon" />
            </button>
        </div>
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

    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    color: white;
    font-weight: normal;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.74);
    border-radius: 0.5rem;
    background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_yellow.webp");
    background-size: cover;
    gap: 0rem;

    height: 350px;
    width: 700px;
    justify-content: space-between;
    padding: 2rem 1rem;
    box-shadow: 0px 2px 5px 3px rgba(0, 0, 0, 0.685);

    .dialogTitle {
        letter-spacing: 1px;
        font-size: 2rem;
    }

    .dialogContent {
        flex-direction: column;
        display: flex;
        text-align: left;
        justify-content: center;
        gap: 1rem;

        font-size: 1.1rem;
        line-height: 1.4;
        width: 85%;

        .subtitle {
            font-size: 1.5rem;
            width: 100%;
            text-align: center;
        }
    }

    .buttons {
        display: flex;
        gap: 1rem;
    }

    .dialogButton {
        font-size: 1.25rem;
        border: none;
        border-radius: 0.25rem;
        padding: 0.1rem 2.5rem;

        &[disabled="true"] {
            color: red;
        }
    }

    .icon {
        display: inline-block;
        height: 32px;
        transform: translateY(2px);
    }

    .icon-text {
        width: 45px;
        float: left;
        margin-right: 10px;
        transform: translateY(3px);
    }
}
</style>
