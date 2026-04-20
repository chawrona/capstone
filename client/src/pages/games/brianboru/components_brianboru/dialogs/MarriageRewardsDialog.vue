<script setup>
import { computed } from "vue";

import Letter from "@/assets/games/gameAssets/brianboru/letter.png";
import MoneyDouble from "@/assets/games/gameAssets/brianboru/money_double_plus.png";
import Money from "@/assets/games/gameAssets/brianboru/money_plus.png";
import Points from "@/assets/games/gameAssets/brianboru/points.png";
import Sun from "@/assets/games/gameAssets/brianboru/sun.png";
import City from "@/assets/games/gameAssets/brianboru/triquetra.png";

import PlayerIcon from "../PlayerIcon.vue";

const props = defineProps(["marriageDialogInfo", "closeDialog"]);

const rewards = ["money", "doubleMoney", "sun", "city"];

const fiancee = computed(() => {
    return props.marriageDialogInfo[0].fiancee;
});
</script>

<template>
    <div class="dialog">
        <h1 class="dialogTitle">Odbyły się zaślubiny</h1>

        <div class="dialogContent">
            <span class="mainReward">
                <p>
                    Gracz
                    <PlayerIcon
                        :player="props.marriageDialogInfo[0].player"
                        :player-color="white"
                    />
                    poślubił <b>{{ fiancee.name }}</b>
                    <img class="rewardIcon letter" :src="Letter" />
                </p>
            </span>

            <div class="rewardsContainer">
                <br />
                <p class="info">Otrzymane nagrody:</p>
                <div class="flex">
                    <div
                        v-for="(player, i) in props.marriageDialogInfo"
                        :key="i"
                        class="wrapper"
                    >
                        <PlayerIcon
                            :player="player.player"
                            :player-color="white"
                        />
                        <div
                            v-if="
                                player.reward === 'winner' &&
                                fiancee.region !== 'Vikings'
                            "
                            class="winnerRewards"
                        >
                            <img
                                v-for="sun in fiancee.suns"
                                :key="sun"
                                class="rewardIcon"
                                :src="Money"
                            />

                            <div v-if="fiancee.points" class="points">
                                <span>{{ fiancee.points }}</span>
                                <img class="rewardIcon" :src="Points" />
                            </div>

                            <div v-if="fiancee.region" class="winnerRegion">
                                <b
                                    ><i>{{ fiancee.region }}</i></b
                                >
                                <img class="City rewardIcon" :src="City" />
                            </div>
                        </div>
                        <div
                            v-if="
                                player.reward === 'winner' &&
                                fiancee.region === 'Vikings'
                            "
                            class="help"
                        >
                            <i><b>Wsparcie Wojskowe/Regionalne</b></i>
                        </div>

                        <div v-if="player.reward === ''" class="figa">
                            Figa z makiem
                        </div>

                        <img
                            v-if="player.reward === 'money'"
                            class="rewardIcon"
                            :src="Money"
                        />
                        <img
                            v-if="player.reward === 'doubleMoney'"
                            class="rewardIcon"
                            :src="MoneyDouble"
                        />
                        <img
                            v-if="player.reward === 'sun'"
                            class="rewardIcon"
                            :src="Sun"
                        />
                        <img
                            v-if="player.reward === 'city'"
                            class="rewardIcon"
                            :src="City"
                        />
                    </div>
                </div>
            </div>
        </div>

        <button class="dialogButton blueButton" @click="props.closeDialog">
            Dalej
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

    min-height: 300px;
    width: 700px;
    justify-content: space-between;
    padding: 2rem 1rem;
    box-shadow: 0px 2px 5px 3px rgba(0, 0, 0, 0.685);

    .dialogTitle {
        letter-spacing: 1px;
        font-size: 2rem;
    }

    .dialogContent {
        font-size: 1rem;
        margin-bottom: 1.5rem;
        width: 90%;
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

    .rewardsContainer {
        width: 100%;
        margin-top: 1rem;
    }

    .flex {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0 1rem;
        justify-content: start;
    }

    .wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .rewardIcon {
        height: 48px;
        transform: translateY(7px);
        display: inline-block;
    }

    .mainReward {
        text-align: center;
        font-size: 1.2rem;
    }

    .letter {
        height: 35px;
        transform: translateY(12px);
    }

    .help {
        align-self: flex-end;
        font-size: 1.1rem;
    }

    .points {
        position: relative;
        height: 48px;
        transform: translateY(4.5px);
        width: 48px;

        img {
            transform: none;
        }

        span {
            position: absolute;
            top: 50%;
            left: 50%;
            font-size: 1.3rem;
            font-weight: bold;
            transform: translate(-60%, -40%);
        }
    }

    .winnerRewards {
        display: flex;
        gap: 0.2rem;
        margin-left: 0.5rem;
        font-display: row;
        align-items: center;
    }

    .winnerRegion {
        height: 48px;
        gap: 0.5rem;
        flex-direction: column-reverse;
        display: flex;
        align-items: center;
        transform: translateY(40%);
    }

    .info {
        margin-bottom: 0.5rem;
    }
}

.figa {
    font-weight: bold;
    font-size: 1.2rem;
    transform: translateY(7px);
    font-style: italic;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.74);
}
</style>
