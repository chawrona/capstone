<script setup>
import { ref } from "vue";
import Church from "./Church.vue";
import Island from "./Island.vue";
import Marriage from "./Marriage.vue";
import Players from "./Players.vue";
import Vikings from "./Vikings.vue";
import Points from "./Points.vue";
import Regions from "./Regions.vue";

const props = defineProps([
    "currentVikings",
    "marriages",
    "players",
    "church",
    "marriage",
    "you",
    "regions"
]);


const buildings = ref([
  // Farmland (Pola) - pierwsze 5 kliknięć
  { id: 3, name: 'Pole uprawne 1', src: "/src/assets/games/gameAssets/brianboru/farmland.gif", x: 657, y: 642 },
  { id: 4, name: 'Pole uprawne 2', src: "/src/assets/games/gameAssets/brianboru/farmland.gif", x: 675, y: 657 },
  { id: 5, name: 'Pole uprawne 3', src: "/src/assets/games/gameAssets/brianboru/farmland.gif", x: 651, y: 665 },
  { id: 6, name: 'Pole uprawne 4', src: "/src/assets/games/gameAssets/brianboru/farmland.gif", x: 800, y: 731 },
  { id: 7, name: 'Pole uprawne 5', src: "/src/assets/games/gameAssets/brianboru/farmland.gif", x: 822, y: 748 },

  // Mill (Młyny) - kolejne 3 kliknięcia
  { id: 8, name: 'Młyn 1', src: "/src/assets/games/gameAssets/brianboru/mill.gif", x: 690, y: 615 },
  { id: 9, name: 'Młyn 2', src: "/src/assets/games/gameAssets/brianboru/mill.gif", x: 596, y: 751 },
  { id: 10, name: 'Młyn 3', src: "/src/assets/games/gameAssets/brianboru/mill.gif", x: 629, y: 796 },

  // Mine (Kopalnie) - ostatnie 3 kliknięcia
  { id: 11, name: 'Kopalnia Północna 1', src: "/src/assets/games/gameAssets/brianboru/mine.gif", x: 1139, y: 101 },
  { id: 12, name: 'Kopalnia Północna 2', src: "/src/assets/games/gameAssets/brianboru/mine.gif", x: 1198, y: 215 },
  { id: 13, name: 'Kopalnia Północna 3', src: "/src/assets/games/gameAssets/brianboru/mine.gif", x: 1169, y: 347 },
]);

const pobierzKoordynaty = (event) => {
  const element = document.querySelector(".map")
  
  const rect = element.getBoundingClientRect();
  

  const x = Math.round(event.clientX - rect.left);
  const y = Math.round(event.clientY - rect.top);
  
  console.log(`Kliknięto dokładnie w pikselu: X=${x}, Y=${y} względem komponentu.`);
};

</script>

<template>
    <div class="map" @click="pobierzKoordynaty">
        <Vikings :vikings="props.currentVikings" :players="props.players" />
        <Marriage :marriages="props.marriages" :players="props.players" />
        <Players :players="props.players" :you="props.you" />
        <Church :church="props.church" :marriage="marriage" />
        <Regions />
        <slot />
        <Points :regions="props.regions"/>
        <img
            v-for="building in buildings"
            :key="building.id"
            :src="building.src"
            class="map-building"
            :style="{ top: building.y + 'px', left: building.x + 'px' }"
            :alt="building.name"
        />
    </div>
</template>

<style scoped>
.map {
    position: relative;
    width: 100%;
    background-color: rgb(18, 87, 214);
    background-image: url("/src/assets/games/gameAssets/brianboru/sea.png");
    height: 100%;
}

.map-building {
    position: absolute;
    height: 32px;
    width: 32px;
    transform: translate(-8px, -8px);
    opacity: 0.8;
}
</style>
