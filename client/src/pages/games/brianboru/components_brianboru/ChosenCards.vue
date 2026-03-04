<script setup>
import { computed } from "vue";

import statuses from "../../../../../../server/models/games/brianboru/config/statuses";
import { useAppStore } from "../../../../store/useAppStore";
import Card from "./Card.vue";

const props = defineProps(["chosenCards", "you", "status"]);
const store = useAppStore();

const canChoose = computed(() => {
    return props.status === statuses.CHOOSE_CARD_EFFECT;
});

const canChooseHover = (player) => {
    return canChoose.value && player.username === props.you.username;
};

const chooseCardEffect = () => {
    if (!canChoose.value) return alert("Can't");

    store.emit("gameData", {
        data: "",
        eventName: "chooseCardEffect",
    });
};
</script>

<template>
    <!-- <pre>
        {{ props.chosenCards }}
    </pre> -->
    <div class="chosenCards">
        <div
            v-for="[card, player] in props.chosenCards"
            class="wrap"
            :style="`--color: ${player.color.hex};`"
            :data-type="card.type"
            @click="chooseCardEffect(card, player)"
        >
            <Card
                :key="card.id"
                :card="card"
                :can-choose="canChooseHover(player)"
                class="chosenCard"
                :owner="player"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.wrap {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
}

.chosenCards {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    // background-color: rgba(255, 0, 0, 0.404);
    position: absolute;
    top: 8rem;
    height: 80%;
    justify-content: start;
    align-content: start;
    align-items: start;

    width: 350px;

    transform: scale(0.9);
    gap: 1rem;
    left: 8%;
    padding-bottom: 0.5rem;
}

[data-type="red"] .username {
    background-color: rgb(138, 0, 0);
}

[data-type="blue"] .username {
    background-color: rgb(0, 64, 142);
}

[data-type="yellow"] .username {
    background-color: rgb(136, 118, 0);
}

[data-type="gray"] .username {
    background-color: rgb(119, 119, 119);
}

.username {
    z-index: 2;
    //  height: 220px;
    //  width: 1.2rem;
    width: 145px;
    box-shadow: 0px 4px 4px 3px rgba(0, 0, 0, 0.658);
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    display: block;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 0.1px;
    margin-inline: auto;
    text-align: center;
    display: block;
    padding: 0.25rem 0.5rem;
    // text-orientation: sideways;
    //  writing-mode: sideways-lr;
    color: white;
}
</style>
