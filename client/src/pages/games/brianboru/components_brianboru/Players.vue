<script setup>
import FirstPlayer from "@/assets/games/gameAssets/brianboru/first_player.png";
import Money from "@/assets/games/gameAssets/brianboru/money.png";
import Money5 from "@/assets/games/gameAssets/brianboru/money5.png";
import Points from "@/assets/games/gameAssets/brianboru/Points.png";
import Sun from "@/assets/games/gameAssets/brianboru/sun.png";
import Vikings from "@/assets/games/gameAssets/brianboru/vikings.png";

const props = defineProps(["players", "you"]);

const data = [
    {
        color: "#d72638",
        color: { hex: "#d72638" },
        money: 2,
        points: 13,
        publicId: "XX",
        suns: 2,
        username: "SenseiW",
        vikings: 3,
    },
    {
        color: "#3b82f6",
        color: { hex: "#3b82f6" },
        firstPlayer: true,
        money: 2,
        points: 11,
        publicId: "XX",
        suns: 3,
        username: "ArekiS",
        vikings: 3,
    },
    {
        color: "#22c55e",
        color: { hex: "#22c55e" },
        money: 14,
        points: 12,
        publicId: "XX",
        suns: 1,
        username: "TDS",
        vikings: 3,
    },
    {
        color: { hex: "#9333ea" },
        money: 6,
        points: 8,
        publicId: "XX",
        suns: 2,
        username: "Versus137",
        vikings: 3,
    },
    {
        color: "#f97316",
        color: { hex: "#f97316" },
        money: 4,
        points: 10,
        publicId: "XX",
        suns: 3,
        username: "Dawid",
        vikings: 6,
        you: true,
    },
];

const smallCoinCount = (money) => money % 5;
const bigCoinCount = (money) => (money - (money % 5)) / 5;

const sortPlayers = (playerA, playerB) => {
    if (playerA.username === props.you.username) return 1;
    if (playerB.username === props.you.username) return -1;
    return 0;
};
</script>

<template>
    <div class="players">
        <!--  eslint-disable-next-line -->
        <div v-for="player in props.players.sort(sortPlayers)"
            :key="player.publicId"
            class="player"
            :class="{ you: player.username === props.you.username }"
            :style="`--color: ${player.color.hex}`"
        >
            <div class="info">
                <img
                    v-if="player.firstPlayer"
                    :src="FirstPlayer"
                    class="icon firstPlayer"
                />

                <div class="username">
                    <span
                        :style="`${player.username === props.you.username ? 'color: gold;' : ''}`"
                    >
                        {{
                            player.username === props.you.username ? "(Ty)" : ""
                        }}</span
                    >
                    {{ player.username }}
                </div>

                <div class="points">
                    <div class="playerColor">
                        <div class="count">{{ player.points }}</div>
                    </div>
                </div>
            </div>

            <div class="values">
                <div class="money">
                    <img
                        v-for="sun in smallCoinCount(player.suns)"
                        :key="sun"
                        :src="Sun"
                        class="icon sun"
                    />

                    <img
                        v-for="money in smallCoinCount(player.money)"
                        :key="money"
                        :src="Money"
                        class="icon"
                    />

                    <img
                        v-for="money in bigCoinCount(player.money)"
                        :key="money"
                        :src="Money5"
                        class="icon"
                    />

                    <!-- <div class="count">{{ player.vikings }}</div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.players {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.5rem 1rem;
    padding-right: 0.5rem;
    display: flex;

    flex-direction: column;
    gap: 1rem;
    border-radius: 0.15rem;
    overflow: hidden;
    // background-color: #94c4ee63;
    font-family: "MedievalSharp";

    background-size: contain;

    // box-shadow: rgba(0, 0, 0, 0.853) 0px 0px 5px; // TEN JEST AKTUALNY
    height: calc(650px - 1rem);
    width: 355px;
}

.player {
    display: flex;
    align-items: end;
    flex-direction: column;
    justify-content: end;
    color: white;
    font-weight: bold;
    text-shadow: 1px 2px 1px rgba(0, 0, 0, 0.815);
    gap: 0.8rem;
}

.you {
    margin-top: auto;

    .info {
        align-items: center;
    }

    .username {
        font-size: 1.5rem;
        transform: translateY(3px);
    }

    .money .icon {
        width: 30px;
        height: 30px;
    }
}

.vikings {
    margin-left: 0.2rem;
}

.vikings,
.money,
.points {
    display: grid;
    place-items: center;
    position: relative;
}

.vikings,
.money,
.suns {
    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.589));
}

.points {
    margin-left: 0.5rem;
}

.money {
    display: flex;
    gap: 0.15rem;

    .icon {
        height: 20px;
        width: 20px;
    }
}

.sun {
    filter: drop-shadow(0 0 3px rgb(31, 20, 1));
}

.firstPlayer {
    height: 25px;
    width: 25px;
    transform: translateY(1.5px);
    align-self: center;
}

.values,
.info {
    display: flex;
    justify-content: end;
    align-items: center;
}

.info {
    color: hsl(from var(--color) h s calc(l * 0.5));
    color: white;
    align-items: start;
    gap: 0.5rem;
    justify-content: end;
}

.points .icon {
    height: 35px;
    width: 35px;
    filter: brightness(0.9);
}

.count {
    position: absolute;
    text-shadow: 0 0 6px black;
    color: white;
    font-weight: bold;
    font-size: 1rem;
}

.points .count {
    transform: translate(0.5px, 2px);
}

.username {
    transform: translateY(9px);
    font-size: 1.25rem;
}

.firstPlayer {
    font-weight: bold;
    letter-spacing: 0.5px;
    color: rgb(255, 255, 255);
}

.playerColor {
    position: relative;
    display: grid;
    place-items: center;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.349);
    background-color: hsl(from var(--color) h s calc(l * 1));
    box-shadow:
        inset 0 1.5px 3px rgba(255, 255, 255, 0.576),
        /* highlight góry */ inset 0 -3px 5px rgba(0, 0, 0, 0.247),
        0 2px 3px rgba(0, 0, 0, 0.308);

    &::after {
        position: absolute;
        content: "";
        inset: -0.5rem;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url("/src/assets/games/gameAssets/brianboru/Points.png");
        filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.589));
    }
}

.divider {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    margin-left: 0.5rem;
    gap: 0.2rem;
}
</style>
