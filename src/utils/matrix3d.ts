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

/**
 * 可绘制对象
 */
export interface Drawable {
  draw(context: CanvasRenderingContext2D): void;
}

/**
 * 线段
 */
export interface Line<TVector extends Vector> {
  start: TVector;
  end: TVector;
  style?: string;
}

/**
 * 2/3维向量
 */
type Vector = Vector2D | Vector3D;

/**
 * 2元组
 */
type Tuple2 = [number, number];

/**
 * 3元组
 */
type Tuple3 = [number, number, number];

/**
 * 3阶矩阵
 */
type Matrix3 = [Tuple3, Tuple3, Tuple3];

/**
 * 零向量
 */
export const ZERO: Readonly<Vector3D> = { x: 0, y: 0, z: 0 };

/**
 * 构造一个点，根据参数个数（2/3）决定维度
 * @param x x坐标
 * @param y y坐标
 * @param z z坐标
 */
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

/**
 * 判断是否为3维向量
 * @param vector 向量
 */
export function is3D(vector: Vector): vector is Vector3D {
  return !!vector && typeof (vector as any).z !== "undefined";
}

/**
 * 判断是否为0向量
 * @param vector 向量
 */
export function isZero(vector: Vector): boolean {
  return (
    vector === ZERO ||
    (vector.x === 0 && vector.y === 0 && (!is3D(vector) || vector.z === 0))
  );
}

/**
 * 复制一个向量
 * @param vector 向量
 */
export function cloneOf<TVector extends Vector>(vector: TVector): TVector {
  return Object.assign({}, vector);
}

/**
 * 转换成数组
 * @param vector 向量
 */
export function toArray<TVector extends Vector>(
  vector: TVector
): TVector extends Vector3D ? Tuple3 : Tuple2 {
  const result: number[] = [vector.x, vector.y];
  if (is3D(vector)) {
    result.push(vector.z);
  }
  return result as any;
}

/**
 * 字符串显示
 * @param vector 向量
 */
export function toString(vector: Vector): string {
  let s = `x: ${vector.x.toFixed(8)} y: ${vector.y.toFixed(8)}`;
  if (is3D(vector)) {
    s += ` z: ${vector.z.toFixed(8)}`
  }
  return s;
}

/**
 * 3阶矩阵转换成一组空间基
 * @param matrix 矩阵
 */
export function basis3DFromMatrix(matrix: Matrix3): Basis3D {
  return {
    xBasis: Point(...matrix[0]),
    yBasis: Point(...matrix[1]),
    zBasis: Point(...matrix[2]),
  };
}

/**
 * 空间基转换成3阶矩阵
 * @param basis 基
 */
export function matrixOfBasis3D(basis: Basis3D): Matrix3 {
  return [toArray(basis.xBasis), toArray(basis.yBasis), toArray(basis.zBasis)];
}

/**
 * 数量积
 * @param a 向量a
 * @param b 向量b
 */
export function dotOf<TVector extends Vector>(a: TVector, b: TVector): number {
  if (is3D(a) && is3D(b)) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }
  return a.x * b.x + a.y * b.y;
}

/**
 * 模长
 * @param vector 向量
 */
export function radiusOf(vector: Vector): number {
  return Math.sqrt(dotOf(vector, vector));
}

/**
 * 向量数乘，自乘
 * @param vector 向量
 * @param coefficient 系数
 */
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

/**
 * 向量加法，自加
 * @param vector 原向量
 * @param append 增量
 */
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

/**
 * 向量减法，自减
 * @param vector 向量
 * @param append 减量
 */
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

/**
 * 单位化
 * @param vector 向量
 */
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

/**
 * 正交分解到指定轴上，返回系数
 * @param vector 向量
 * @param axis 轴向量
 */
export function decomposeOnAxis<TVector extends Vector>(
  vector: TVector,
  axis: TVector
): number {
  return dotOf(vector, axis) / dotOf(axis, axis);
}

/**
 * 向量分解，返回分解坐标
 * @param vector 向量
 * @param basis 轴向量
 */
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

/**
 * 向量在轴上的投影（带符号）
 * @param vector 向量
 * @param axis 轴向量
 */
export function projection<TVector extends Vector>(
  vector: TVector,
  axis: TVector
): number {
  return dotOf(vector, axis) / radiusOf(axis);
}

/**
 * 给出用基basis和系数vector线性表示的向量
 * @param vector 向量
 * @param basis 基
 */
