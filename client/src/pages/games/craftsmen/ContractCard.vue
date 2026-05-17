<script setup>
import Coins from "@/assets/games/gameAssets/craftsmen/coins.png";
import Wheat from "@/assets/games/gameAssets/craftsmen/wheat.png";
import Wood from "@/assets/games/gameAssets/craftsmen/Wood.png";
import Brick from "@/assets/games/gameAssets/craftsmen/Brick.png";
import Stone from "@/assets/games/gameAssets/craftsmen/Stone.png";
import Reroll from "@/assets/games/gameAssets/craftsmen/Reroll.png";
import { ref } from "vue";


const props = defineProps(["resource"])

const getRewardResource = (type) => {
    if (type === "coins") return Coins;
    if (type === "wheat") return Wheat;
    if (type === "stone") return Stone;
    if (type === "wood") return Wood;
    if (type === "brick") return Brick;
}

</script>

<template>
<div class="card" :class="{hidden: !props.resource.show}">

    <div class="reroll">
      <img :src="Reroll" alt="">
      3
       <img :src="Coins" alt="">
    </div>

    <div class="wrap">

 
   <h1 class="title"> {{ props.resource.title }}</h1>


    <img :src="Wood" alt="" class="cardIcon">

    <div class="top">
        <div v-for="(resource, index) in props.resource.required" :key="resource.type" :class="{smallerImg: true}">
            {{ resource.amount }}
            <img :src="getRewardResource(resource.type)" alt="">
        </div>
    </div>
       </div>
</div>
</template>

<style scoped>
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  
    width: 32%;
    height: 100%;
  
    font-size: 1.8rem;
    font-weight: bold;
    color: white;
    cursor: pointer;
  
   

  
   
  }

  .wrap {  padding: 0.5rem;
    width: 100%;
     display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
        box-shadow: 3px 3px 3px 0px rgba(51, 48, 48, 0.671);
    background-size: cover;
    background-position: center;
     background-image: url("/src/assets/games/gameAssets/craftsmen/board.png");
    &:hover {
        filter: brightness(1.2);
    }
  }

.title {

    font-size: 1.3rem;
    text-align: center;
    font-weight: bold;
    margin-top: 0.25rem;
    height: 4rem;
}
.za {
    font-size: 1.25rem;
}

.bottom {
    display: flex;
    flex-direction: row;
   gap: 0.5rem;
    align-items: center;
    img {
        width: 3rem;
    }
  }

  .top {
  
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 0.5rem;

  }

  .hidden {
    opacity: 0;
    cursor: auto;;
  }

  .top div {
     display: flex;

    gap: 0.2rem;
    align-items: center;

  }

  .top .smallerImg {
   
    img {
        width: 2.5rem;
    }
  }

  .reroll {
    display: flex;
    justify-content: center;
    position: absolute;
   align-items: center;
    right: 0;
    top: -3rem;

    height: 2.5rem;
padding: 0.25rem;
        font-size: 1.3rem;
    font-weight: bold;
    color: white;
    cursor: pointer;
      box-shadow: 3px 3px 3px 0px rgba(51, 48, 48, 0.671);
    background-size: cover;
    background-position: center;
    background-image: url("/src/assets/games/gameAssets/craftsmen/board.png");

      &:hover {
        filter: brightness(1.2);
    }

    img {
      width: 2rem;
    }
  }
 
</style>