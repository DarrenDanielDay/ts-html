<template>
  <div id="app">
    <canvas width="400" height="300" id="cvs"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {},
})
export default class App extends Vue {
  mounted() {
    const canvas: HTMLCanvasElement = document.getElementById('cvs') as any;
    const context: CanvasRenderingContext2D = canvas.getContext("2d") as any;
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#cvs {
  border: black 1px solid;
}
</style>
