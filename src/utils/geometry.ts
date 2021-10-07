type Point3D = { x: number; y: number; z: number }
type Vertex3D = { x: number; y: number; z: number }

export function getEulerDistance(point1: Point3D, point2: Point3D): number {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) +
      Math.pow(point1.y - point2.y, 2) +
      Math.pow(point1.z - point2.z, 2)
  )
}

export function getMidpoint(point1: Point3D, point2: Point3D): Point3D {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2,
    z: (point1.z + point2.z) / 2,
  }
}

export function getVertex(from: Point3D, to: Point3D): Vertex3D {
  return {
    x: to.x - from.x,
    y: to.y - from.y,
    z: to.z - from.z,
  }
}
