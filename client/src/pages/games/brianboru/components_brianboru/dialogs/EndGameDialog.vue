<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import FirstPlayer from "@/assets/games/gameAssets/brianboru/first_player_icon.png";
import MapIcon from "@/assets/games/gameAssets/brianboru/map_icon.png";
import RedCity from "@/assets/games/gameAssets/brianboru/miasto_red.png";
import Money from "@/assets/games/gameAssets/brianboru/money.png";
import Money5 from "@/assets/games/gameAssets/brianboru/money5.png";
import Points from "@/assets/games/gameAssets/brianboru/points.png";
import SunBig from "@/assets/games/gameAssets/brianboru/sun_big.png";
import Sun from "@/assets/games/gameAssets/brianboru/sun.png";
import City from "@/assets/games/gameAssets/brianboru/triquetra.png";

import { useAppStore } from "../../../../../store/useAppStore";
import PlayerIcon from "../PlayerIcon.vue";

const props = defineProps(["endData", "lobbyId"]);
const store = useAppStore();
const router = useRouter();
const route = useRoute();

const goBackToLobby = () => {
    store.setLoading(true);
    setTimeout(() => {
        router.push(`/${props.lobbyId}`);
    }, 1000);
};

const smallCoinCount = (money) => money % 5;
const bigCoinCount = (money) => (money - (money % 5)) / 5;

const hideDialog = ref(false);
</script>

<template>
    <div
        class="dialog"
        :style="`--users: ${endData[0].length}`"
        :class="{ hide: hideDialog }"
    >
        <button
            class="blueButton toggleButton"
            @click="() => (hideDialog = !hideDialog)"
        >
            {{ hideDialog ? "Ukryj" : "Pokaż" }} Dialog
        </button>
        <h1 class="dialogTitle">Podsumowanie gry</h1>

        <div class="dialogContent">
            <div class="table">
                <div>
                    <div class="wrap first">
                        <div>Punktacja</div>
                    </div>

                    <div class="container first">
                        <div v-for="(player, index) in endData[0]" :key="index">
                            <PlayerIcon :player="player" class="playerIcon" />
                        </div>
                    </div>
                </div>
                <div>
                    <div class="wrap">
                        <div>
                            <img :src="Points" />
                        </div>
                        <div><b>Aktualne punkty</b></div>
                    </div>

                    <div class="container">
                        <div v-for="(points, index) in endData[1]" :key="index">
                            {{ points }}
                        </div>
                    </div>
                </div>
                <div>
                    <div class="wrap">
                        <div>
                            <img :src="Money" />
                        </div>
                        <div>Pieniądze graczy</div>
                    </div>

                    <div class="container">
                        <div
                            v-for="(money, index) in endData[2]"
                            :key="index"
                            class="money-wrap"
                        >
                            <div
                                v-for="(sun, i) in bigCoinCount(money)"
                                :key="i"
                            >
                                <img :src="Money5" />
                            </div>
                            <div
                                v-for="(sun, i) in smallCoinCount(money)"
                                :key="i"
                            >
                                <img :src="Money" />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="wrap">
                        <div>
                            <img :src="FirstPlayer" />
                        </div>
                        <div>Wskaźnik pierwszego gracza</div>
                    </div>
                    <div class="container">
                        <div
                            v-for="(firstPlayer, index) in endData[3]"
                            :key="index"
                        >
                            <img v-if="firstPlayer" :src="FirstPlayer" />
                        </div>
                    </div>
                </div>
                <div>
                    <div class="wrap">
                        <div>
                            <img :src="Sun" />
                        </div>
                        <div>Poważanie</div>
                    </div>
                    <div class="container">
                        <div
                            v-for="(suns, index) in endData[4]"
                            :key="index"
                            class="sun-wrap"
                        >
                            <div
                                v-for="(sun, i) in bigCoinCount(suns)"
                                :key="i"
                            >
                                <img :src="SunBig" />
                            </div>
                            <div
                                v-for="(sun, i) in smallCoinCount(suns)"
                                :key="i"
                            >
                                <img :src="Sun" />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="wrap">
                        <div>
                            <img :src="MapIcon" />
                        </div>
                        <div>Władza w regionach</div>
                    </div>
                    <div class="container">
                        <div
                            v-for="(regions, index) in endData[5]"
                            :key="index"
                        >
                            <span
                                v-for="(region, i) in regions"
                                :key="i"
                                class="region-wrap"
                            >
                                <span class="region"
                                    >{{ region[0] }} - {{ region[1] }}</span
                                >
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="wrap">
                        <div>
                            <img :src="RedCity" />
                        </div>
                        <div>Obecność w regionach</div>
                    </div>
                    <div class="container">
                        <div
                            v-for="(presence, index) in endData[6]"
                            :key="index"
                        >
                            <span
                                v-for="(region, i) in presence[1]"
                                :key="i"
                                class="region-wrap"
                            >
                                <span class="region">{{ region }} </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="wrap">
                        <div>
                            <img :src="Points" />
                        </div>
                        <div><b>Podsumowanie</b></div>
                    </div>
                    <div class="container">
                        <div
                            v-for="(points, index) in endData[7]"
                            :key="index"
                            class="points"
                        >
                            <span class="total">{{ points }}</span>
                            <img :src="Points" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <button class="dialogButton blueButton" @click="goBackToLobby">
            Powrót do lobby
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
    transform: translate(-50%, -50%);

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
    gap: 1.5rem;

    min-height: 600px;
    min-width: calc(750px + 150px * var(--users));
    justify-content: space-between;
    padding: 1.5rem 1rem;
    box-shadow: 0px 2px 5px 3px rgba(0, 0, 0, 0.685);

    .dialogTitle {
        letter-spacing: 1px;
        font-size: 3rem;
    }

    .dialogContent {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        text-align: center;
        width: 100%;
    }
}

