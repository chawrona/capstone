<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useAppStore } from '@/store/useAppStore'

const props = defineProps(['players'])

const store = useAppStore()

const openPlacement = ref(false)

const keys = {
  up: false,
  down: false,
  left: false,
  right: false
}

let interval = null

const keyMap = {
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right'
}

const handleKeyDown = (e) => {
  const key = e.key.toLowerCase()

  if (key === 'p') {
    openPlacement.value = !openPlacement.value
    return
  }

  const direction = keyMap[key]

  if (!direction) return

  keys[direction] = true
  startSending()
}

const handleKeyUp = (e) => {
  const key = e.key.toLowerCase()
  const direction = keyMap[key]

  if (!direction) return

  keys[direction] = false

  if (!Object.values(keys).some(Boolean)) {
    stopSending()
  }
}

let idk = 0;

const startSending = () => {
  if (interval) return


  store.socket.emit('gameData', {
        eventName: "move",
        ...keys 
  })

  interval = setInterval(() => {
    console.log("Wysyła się event");
    console.log(idk++);
    
    
    store.socket.emit('gameData', {
        eventName: "move",
        ...keys 
    })
  }, 50)
}

const stopSending = () => {
  clearInterval(interval)
  interval = null
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  stopSending()
})
</script>

<template>
    <!-- 76 * 37 (25 na 25 pikseli)-->
<div class="grid" :class="{openPlacement,}">


    <div 
        v-for="(player,index) in props.players"
        class="player"
        :style="`--x: ${player.position.x}px; --y: ${player.position.y}px; --color: ${player.color.hex}`"
    >
        {{ player.username[0] }}
    </div>

 

    <div 
        v-for="(, index) in (54 * 27)"
        class="field"
        data-id="index"
        :key="index"
    />
   
</div>
</template>

<style scoped lang="scss">
.grid {
    display: grid;
    position: relative;

    grid-template-columns: repeat(54, 35px);
    grid-template-rows: repeat(27, 35px);

    &.openPlacement {
        .field {
            border: 0.5px solid white;
            &::after {
                   background-color: #ffffff4e;
            }
        }
    }

}

.player {
    font-weight: bold;
    font-size: 1.25rem;
    display: grid;
    place-items: center;
    position: absolute;
    width: 31px;
    height: 31px;
 
    background-color: var(--color);
    border-radius: 50%;
    top: var(--y);
    left: var(--x);
    transition: 0.05s linear;
    border: 1px solid hsl(from var(--color) h s calc(l * 0.8));
}

.field {
    position: relative;
    width: 35px;
    height: 35px;
    background-color: transparent;
  
    &::after {
        display: block;
  
        content: "";
        position: absolute;
        inset: 1px; 
     
    }
}
</style>