<template>
  <div id="app">
    <div>将鼠标移到框内查看3D立方体</div>
    <canvas width="400" height="300" id="cvs"></canvas>
    <div>屏幕所在平面方程：x + y + z = 100√3</div>
    <div>当前鼠标三维坐标</div>
    <div id="message"></div>
    <div>当前鼠标二维坐标</div>
    <div id="position"></div>
    <div id="plane"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  CoordinateSystem,
  visualPlaneOf,
  TestCuboid,
  rotateBasis3D,
  Point,
  unitization,
  dotOf,
  Basis3D,
  substractOn,
  cloneOf,
  addOn,
  multiplyOn,
  crossProductOf,
  decomposition,
  representationOf,
  screenPositionOf,
  toPrettyString
} from "./utils/matrix3d";
// const cvs = document.getElementById("cvs") as HTMLCanvasElement;
const r2 = Math.sqrt(2);
const r3 = Math.sqrt(3);
const r6 = Math.sqrt(6);
const stdBasis = {
  xBasis: {
    x: 1 / r2,
    y: 1 / r6,
    z: 1 / r3
  },
  yBasis: {
    x: -1 / r2,
    y: 1 / r6,
    z: 1 / r3
  },
  zBasis: {
    x: 0,
    y: -r2 / r3,
    z: 1 / r3
  }
};
const coordinateSystem: CoordinateSystem = {
  origin: {
    x: 200,
    y: 150,
    z: -100
  },
  basis: stdBasis
};
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
    this.canvas.addEventListener("mousemove", e => {
      console.log("mousemove", e.offsetX, e.offsetY);
      this.clear();
      const x = e.offsetX;
      const y = e.offsetY;
      const ray = screenPositionOf({
        origin: coordinateSystem.origin,
        basis: stdBasis,
      }, {x, y})
      document.getElementById("message")!.innerText = toPrettyString(ray);
      document.getElementById("position")!.innerText = toPrettyString({ x, y });
      const xRay = representationOf(unitization(ray), stdBasis);
      const yRay = unitization(crossProductOf(stdBasis.xBasis, xRay))
      const zRay = unitization(crossProductOf(yRay, xRay));
      coordinateSystem.basis = {
        xBasis: xRay,
        yBasis: yRay,
        zBasis: zRay,
      }
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
    new TestCuboid(50, 50, 50, coordinateSystem).draw(this.context2d);
  }
}
</script>

<style>
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
