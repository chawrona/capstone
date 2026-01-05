<script setup>
import Timer from "@/assets/games/gameAssets/eurobusiness/timer.png";

import { usePageSounds } from "../../../../composables/usePageSounds";
import actions from "../actions/actions";
const props = defineProps([
    "currentMessage",
    "playersData",
    "time",
    "endTurn",
    "payTax",
    "payIncomeTax",
    "availableActions",
    "yourTurn",
    "refuseToBuyBuilding",
    "buyBuilding",
    "payJail",
    "payRent",
]);

usePageSounds({
    effects: [
        { name: "endTurn", poolSize: 3, url: "/sounds/endTurn.mp3" },
        { name: "pay", url: "/sounds/pay.mp3" },
        { name: "turn", url: "/sounds/turn.mp3" },
    ],
});

const replaceLogMessage = (message) => {
    const players = props.playersData.map((player) => [
        player.username,
        player.color.hex,
    ]);

    for (const player of players) {
        message = message.replace(
            player[0],
            `<span style="font-weight: bold; color: ${player[1]}">${player[0]}</span><br>`,
        );
    }

    return message;
};
</script>

<template>
    <div class="current-message" :class="{ yourTurn: props.yourTurn }">
        <h2 class="panel-title">Aktualna akcja:</h2>
        <!-- <h2 class="panel-title">{{ availableActions }}</h2> -->
        <h2 class="timer">
            <img :src="Timer" class="icon" />
            <span class="time">{{
                props.time < 10 ? "00:0" + props.time : "00:" + props.time
            }}</span>
        </h2>
        <h1 class="message" v-html="replaceLogMessage(props.currentMessage)" />
        <button
            v-if="availableActions.includes(actions.endTurn) && yourTurn"
            class="eurobusiness-button"
            @click="endTurn"
        >
            Zakończ turę
        </button>
        <button
            v-if="availableActions.includes(actions.payTax) && yourTurn"
            class="eurobusiness-button tax-button"
            @click="payTax"
        >
            Opłać warunek 75$
        </button>
        <button
            v-if="availableActions.includes(actions.payIncomeTax) && yourTurn"
            class="eurobusiness-button incomeTax-button"
            @click="payIncomeTax"
        >
            Zapłać czesne 150$
        </button>
        <button
            v-if="availableActions.includes(actions.payJail) && yourTurn"
            class="eurobusiness-button jail-button"
            @click="payJail"
        >
            Przekup prowadzącego (200$)
        </button>
        <div>
            <button
                v-if="
                    availableActions.includes(actions.buyBuilding) && yourTurn
                "
                class="eurobusiness-button buy-button"
                @click="buyBuilding"
            >
                Kup pole
            </button>
            <button
                v-if="
                    availableActions.includes(actions.refuseToBuyBuilding) &&
                    yourTurn
                "
                class="eurobusiness-button auction-button"
                @click="refuseToBuyBuilding"
            >
                Licytacja
            </button>
            <button
                v-if="availableActions.includes(actions.payRent) && yourTurn"
                class="eurobusiness-button payRent-button"
                @click="payRent"
            >
                Zapłać czynsz
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.current-message {
    position: relative;
    height: 235px;
    width: 100%;
    border-radius: 0.25rem;
    background: linear-gradient(180deg, #fcfaf5, #e2d7c4);
    padding: 1.5rem 1.15rem;
    padding-top: 0.25rem;

    font-family: "Open Sans";
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &.yourTurn {
        background: linear-gradient(
            180deg,
            hsl(41, 93%, 88%),
            hsl(38, 84%, 83%)
        );
    }
}

.message {
    font-size: 1.75rem;
    text-align: center;
}

.panel-title {
    position: absolute;
    top: 1.15rem;
    left: 1.15rem;
    font-weight: normal;
    font-size: 1.15rem;
    color: #111111;
}

.timer {
    position: absolute;
    bottom: 1rem;
    right: 1.15rem;
    color: #111111;
    font-weight: 500;
    font-size: 1.5rem;
    width: 100px;

    display: flex;
    gap: 0.35rem;

    align-items: center;
    justify-content: end;

    .icon {
        width: 20px;
        transform: translateY(1px);
    }
}

.eurobusiness-button {
    position: absolute;
    bottom: 0.75rem;
    left: 1rem;
}

.buy-button {
    background-color: #138b03;
    &:hover {
        background-color: #1da10b;
    }
}

.auction-button {
    left: 135px;
    background-color: #d30303;
    &:hover {
        background-color: #f02f2f;
    }
}

.incomeTax-button,
.tax-button,
.payRent-button,
.jail-button {
    background-color: #504e5a;
    &:hover {
        background-color: #3a3841;
    }
}
</style>

<style>
.eurobusiness-button {
    border-radius: 0.5rem;
    padding: 0.75rem 1.15rem;
    background-color: #f06800;
    color: white;
    font-weight: bold;
    border: none;
    font-family: "Open sans";
    font-size: 1rem;
    cursor: pointer;

    &:hover {
        background-color: #c55500;
    }
}
</style>
