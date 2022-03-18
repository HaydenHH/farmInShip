<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {Game} from './game'


defineProps<{ scene:number }>()

const count = ref(0)
let GAME:Game
let canvas = ref()
onMounted(()=>{
  canvas.value = document.querySelector<HTMLCanvasElement>('#main')!
  GAME = new Game(canvas.value)
})

const clickCanvas=()=>{

  GAME.clicked()
  
  
}



</script>


<template>
  <canvas id="main" @click="clickCanvas"></canvas>
</template>

<style scoped>
  #main{
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
