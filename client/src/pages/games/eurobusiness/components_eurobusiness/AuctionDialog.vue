<script setup>
import { computed } from "vue";

import Bid from "./Bid.vue";
import Card from "./Card.vue";

const props = defineProps(["auction", "bid", "playersData", "currentPlayer"]);

const auctioneerColor = computed(() => {
    console.log(props.playersData);
    console.log(props.auction);

    const player = props.playersData.find(
        (player) => player.publicId === props.auction?.cannotBid,
    );

    // ✅ Zwróć domyślny kolor jeśli nie znajdzie gracza
    console.log(player);

    return player?.color?.hex || "#000000";
});
</script>

<template>
    <div class="dialog">
        <div class="container">
            <div class="auction-info">
                <h2 class="question">Licytacja</h2>
                <p>
                    Prowadzi:
                    <span
                        class="auctioneer"
                        :style="`color: ${auctioneerColor}`"
                    >
                        {{ auction.cannotBidPlayerName }}
                    </span>
                </p>
                <p class="winning-player-info">
                    <span v-if="auction.winningPlayer">
                        Obecny lider:
                        <span
                            class="winningPlayer"
                            :style="`color: ${auction.winningPlayer?.color.hex}`"
                        >
                            {{ auction.winningPlayer?.username }}
                        </span>
                    </span>
                    <span v-else>Nikt jeszcze nie licytował</span>
                </p>
                <p>
                    Aktualna kwota:
                    <span class="current-price">
                        {{ auction.price }}<span class="dolar">$</span>
                    </span>
                </p>
            </div>

            <Card :property-card="auction.tile" :players-data="playersData" />
        </div>

        <div class="bids">
            <Bid
                :bid="props.bid"
                :auction-price="auction.price"
                :bid-increment="5"
                :current-player="props.currentPlayer"
                :cannot-bid="auction.cannotBid"
            />
            <Bid
                :bid="props.bid"
                :auction-price="auction.price"
                :bid-increment="10"
                :current-player="props.currentPlayer"
                :cannot-bid="auction.cannotBid"
            />
            <Bid
                :bid="props.bid"
                :auction-price="auction.price"
                :bid-increment="20"
                :current-player="props.currentPlayer"
                :cannot-bid="auction.cannotBid"
            />
            <Bid
                :bid="props.bid"
                :auction-price="auction.price"
                :bid-increment="50"
                :current-player="props.currentPlayer"
                :cannot-bid="auction.cannotBid"
            />
            <Bid
                :bid="props.bid"
                :auction-price="auction.price"
                :bid-increment="100"
                :current-player="props.currentPlayer"
                :cannot-bid="auction.cannotBid"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.dialog {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    gap: 1rem;

    font-family: "Open Sans", sans-serif;
    font-size: 1.5rem;
    color: black;
    padding: 2rem 2rem;

    border: 4px solid #40a2e4;
    border-radius: 0.5rem;
    outline: 6px solid #ffffff;

    background: linear-gradient(
        142deg,
        rgb(255, 255, 255) 0%,
        rgb(255, 255, 255) 100%
    );
    box-shadow:
        rgba(0, 0, 0, 0.35) 0px 20px 40px,
        rgba(0, 0, 0, 0.32) 0px 12px 12px;

    .question {
        font-size: 2.25rem;
        margin-bottom: 0.25rem;
    }

    .container {
        width: 100%;
        display: flex;
        gap: 2rem;
        text-align: left;
        justify-content: space-between;
    }

    .auction-info {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    p {
        font-size: 1.3rem;
    }

    .winningPlayer,
    .auctioneer,
    .current-price {
        font-size: 1.6rem;
        font-weight: bold;
    }
}

.bids {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 0.75rem;
}

.dolar {
    color: green;
    font-weight: bold;
}
</style>
