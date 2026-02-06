<script setup>
import Island from "@/assets/games/gameAssets/brianboru/map.png";

const maxWidth = 850;
const maxHeight = 1050;
const types = ["red", "blue", "yellow"];
const citySize = 40; // px
const minDistance = citySize; // minimalna odległość między środkami

function generateCities(count) {
  const cities = [];

  for (let i = 0; i < count; i++) {
    let valid = false;
    let x, y;

    while (!valid) {
      x = Math.floor(Math.random() * (maxWidth - citySize));
      y = Math.floor(Math.random() * (maxHeight - citySize));

      valid = true;
      for (const city of cities) {
        const dx = city.x - x;
        const dy = city.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
          valid = false;
          break;
        }
      }
    }

    cities.push({
      id: i + 1,
      x,
      y,
      type: types[Math.floor(Math.random() * types.length)],
      ownerColor: null,
      vikings: false
    });
  }

  return cities;
}

const cities = generateCities(40);


</script>

<template>

<div class="island">
    <img :src="Island" alt="" class="map">
    <div class="city" :class="{
        vikings: city.vikings,
        occupied: !!ownerColor,
    }"
    :data-type="city.type"
    v-for="city in cities" :style="{
  '--x': city.x + 'px',
  '--y': city.y + 'px',
  '--ownerColor': city.ownerColor
}">

    </div>
</div>



</template>

<style scoped>
.island {
    top: 50%;
    left: 50%;
    transform: translate(calc(-50% - 100px), -50%);
    position: absolute;
    width: 1100px;
    height: 900px;
    background-color: #ffffff69;
}

.city {
    position: absolute;
    top: var(--x);
    left: var(--y);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.358);
}

[data-type="red"] {
    background-image: url("/src/assets/games/gameAssets/brianboru/miasto_red.png");
    background-size: cover;
    background-position: center;
}
[data-type="blue"] {
      background-image: url("/src/assets/games/gameAssets/brianboru/miasto_blue.png");
    background-size: cover;
    background-position: center;
}
[data-type="yellow"] {
      background-image: url("/src/assets/games/gameAssets/brianboru/miasto_yellow.png");
    background-size: cover;
    background-position: center;
}
</style>