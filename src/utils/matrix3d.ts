/**
 * 二维向量
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * 三维向量
 */
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

/**
 * 2D轴
 */
export interface Basis2D {
  xBasis: Vector2D;
  yBasis: Vector2D;
}

/**
 * 3D轴
 */
export interface Basis3D {
  xBasis: Vector3D;
  yBasis: Vector3D;
  zBasis: Vector3D;
}

type BasisOf<TVector extends Vector> = TVector extends Vector3D
  ? Basis3D
  : Basis2D;

/**
 * 坐标系，相对于绝对坐标系（x轴朝右，y轴朝下，z周朝外）的描述
 */
export interface CoordinateSystem {
  /**
   * 轴的方向向量
   */
  basis: Basis3D;
  /**
   * 原点坐标
   */
  origin: Vector3D;
}

/**
 * 4维向量，用四元组表示
 */
type Vector4D = [number, number, number, number];

/**
 * 3D变换矩阵
 */
export interface TransformMatrix3D {
  data: [Vector4D, Vector4D, Vector4D, Vector4D];
}

/**
 * 平面
 */
export interface Plane {
  /**
   * 法向量
   */
  normalVector: Vector3D;
  /**
   * 参考点
   */
  point: Vector3D;
}

/**
 * 投影画布平面
 */
export interface ProjectionPlane {
  /**
   * 原点坐标
   */
  origin: Vector3D;
  /**
   * x轴方向向量
   */
  xBasis: Vector3D;
  /**
   * y轴方向向量
   */
  yBasis: Vector3D;
}

export interface Drawable {
  draw(context: CanvasRenderingContext2D): void;
}

export interface Line<TVector extends Vector> {
  start: TVector;
  end: TVector;
}

type Vector = Vector2D | Vector3D;

type Tuple2 = [number, number];

type Tuple3 = [number, number, number];

type Matrix3 = [Tuple3, Tuple3, Tuple3];

export const ZERO: Readonly<Vector3D> = { x: 0, y: 0, z: 0 };

export function Point<TZ extends undefined | number>(
  x: number,
  y: number,
  z?: TZ
) {
  const result: TZ extends undefined ? Vector2D : Vector3D = { x, y } as any;
  if (z !== undefined) {
    (result as Vector3D).z = z as number;
  }
  return result;
}

export function is3D(vector: Vector): vector is Vector3D {
  return !!vector && typeof (vector as any).z !== "undefined";
}

export function isZero(vector: Vector): boolean {
  return (
    vector === ZERO ||
    (vector.x === 0 && vector.y === 0 && (!is3D(vector) || vector.z === 0))
  );
}

export function cloneOf<TVector extends Vector>(vector: TVector): TVector {
  return Object.assign({}, vector);
}

export function toArray<TVector extends Vector>(
  vector: TVector
): TVector extends Vector3D ? Tuple3 : Tuple2 {
  const result: number[] = [vector.x, vector.y];
  if (is3D(vector)) {
    result.push(vector.z);
  }
  return result as any;
}

export function basis3DFromMatrix(matrix: Matrix3): Basis3D {
  return {
    xBasis: Point(...matrix[0]),
    yBasis: Point(...matrix[1]),
    zBasis: Point(...matrix[2]),
  };
}

export function matrixOfBasis3D(basis: Basis3D): Matrix3 {
  return [toArray(basis.xBasis), toArray(basis.yBasis), toArray(basis.zBasis)];
}

export function dotOf<TVector extends Vector>(a: TVector, b: TVector): number {
  if (is3D(a) && is3D(b)) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }
  return a.x * b.x + a.y * b.y;
}

export function radiusOf(vector: Vector): number {
  return Math.sqrt(dotOf(vector, vector));
}

export function multiplyOn<TVector extends Vector>(
  vector: TVector,
  coefficient: number
): TVector {
  vector.x *= coefficient;
  vector.y *= coefficient;
  if (is3D(vector)) {
    vector.z *= coefficient;
  }
  return vector;
}

export function addOn<TVector extends Vector>(
  vector: TVector,
  append: Partial<TVector>
): TVector {
  vector.x += append.x || 0;
  vector.y += append.y || 0;
  if (is3D(vector)) {
    vector.z += ((append as unknown) as Vector3D).z || 0;
  }
  return vector;
}

export function substractOn<TVector extends Vector>(
  vector: TVector,
  append: TVector
): TVector {
  vector.x -= append.x;
  vector.y -= append.y;
  if (is3D(vector) && is3D(append)) {
    vector.z -= append.z;
  }
  return vector;
}

