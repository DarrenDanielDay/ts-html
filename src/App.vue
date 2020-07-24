<template>
  <div id="app">
    <canvas width="400" height="300" id="cvs"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class App extends Vue {
  public canvas!: HTMLCanvasElement;
  public context2d!: CanvasRenderingContext2D;
  mounted() {
    this.canvas = document.getElementById("cvs") as any;
    this.context2d = this.canvas.getContext("2d") as any;
    this.draw();
  }
  clear() {
    console.log("clear!");
    this.context2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context2d.closePath();
  }
  draw() {
    console.log("draw!");
    // TODO
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
