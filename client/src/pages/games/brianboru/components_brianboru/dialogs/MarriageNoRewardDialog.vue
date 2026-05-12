<script setup>
const props = defineProps(["closeDialog"]);
</script>

<template>
    <div class="dialog">
        <h2 class="dialogTitle">Zaślubiny odwołane</h2>
        <div class="dialogContent">
            <p>
                Kandydaci najwyraźniej uznali, że dziś nie jest dzień <br />na
                miłość. Ciekawe czy w prawdziwym życiu też są tacy opieszali
                jeżeli chodzi o sprawy związkowe
            </p>
        </div>
        <button class="dialogButton yellowButton" @click="props.closeDialog">
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
    z-index: 30;
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
    background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_yellow.webp");
    background-size: cover;
    gap: 2rem;
    box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.358);

    height: 300px;
    width: 600px;
    justify-content: space-between;
    padding: 2rem 1rem;
    box-shadow: 0px 2px 5px 3px rgba(0, 0, 0, 0.685);
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.74);

    .dialogTitle {
        letter-spacing: 1px;
        font-size: 2rem;
    }

    .dialogContent {
        text-align: center;
        line-height: 1.2;

        font-size: 1.4rem;
    }
}
</style>