export function unitization<TVector extends Vector>(vector: TVector): TVector {
  const radius = radiusOf(vector);
  const result: TVector = {
    x: vector.x / radius,
    y: vector.y / radius,
  } as TVector;
  if (is3D(vector)) {
    (result as Vector3D).z = vector.z / radius;
  }
  return result;
}

export function decomposeOnAxis<TVector extends Vector>(
  vector: TVector,
  axis: TVector
): number {
  return dotOf(vector, axis) / dotOf(axis, axis);
}

export function decomposition<TVector extends Vector>(
  vector: TVector,
  basis: BasisOf<TVector>
): TVector {
  const x: Vector3D = vector as any;
  const result: TVector = {
    x: decomposeOnAxis(vector, basis.xBasis),
    y: decomposeOnAxis(vector, basis.yBasis),
  } as TVector;
  if (is3D(vector)) {
    (result as Vector3D).z = decomposeOnAxis(vector, (basis as Basis3D).zBasis);
  }
  return result;
}

export function projection<TVector extends Vector>(
  vector: TVector,
  axis: TVector
): number {
  return dotOf(vector, axis) / radiusOf(axis);
}

export function matrixMultiplication(a: number[][], b: number[][]): number[][] {
  const result: number[][] = [];
  const n = a.length;
  const m = b[0].length;
  for (let i = 0; i < n; i++) {
    result[i] = [];
    for (let j = 0; j < m; j++) {
      result[i][j] = 0;
      for (let k = 0; k < a[i].length; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}

export function rotateBasis3D(basis: Basis3D, rotation: Basis3D): Basis3D {
  return basis3DFromMatrix(
      matrixMultiplication(
      matrixOfBasis3D(basis), matrixOfBasis3D(rotation)) as any);
}

export function planeProjection(
  point: Vector3D,
  plane: ProjectionPlane
): Vector2D {
  return {
    x: projection(substractOn(cloneOf(point), plane.origin), plane.xBasis),
    y: projection(substractOn(cloneOf(point), plane.origin), plane.yBasis),
  };
}

export function visualPlaneOf(c: CoordinateSystem): ProjectionPlane {
  return {
    origin: decomposition(multiplyOn(cloneOf(c.origin), -1), c.basis),
    xBasis: decomposition({ x: 1, y: 0, z: 0 }, c.basis),
    yBasis: decomposition({ x: 0, y: 1, z: 0 }, c.basis),
  };
}

export function projectLine(
  line: Line<Vector3D>,
  plane: ProjectionPlane
): Line<Vector2D> {
  return {
    start: planeProjection(line.start, plane),
    end: planeProjection(line.end, plane),
  };
}

export function drawLine(
  line: Line<Vector2D>,
  context: CanvasRenderingContext2D
) {
  context.beginPath();
  context.moveTo(line.start.x, line.start.y);
  context.lineTo(line.end.x, line.end.y);
  context.closePath();
  context.stroke();
}

export class TestCuboid implements Drawable {
  public a: number;
  public b: number;
  public c: number;
  public coor: CoordinateSystem;
  constructor(a: number, b: number, c: number, coor: CoordinateSystem) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.coor = coor;
  }
  draw(context: CanvasRenderingContext2D): void {
    const plane = visualPlaneOf(this.coor);
    for (const line of this.lines) {
      drawLine(projectLine(line, plane), context);
    }
  }

  get lines(): Array<Line<Vector3D>> {
    const { a, b, c } = this;
    const p0 = Point(-a, -b, -c);
    const p1 = Point(a, -b, -c);
    const p2 = Point(a, b, -c);
    const p3 = Point(-a, b, -c);
    const p4 = Point(-a, -b, c);
    const p5 = Point(a, -b, c);
    const p6 = Point(a, b, c);
    const p7 = Point(-a, b, c);
    return [
      {
        start: p0,
        end: p1,
      },
      {
        start: p1,
        end: p2,
      },
      {
        start: p2,
        end: p3,
      },
      {
        start: p3,
        end: p0,
      },
      {
        start: p0,
        end: p4,
      },
      {
        start: p1,
        end: p5,
      },
      {
        start: p2,
        end: p6,
      },
      {
        start: p3,
        end: p7,
      },
      {
        start: p4,
        end: p5,
      },
      {
        start: p5,
        end: p6,
      },
      {
        start: p6,
        end: p7,
      },
      {
        start: p7,
        end: p4,
      },
    ];
  }
}
