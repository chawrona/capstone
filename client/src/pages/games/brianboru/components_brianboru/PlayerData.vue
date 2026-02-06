<script setup>
import { computed } from "vue";

const cardsData = [
    {
        bottom1: ["build", "money_plus", "money_plus"],
        bottom2: ["church", "church", "church"],
        id: 23,
        top: ["city", "money_minus", "money_minus"],
        type: "blue",
    },
    {
        bottom1: ["build", "money_plus", "money_plus"],
        bottom2: ["letter", "letter", "letter"],
        id: 24,
        top: ["city", "money_minus", "money_minus"],
        type: "red",
    },
    {
        bottom1: ["build", "money_plus", "money_plus"],
        bottom2: ["letter", "letter", "letter"],
        id: 19,
        top: ["city", "money_minus", "money_minus"],
        type: "yellow",
    },
    {
        type: null,
    },
    {
        bottom1: ["build", "money_plus", "money_plus"],
        bottom2: ["letter", "letter", "letter"],
        id: 17,
        top: ["city", "money_minus", "money_minus"],
        type: "gray",
    },
    {
        bottom1: ["build", "money_plus", "money_plus"],
        bottom2: ["axe", "axe", "axe"],
        id: 2,
        top: ["city", "money_minus", "money_minus"],
        type: "red",
    },
    {
        bottom1: ["build", "money_plus", "money_plus"],
        bottom2: ["letter", "letter", "letter"],
        id: 4,
        top: ["city", "money_minus", "money_minus"],
        type: "blue",
    },
];

const cards = computed(() => {
    return cardsData
        .filter((card) => card.type !== null)
        .sort((a, b) => b.id - a.id);
});
</script>

<template>
    <div class="playerData">
        <div class="cards">
            <div
                v-for="card in cards"
                :key="card.id"
                class="card"
                :type="card.type"
            >
                <!-- <div class="cardNumber">
                  
                </div> -->

                <div class="cardData">
                    <div class="top">
                        <span class="cardId">{{ card.id }}</span>
                        <div class="topIcons">
                            <span
                                v-for="(value, index) in card.top"
                                :key="index"
                            >
                                <img
                                    class="resource-image"
                                    :src="`/src/assets/games/gameAssets/brianboru/${value}.png`"
                                    alt=""
                                />
                            </span>
                        </div>
                    </div>

                    <div class="bottom">
                        <div class="bottom1">
                            <span
                                v-for="(value, index) in card.bottom1"
                                :key="index"
                            >
                                <img
                                    class="resource-image"
                                    :src="`/src/assets/games/gameAssets/brianboru/${value}.png`"
                                    alt=""
                                />
                            </span>
                        </div>
                        <div class="bottom2">
                            <span
                                v-for="(value, index) in card.bottom2"
                                :key="index"
                            >
                                <img
                                    class="resource-image"
                                    :src="`/src/assets/games/gameAssets/brianboru/${value}.png`"
                                    alt=""
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.playerData {
    font-family: "MedievalSharp";
    display: flex;
    width: 13.5%;
    background-color: rgba(255, 0, 0, 0.616);
    height: 100%;
}

.cards {
    width: 100%;
    flex-direction: column;
    align-items: center;
    background-color: rgba(0, 128, 0, 0.607);
    background-image: url("/src/assets/games/gameAssets/brianboru/brownTexture.png");
    display: flex;

    justify-content: space-evenly;
    height: 100%;
}

.card {
    display: flex;
box-shadow: 0px 0px 5px 4px rgba(0, 0, 0, 0.658);
    justify-content: space-between;
    height: 135px;
    width: 225px;
    border-radius: 0.25rem;
    overflow: hidden;

    &[type="red"] {
        background-color: rgb(222, 15, 15);
         background-image: url("/src/assets/games/gameAssets/brianboru/redCard.png");
        .cardNumber,
        .top {
            background-color: #5b080800;
            color: rgb(247, 160, 160);
        }

        .bottom1,
        .bottom2 {
            background-color: hsla(0, 66%, 40%, 0.443);
        }
    }
    &[type="blue"] {
        background-color: rgb(15, 108, 222);
        background-image: url("/src/assets/games/gameAssets/brianboru/blueCard.png");
        .cardNumber,
        .top {
            // background-color: #0f1f55;
            color: rgb(147, 172, 241);
        }
        .bottom1,
        .bottom2 {
            background-color: #2040aa5e;
        }
    }
    &[type="yellow"] {
        background-color: rgb(175, 153, 9);
         background-image: url("/src/assets/games/gameAssets/brianboru/yellowCard.png");
        .cardNumber,
        .top {
            // background-color: #615a06;
            color: rgb(246, 244, 142);
        }
        .bottom1,
        .bottom2 {
            background-color: #8a800e6b;
        }
    }
    &[type="gray"] {
        background-color: rgb(117, 117, 117);
         background-image: url("/src/assets/games/gameAssets/brianboru/grayCard.png");
        .cardNumber,
        .top {
            // background-color: #1e1e1e86;
            color: rgb(224, 224, 224);
        }
        .bottom1,
        .bottom2 {
            background-color: #5a5a5a6c;
        }
    }

    .cardData {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        width: 100%;
    }

    .cardNumber {
        width: 12.5%;
        display: grid;
        place-items: center;
        font-weight: bold;
        text-align: center;
        text-shadow: 0 0 5px 5px black;
    }
}

.top {
    height: 45px;
    display: flex;
    align-items: center;
    padding: 0.35rem;
    padding-bottom: 0;
    border-radius: 0.15rem;

    .resource-image {
        height: 30px;
    }

    .cardId {
        display: grid;
        place-items: center;
        font-size: bold;
        font-size: 1.5rem;
        width: 20%;
        font-weight: bold;
        color: white;
        transform: translateY(2px);
    }

    .topIcons {
        width: 80%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
    }
}

.bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    flex-grow: 1;
}

.bottom1,
.bottom2 {
    display: flex;
    justify-content: space-evenly;
    height: 35px;
    padding: 0.35rem;
    width: 90%;

    border-radius: 0.25rem;
}

.resource-image {
    height: 25px;
}
</style>
