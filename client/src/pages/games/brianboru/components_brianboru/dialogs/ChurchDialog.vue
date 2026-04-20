<script setup>
const props = defineProps(["churchDialogInfo", "closeDialog"]);
import { computed } from "vue";

import Church from "@/assets/games/gameAssets/brianboru/no_church.png";
import Points from "@/assets/games/gameAssets/brianboru/points.png";

import PlayerIcon from "../PlayerIcon.vue";
import CathedraIcon from "../svgs/CathedraIcon.vue";

const rewardsAvailable = computed(() => {
    return (
        props.churchDialogInfo.includes("Brak ludzi w kościele") ||
        props.churchDialogInfo.length === 0
    );
});
</script>

<template>
    <div class="dialog">
        <h2 class="dialogTitle">
            {{
                rewardsAvailable
                    ? "Wiara w kraju słabnie"
                    : "Chrześcijańskie wpływy"
            }}
        </h2>

        <div class="dialogContent">
            <div v-if="rewardsAvailable">
                <p class="noone">Nikt nie został znaleziony w Kościele.</p>
            </div>
            <div v-else>
                <p>
                    Działania w Kościele przynoszą uznanie. <br />Czujecie
                    przypływ władzy duchowej i prestiżu.
                </p>
                <div
                    class="container"
                    :style="`justify-content: ${2 < 3 ? 'center' : 'start'}`"
                >
                    <div
                        v-for="(player, index) in props.churchDialogInfo"
                        :key="index"
                        class="wrapper"
                    >
                        <PlayerIcon
                            :player="player.player"
                            :player-color="white"
                            class="icon"
                        />

                        <div v-if="player.reward.points" class="points">
                            <span>
                                {{ player.reward.points }}
                            </span>
                            <img class="rewardIcon" :src="Points" />
                        </div>

                        <div v-if="player.reward.church" class="church">
                            <img
                                v-for="i in player.reward.church * -1"
                                :key="i"
                                class="rewardIcon"
                                :src="Church"
                            />
                        </div>
                        <div
                            v-if="player.reward.cathedral"
                            class="cathedra-container"
                        >
                            <!-- <img class="rewardIcon cathedra" :src="Cathedra"> -->
                            <CathedraIcon class="cathedraIcon" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 
        name
        {
        church: int
        cathedral: true
        points: int
        }
        
        
        -->

        <!-- {{
        
        props.churchDialogInfo.map((el) => [
            el.player.username,
            el.reward,
        ])
    }} -->

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
    z-index: 30;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.74);
    min-height: 300px;
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
    }

    .dialogTitle {
        margin-bottom: 0;
        letter-spacing: 1px;
        font-size: 2rem;
    }
}

.points {
    position: relative;
    height: 48px;
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

.rewardIcon {
    height: 32px;
    transform: translateY(7px);
    display: inline-block;
    filter: drop-shadow(0px 0px 1px rgb(20, 20, 20));
}

.wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0rem;
    flex-shrink: 0;
}

.container {
    display: flex;
    gap: 0 1rem;
    flex-wrap: wrap;
}

.church {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.1rem;
    font-family: sans-serif;

    .rewardIcon {
        transform: translateY(3px);
    }
}

.points {
    .rewardIcon {
        height: 40px;
        transform: translateY(7px);
    }
    span {
        transform: translate(-60%, -28%);
    }
}

.cathedra {
    border: 1px solid black;
}
.icon {
    margin-right: 0.25rem;
}

.cathedra-container {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgb(5, 3, 104);
    transform: translateY(4px);

    border: 1px solid rgba(0, 0, 0, 0.349);
    box-shadow:
        inset 0 1.5px 3px rgba(97, 120, 253, 0.699),
        inset 0 -3px 5px rgba(0, 0, 0, 0.247),
        0 2px 3px rgba(0, 0, 0, 0.308);
}

.cathedraIcon {
    width: 24px;
    height: 24px;
    transform: translateY(-2px);
}

.noone {
    font-size: 1.3rem;
}
</style>
