<script setup>
import PlayerIcon from '../PlayerIcon.vue';
import Points from "@/assets/games/gameAssets/brianboru/points.png";
import Sun from "@/assets/games/gameAssets/brianboru/sun.png";
import NoVikings from "@/assets/games/gameAssets/brianboru/noVikings.png";
const props = defineProps(["vikingsDialogInfo", "closeDialog"]);
</script>

<template>
    <div class="dialog">
        <h1 class="dialogTitle">Łupy wojenne</h1>
  
        <div class="dialogContent">
            
            <div v-for="player in vikingsDialogInfo" class="wrap">
                <PlayerIcon :player="player.player" />

                <div v-for="sun in player.reward.suns" class="suns">
                    <img class="icon" :src="Sun">
                </div>

                <div v-if="player.reward.points" class="points">
                    <span>{{ player.reward.points }}</span>
                    <img class="icon" :src="Points">
                </div>

         

                <div v-for="viking in player.reward.vikingsTaken" class="removeVikings">
                    <img class="icon" :src="NoVikings">
                </div>

            </div>
        </div>
        <p>
            
        </p>
        <button class="dialogButton blueButton" @click="props.closeDialog">
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

.points {
    transform: translateY(5px);
    display: grid;
    place-items: center;

    .icon {
        height: 42px;
    }
    span {
        font-size: 1.5rem;
        transform: translateY(2px);
        font-weight: bold;
        position: absolute;
    }
}

.removeVikings, .suns {
    transform: translateY(5px);
    .icon {
        height: 32px;
                transform: translateY(2px);
    }
}

.wrap {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
</style>
