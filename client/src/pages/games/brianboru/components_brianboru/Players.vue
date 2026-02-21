<script setup>
import Money from "@/assets/games/gameAssets/brianboru/money.png";
import Money5 from "@/assets/games/gameAssets/brianboru/money5.png";
import Points from "@/assets/games/gameAssets/brianboru/Points.png";
import Sun from "@/assets/games/gameAssets/brianboru/sun.png";
import FirstPlayer from "@/assets/games/gameAssets/brianboru/first_player.png";
import Vikings from "@/assets/games/gameAssets/brianboru/vikings.png";

const props = defineProps(["players"]);

const data = [
    {
        color: "#d72638",
        money: 2,
        points: 13,
        publicId: "XX",
        username: "SenseiW",
        vikings: 3,
    },
    {
        color: "#3b82f6",
        money: 2,
        points: 11,
        publicId: "XX",
        username: "ArekiS",
        vikings: 3,
    },
    {
        color: "#22c55e",
        money: 14,
        points: 12,
        publicId: "XX",
        username: "TDS",
        vikings: 3,
    },
    {
        color: "#9333ea",
        money: 6,
        points: 8,
        publicId: "XX",
        username: "Versus137",
        vikings: 3,
    },
    {
        color: "#f97316",
        money: 4,
        points: 10,
        publicId: "XX",
        username: "Thinkofistodo",
        vikings: 6,
    },
];

const smallCoinCount = (money) => money % 5;
const bigCoinCount = (money) => (money - (money % 5)) / 5;
</script>

<template>
    <div class="players">
        <div
            v-for="player in props.players"
            :key="player.publicId"
            class="player"
            :style="`--color: ${player.color}`"
        >
            <div class="info">
                <img
                v-if="player.firstPlayer"
                    :src="FirstPlayer"
                    class="icon firstPlayer"
                />
                <img
                    v-for="sun in player.suns"
                    :key="sun"
                    :src="Sun"
                    class="icon sun"
                />
                <div
                    class="username"
                   
                >
                    {{ player.username }}
                </div>

                <div class="points">
                    <img :src="Points" alt="" class="icon" />
                    <div class="count">{{ player.points }}</div>
                </div>
            </div>

            <div class="values">
                <div class="money">
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

                <div class="vikings">
                    <img
                        v-for="viking in player.vikings"
                        :key="viking"
                        :src="Vikings"
                        alt=""
                        class="icon"
                    />
                    <!-- <div class="count">{{ player.money }}</div> -->
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
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: #94c4ee63;
    font-family: "MedievalSharp";
    box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.358);
    // background-repeat: no-repeat;
    background-size: contain;
    // background-image: url(/src/assets/games/gameAssets/brianboru/podstawka2.jpg);
    // background-image: url("/src/assets/games/gameAssets/brianboru/brownTexture.png");

     background-color: #ffffff11;
    box-shadow: 2px 2px 10px 2px rgba(0, 0, 0, 0.314);
    // background-image:
    // linear-gradient(rgb(0, 0, 0)),
    // url("/src/assets/games/gameAssets/brianboru/background.webp");
    width: 325px;
}

.player {
    display: flex;
    align-items: end;
    flex-direction: column;
    justify-content: end;
    color: white;
    gap: 0.35rem;
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

.money,
.vikings {
    display: flex;
    gap: 0.15rem;

    .icon {
        height: 25px;
        width: 25px;
    }
}

.sun {
    align-self: center;
    height: 25px;
    width: 25px;
    transform: translateY(1.15px);
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
</style>
