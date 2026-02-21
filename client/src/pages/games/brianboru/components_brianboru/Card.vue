<script setup>
const props = defineProps(["card"]);
</script>

<template>
    <div :type="props.card.type" :class="['card', $attrs.class]">
        <div class="cardData">
            <div class="top">
                <span class="cardId">{{ props.card.id }}</span>
                <div class="topIcons">
                    <span v-for="(value, index) in props.card.top" :key="index">
                        <img
                            class="resource-image"
                            :src="`/src/assets/games/gameAssets/brianboru/${value}.png`"
                            alt=""
                        />
                    </span>
                </div>
            </div>

            <div class="bottom">
                <div
                    class="bottom1"
                    :class="{
                        singleBottom: props.card.bottom2.length === 0,
                    }"
                >
                    <span
                        v-for="(value, index) in props.card.bottom1"
                        :key="index"
                    >
                        <img
                            class="resource-image"
                            :src="`/src/assets/games/gameAssets/brianboru/${value}.png`"
                            alt=""
                        />
                    </span>
                </div>
                <div v-if="props.card.bottom2.length > 0" class="bottom2">
                    <span
                        v-for="(value, index) in props.card.bottom2"
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
</template>

<style scoped lang="scss">
.card {
    display: flex;
    box-shadow: 0px 0px 5px 4px rgba(0, 0, 0, 0.658);
    justify-content: space-between;
    // height: 135px;
    // width: 225px;
    height: 220px;
    width: 145px;
    border-radius: 0.25rem;
    overflow: hidden;
    flex-shrink: 0;

    &[type="red"] {
        background-color: rgb(138, 0, 0);
        // background-image: url("/src/assets/games/gameAssets/brianboru/redCard.png");
        .cardNumber,
        .top {
            background-color: #5b080800;
            color: rgb(247, 160, 160);
        }

        .bottom1,
        .bottom2, .topIcons {
            background-color: hsla(0, 84%, 17%, 0.443);
        }
    }
    &[type="blue"] {
        background-color: rgb(0, 64, 142);
        // background-image: url("/src/assets/games/gameAssets/brianboru/blueCard.png");
        .cardNumber,
        .top {
            color: rgb(147, 172, 241);
        }
        .bottom1,
        .bottom2, .topIcons {
            background-color: #0413455e;
        }
    }
    &[type="yellow"] {
        background-color: rgb(136, 118, 0);
        // background-image: url("/src/assets/games/gameAssets/brianboru/yellowCard.png");
        .cardNumber,
        .top {
            color: rgb(246, 244, 142);
        }
        .bottom1,
        .bottom2, .topIcons {
            background-color: #3d38046b;
            background-color: #3d38046b;
        }
    }
    &[type="gray"] {
        background-color: rgb(119, 119, 119);
        // background-image: url("/src/assets/games/gameAssets/brianboru/grayCard.png");
        .cardNumber,
        .top {
            // background-color: #1e1e1e86;
            color: rgb(224, 224, 224);
        }
        .bottom1,
        .bottom2, .topIcons {
            background-color: #5a5a5a6c;
        }
    }

    .cardData {
        display: flex;
        flex-direction: column;
    
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
    margin-top: auto;
    height: auto;
    gap: 0.5rem;
    padding-bottom: 0.5rem;
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

.singleBottom {
    align-items: center;
    height: 70px;
}

.resource-image {
    height: 25px;
}
</style>
