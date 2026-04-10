<script setup>

import Points from "@/assets/games/gameAssets/brianboru/points.png";
import City  from "@/assets/games/gameAssets/brianboru/citiesReq.png";
import { computed, reactive } from "vue";

const props = defineProps(["regions"]);

// stan flip dla każdego regionu
const flipped = reactive({});

const toggle = (region) => {
  flipped[region] = !flipped[region];
};

const styles = computed(() => {
  let styleString = '';

  for (const [region, player] of Object.entries(props.regions)) {
    styleString += `--${region.split(" ")[0]}: ${player.color.hex};`;
  }

  return styleString;
});
</script>

<template>
<div :style="styles">

  <!-- Munster -->
  <div class="point seven munster" @click="toggle('Munster')">
    <div v-if="!flipped['Munster']" class="wrap">
      <span class="value">7</span>
      <img :src="Points" alt="" class="icon">
    </div>
    <div v-else class="wrap cityWrap">
      <span class="value">5</span>
      <img :src="City" alt="" class="icon">
    </div>
    <span>Munster</span>
  </div>

  <!-- Connaught -->
  <div class="point seven connaught" @click="toggle('Connaught')">
    <div v-if="!flipped['Connaught']" class="wrap">
      <span class="value">7</span>
      <img :src="Points" alt="" class="icon">
    </div>
    <div v-else class="wrap cityWrap">
      <span class="value">5</span>
      <img :src="City" alt="" class="icon">
    </div>
    <span>Connaught</span>
  </div>

  <!-- Northern Uí Néill -->
  <div class="point six northern" @click="toggle('Northern')">
    <div v-if="!flipped['Northern']" class="wrap">
      <span class="value">6</span>
      <img :src="Points" alt="" class="icon">
    </div>
    <div v-else class="wrap cityWrap">
      <span class="value">4</span>
      <img :src="City" alt="" class="icon">
    </div>
    <span>Northern <br>Uí Néill</span>
  </div>

  <!-- Leinster -->
  <div class="point six leintser" @click="toggle('Leinster')">
    <div v-if="!flipped['Leinster']" class="wrap">
      <span class="value">6</span>
      <img :src="Points" alt="" class="icon">
    </div>
    <div v-else class="wrap cityWrap">
      <span class="value">4</span>
      <img :src="City" alt="" class="icon">
    </div>
    <span>Leintser</span>
  </div>

  <!-- Southern Uí Néill -->
  <div class="point five southern" @click="toggle('Southern')">
    <div v-if="!flipped['Southern']" class="wrap">
      <span class="value">5</span>
      <img :src="Points" alt="" class="icon">
    </div>
    <div v-else class="wrap cityWrap">
      <span class="value">3</span>
      <img :src="City" alt="" class="icon">
    </div>
    <span>Southern <br>Uí Néill</span>
  </div>

  <!-- Ulaid -->
  <div class="point four ulaid" @click="toggle('Ulaid')">
    <div v-if="!flipped['Ulaid']" class="wrap">
      <span class="value">4</span>
      <img :src="Points" alt="" class="icon">
    </div>
    <div v-else class="wrap cityWrap">
      <span class="value">3</span>
      <img :src="City" alt="" class="icon">
    </div>
    <span>Ulaid</span>
  </div>

  <!-- Bréifne -->
  <div class="point three breifne" @click="toggle('Bréifne')">
    <div v-if="!flipped['Bréifne']" class="wrap">
      <span class="value">3</span>
      <img :src="Points" alt="" class="icon">
    </div>
    <div v-else class="wrap cityWrap">
      <span class="value">2</span>
      <img :src="City" alt="" class="icon">
    </div>
    <span>Bréifne</span>
  </div>

  <!-- Dublinn -->
  <div class="point three dublinn" @click="toggle('Dublinn')">
    <div v-if="!flipped['Dublinn']" class="wrap">
      <span class="value">2</span>
      <img :src="Points" alt="" class="icon">
    </div>
    <div v-else class="wrap cityWrap">
      <span class="value">2</span>
      <img :src="City" alt="" class="icon">
    </div>
    <span>Dublinn</span>
  </div>