.table {
    min-width: 95%;

    margin-inline: auto;
    border-radius: 0.25rem;
    background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_black.webp");
    background-size: cover;
    padding: 1rem;
    padding-bottom: 1.2rem;
    font-size: 1.5rem;
    background-position: center;

    overflow: hidden;

    display: flex;
    flex-direction: column;

    line-height: normal;
    box-shadow: 1px 1px 5px 3px rgba(0, 0, 0, 0.658);

    img {
        width: 32px;
        filter: drop-shadow(1px 1px 2px rgba(33, 36, 1, 0.252));
    }
}

.table > div {
    display: flex;
    padding: 0.5rem;
    padding-left: 0.5rem;

    &:nth-of-type(2n) {
        background-color: rgba(139, 139, 139, 0.158);
        border-radius: 0.15rem;
    }
}

.table > div:first-of-type {
    height: 45px;
    margin-bottom: 0.5rem;
}

.table .wrap {
    display: flex;
    align-items: center;

    margin-bottom: 0;
    width: 350px;
    font-size: 1.2rem;
    flex-shrink: 0;
    gap: 1rem;

    & > div:first-of-type {
        width: 32px;
    }
}

.table .container {
    display: flex;
    width: 100%;
    align-items: center;

    & > div {
        width: calc(100% / var(--users));
        text-align: center;
        place-items: center;
    }
}

.table img.city {
    width: 60px;
}

.table .first {
    font-weight: bold;
    font-size: 1.5rem;
}

.playerIcon {
    display: block;
    transform: translateY(-8px);
}

.total {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-45%, -38%);
    font-size: 1.5rem;
    color: gold;
    font-weight: bold;
}

.points {
    position: relative;
    img {
        width: 60px;
    }
}

.sun-wrap,
.money-wrap {
    display: flex;
    justify-content: center;
    gap: 0.3rem;
    img {
        width: 28px;
    }
}

.region-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}
.region {
    font-size: 1.1rem;
}

.toggleButton {
    position: absolute;
    right: 1rem;
    top: 1rem;
    padding-inline: 1rem;
    padding-block: 0;
    font-size: 0.7rem;
    opacity: 1;
    width: 110px;
    text-align: center;

    &.show {
        opacity: 0.5;
    }
}

.hide {
    background-image: none;
    box-shadow: none;
    & > *:not(.toggleButton) {
        opacity: 0;
    }

    .toggleButton {
        top: -10.035rem;
        right: -3rem;
    }
}
</style>
