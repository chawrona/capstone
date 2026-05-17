<script setup>
import Craftsman from "./Craftsman.vue";


const props = defineProps(["players"])


const players = [{
    player: {
        username: "Thinkofistodo",
        color: {
            hex: "#206bdb",
            name: "red"
        }
    },
    contracts: 3,
    craftsmen: 2,
},{
    player: {
        username: "SenseiW",
        color: {
            hex: "gold",
            name: "red"
        }
    },
    contracts: 6,
    craftsmen: 1,
},{
    player: {
        username: "Versus137",
        color: {
            hex: "green",
            name: "red"
        }
    },
    contracts: 8,
    craftsmen: 3,
},{
    player: {
        username: "ArekiS",
        color: {
            hex: "red",
            name: "red"
        }
    },
    contracts: 4,
    craftsmen: 1,
}]

</script>
<template>
<div class="players">
    <div class="player" v-for="(player, index) in players" :key="index">
        <div class="player-name">
            <h1>{{ player.player.username }}</h1>
            <Craftsman :color="player.player.color.hex" class="player-icon" v-for="(craftsmen, c) in player.craftsmen" :key="c" :clickable="true"/>
        </div>
        <div class="contracts">
            <div class="contract" v-for="(contact, i) in player.contracts" :key="i"/>
        </div>
    </div>

</div>
</template>

<style scoped lang="scss">
.players {
    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: center;

    gap: 0.75rem;
    padding-block: 1rem;
    position: absolute;
      top: 19rem;
    right: 1rem;
 
  
    color: rgb(0, 0, 0);
    height: 9rem;


    .player {
        display: flex;
        flex-direction: column;
        align-items: end;
        justify-content: center;
        gap: 0.25rem;

        &-name {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.8rem;
            color: #e3edfd; 
  
  /* 2. Odpowiednie pogrubienie fontu pomaga na wzorzystym tle */
  font-weight: 800; 

  /* 3. Wyraźny cień (Drop Shadow) */
  /* Składnia: przesunięcie-X | przesunięcie-Y | rozmycie | kolor */
  text-shadow: 2px 3px 3px rgba(0, 0, 0, 0.85);
          
        }

        &-icon {
            transform: translateY(1px);
            width: 1.8rem;
            height: 1.8rem;
           filter: drop-shadow( 0px 0px 2px rgba(0, 0, 0, 0.534));
        }

    }

    .contracts {
        display: flex;
        justify-content: end;
        gap: 0.3rem;
        transform: translateX(-2px);
    }

    .contract {
        width: 1.4rem;
        height: 2rem;
        background-color: white;
        box-shadow: 1px 1px 1px 0px rgba(51, 48, 48, 0.671);
        background-size: cover;
        background-position: center;
        background-image: url("/src/assets/games/gameAssets/craftsmen/board.png");
    }

}
</style>