</div>
</template>

<style scoped>



.point {
    display: flex;
    
    position: absolute;
   
    font-weight: bold;
    color: white;
    align-items: center;
    font-family: "MedievalSharp";
    filter: drop-shadow(2px 2px 25px rgba(208, 226, 247, 0.683))
    drop-shadow(2px 2px 1px rgba(0, 0, 0, 0.864));
   
}

.munster {
    top: 480px;
    left: 480px;;
    color: hsl(from var(--Munster, #fff) h s calc(l * 1));
}

.connaught {
    top: 221px;
    left: 460px;;
    color: hsl(from var(--Connaught, #fff) h s calc(l * 1));
}

.northern.six {
    top: 60px;
    gap: 0.9rem;
    left: 875px;;
    color: hsl(from var(--Northern, #fff) h s calc(l * 1));
}

.southern.five {
    top: 470px;
    left: 1257px;;
     gap: 0.9rem;
     color: hsl(from var(--Southern, #fff) h s calc(l * 1));
}

.leintser {
    top: 764px;
    left: 1143px;;
    color: hsl(from var(--Leinster, #fff) h s calc(l * 1));
}

.ulaid {
    top: 148px;
    left: 1420px;;
    font-weight: normal;
    color: hsl(from var(--Ulaid, #fff) h s calc(l * 1));
}

.breifne {
        top: 173px;
    left: 898px;;
    font-weight: normal;
    color: hsl(from var(--Bréifne, #fff) h s calc(l * 1));

    .wrap {
        transform: translateY(-8%);
    }
  
}

.dublinn {
     top: 605px;
    left: 1225px;;
    font-weight: normal;
    color: hsl(from var(--Dublinn, #fff) h s calc(l * 1));
}

.seven {
    font-size: 2.2rem;
    gap: 0.6rem;
    letter-spacing: 0.1px;
    
    .icon {
        width: 55px;
    }
    .value {
        font-size: 0.85em;
    }
}

.six {
    font-size: 1.9rem;
    gap: 0.4rem;
    letter-spacing: 0.1px;
    
    .icon {
        width: 50px;
    }
    .value {
        transform: translate(-50%, -36%);
        font-size: 0.85em;
    }
}

.five {
    font-size: 1.9rem;
    gap: 0.4rem;
    letter-spacing: 0.1px;
    
    .icon {
        width: 50px;
    }

    .value {
        transform: translate(-49%, -37%);
        font-size: 0.85em;
    } 
}

.four {
      font-size: 1.9rem;
    gap: 0.4rem;
    letter-spacing: 0.1px;
    
    .icon {
        width: 40px;
    }

    .value {
       transform: translate(-51%, -40%);
        font-size: 0.78em;
    } 
}

.three {
       font-size: 1.7rem;
    gap: 0.4rem;
    letter-spacing: 0.1px;
    
   
    .icon {
         width: 38px;
    }

    .value {
        transform: translate(-48%, -39%);
        font-size: 0.85em;
    } 
}

.two {
      font-size: 1.7rem;
    gap: 0.4rem;
    letter-spacing: 0.1px;
    
    .icon {
        width: 40px;
    }

    .value {
       
        font-size: 0.85em;
    } 
}

.wrap {
    cursor: pointer;
    transform: translateY(-5%);
    position: relative;

    &:hover {
        filter: brightness(1.15)
    }

    &.cityWrap {
        .value {
            text-shadow: 0 0 5px black;
             transform: translate(-48%, -30%);
        }
    }
}

.value {
    position: absolute;
    top: 50%;
    left: 50%;
    color: white;
    transform: translate(-48%, -35%);
}

</style>