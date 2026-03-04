<script setup>
const props = defineProps(["marriage", "closeDialog"]);
</script>

<template>
    <div class="dialog">
        <h1 class="dialogTitle">Śluby</h1>

        <div class="dialogContent">
            <p>
                Kliknij na kościół, aby w dowolnym momencie sprawdzić aktualnego
                proponowanego małżonka
            </p>
            <img
                :src="`/src/assets/games/gameAssets/brianboru/${marriage.name.toLowerCase()}.jpg`"
                class="marriageIcon"
            />
        </div>

        <button class="dialogButton" @click="props.closeDialog">
            Przynajmniej w grze mogę wziąć ślub
        </button>
    </div>
</template>

<style scoped>
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
    background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_yellow.jpg");
    background-size: cover;
    gap: 0rem;

    height: 300px;
    width: 600px;
    justify-content: space-between;
    padding: 2rem 1rem;
    box-shadow: 0px 2px 5px 3px rgba(0, 0, 0, 0.685);

    .dialogTitle {
        letter-spacing: 1px;
        font-size: 2rem;
    }

    .dialogContent {
        display: flex;

        justify-content: center;
        gap: 1rem;
        align-items: center;
        font-size: 1.5rem;

        width: 85%;
    }

    .marriageIcon {
        transform: translateY(-10px);
        height: 140px;
        border-radius: 0.25rem;
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