export function representationOf<TVector extends Vector>(vector: TVector, basis: BasisOf<TVector>): TVector {
  const x = multiplyOn(cloneOf(basis.xBasis), vector.x);
  const y = multiplyOn(cloneOf(basis.yBasis), vector.y);
  const result: TVector = addOn(x, y) as any;
  if (is3D(vector)) {
    const z = multiplyOn(cloneOf((basis as Basis3D).zBasis), vector.z);
    addOn(x, z);
  }
  return result;
}

/**
 * 矩阵乘法
 * @param a a矩阵
 * @param b b矩阵
 */
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

/**
 * 向量外积（叉积）
 * @param a 3维向量a
 * @param b 3维向量b
 */
export function crossProductOf(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.y * b.z - b.y * a.z,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }
}

/**
 * 向量旋转
 * @param basis 基
 * @param rotation 旋转向量
 */
export function rotateBasis3D(basis: Basis3D, rotation: Basis3D): Basis3D {
  return basis3DFromMatrix(
    matrixMultiplication(
      matrixOfBasis3D(basis),
      matrixOfBasis3D(rotation)
    ) as any
  );
}

/**
 * 将点投影到投影平面后，点在平面内的坐标
 * @param point 点
 * @param plane 投影平面
 */
export function planeProjection(
  point: Vector3D,
  plane: ProjectionPlane
): Vector2D {
  return {
    x: projection(substractOn(cloneOf(point), plane.origin), plane.xBasis),
    y: projection(substractOn(cloneOf(point), plane.origin), plane.yBasis),
  };
}

/**
 * 计算屏幕（视觉平面）在参考坐标系中对应的投影平面
 * @param c 参考坐标系
 */
export function visualPlaneOf(c: CoordinateSystem): ProjectionPlane {
  return {
    origin: decomposition(substractOn(cloneOf(ZERO), c.origin), c.basis),
    xBasis: decomposition({ x: 1, y: 0, z: 0 }, c.basis),
    yBasis: decomposition({ x: 0, y: 1, z: 0 }, c.basis),
  };
}

/**
 * 计算屏幕上的位置在参考坐标系中的坐标（屏幕所处平面以visualPlane计算）
 * @param c 参考坐标系
 * @param position 屏幕上相对原点的位置
 */
export function screenPositionOf(c: CoordinateSystem, position: Vector2D) {
  const plane = visualPlaneOf(c);
  const { x, y } = position;
  return addOn(
    addOn(
      multiplyOn(unitization(plane.xBasis), x),
      multiplyOn(unitization(plane.yBasis), y)
    ),
    plane.origin
  );
}

/**
 * 将3维线段投影到投影平面，得到二维线段
 * @param line 线段
 * @param plane 平面
 */
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
  context: CanvasRenderingContext2D,
  style?: string
) {
  context.save();
  if (style !== undefined) {
    context.strokeStyle = style;
  }
  context.beginPath();
  context.moveTo(Math.round(line.start.x), Math.round(line.start.y));
  context.lineTo(Math.round(line.end.x), Math.round(line.end.y));
  context.closePath();
  context.stroke();
  context.restore();
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
    for (const line of this.lines()) {
      drawLine(projectLine(line, plane), context, line.style);
    }
    context.beginPath();
    const origin = planeProjection(ZERO, plane)
    context.arc(origin.x, origin.y, 1, 0, 2 * Math.PI);
    context.stroke();
  }

  lines(): Array<Line<Vector3D>> {
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
        style: 'red',
      },
      {
        start: p1,
        end: p2,
        style: 'green',
      },
      {
        start: p2,
        end: p3,
        style: 'red',
      },
      {
        start: p3,
        end: p0,
        style: 'blue',
      },
      {
        start: p0,
        end: p4,
        style: 'blue',
      },
      {
        start: p1,
        end: p5,
        style: 'green',
      },
      {
        start: p2,
        end: p6,
        style: 'green',
      },
      {
        start: p3,
        end: p7,
        style: 'blue',
      },
      {
        start: p4,
        end: p5,
        style: 'red',
      },
      {
        start: p5,
        end: p6,
        style: 'green',
      },
      {
        start: p6,
        end: p7,
        style: 'red',
      },
      {
        start: p7,
        end: p4,
        style: 'blue',
      },
      {
        start: ZERO,
        end: Point(a, 0, 0),
      },
    ];
  }
}
