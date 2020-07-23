<template>
  <div id="app">
    <canvas width="400" height="300" id="cvs"></canvas>
    <div class="buttons">
      <button class="clear" @click="clear">clear</button>
      <button class="draw" @click="draw">draw</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CoordinateSystem, visualPlaneOf, TestCuboid, rotateBasis3D, Point, unitization } from "./utils/matrix3d";
// const cvs = document.getElementById("cvs") as HTMLCanvasElement;
const r2 = Math.sqrt(2);
const r3 = Math.sqrt(3);
const r6 = Math.sqrt(6);
const coordinateSystem: CoordinateSystem = {
  origin: {
    x: 200,
    y: 150,
    z: 0,
  },
  basis: {
    xBasis: {
      x: 1 / r2,
      y: -1 / r6,
      z: -1 / r3,
    },
    yBasis: {
      x: -1 / r2,
      y: -1 / r6,
      z: -1 / r3,
    },
    zBasis: {
      x: 0,
      y: r2 / r3,
      z: -1 / r3,
    },
  },
};
@Component({
  components: {},
})
export default class App extends Vue {
  public canvas!: HTMLCanvasElement;
  public context2d!: CanvasRenderingContext2D;
  mounted() {
    this.canvas = document.getElementById("cvs") as any;
    this.context2d = this.canvas.getContext("2d") as any;
    this.draw();
    this.canvas.addEventListener("mousemove", (e) => {
      console.log("mousemove", e.offsetX, e.offsetY);
      this.clear();
      coordinateSystem.basis = rotateBasis3D(coordinateSystem.basis, {
        xBasis: unitization(Point(e.offsetX * 0.01, 1, 0)),
        yBasis: unitization(Point(0, -e.offsetX * 0.01, 1)),
        zBasis: unitization(Point(100 / e.offsetX, -1, -e.offsetX * 0.01)),
      });
      this.draw();
    });
  }
  clear() {
    console.log("clear!");
    this.context2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context2d.closePath();
  }
  draw() {
    console.log("draw!");
    // TODO
    const plane = visualPlaneOf(coordinateSystem);
    new TestCuboid(50, 100, 100, coordinateSystem).draw(this.context2d);
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
.buttons {
  display: flex;
  justify-content: space-around;
}
.clear {
  background: #cc4444;
}
.draw {
  background: #44cc44;
}
</style>
