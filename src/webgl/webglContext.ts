export type Node = {
  x: number
  y: number
  z: number
  radius: number
  color: number
}

export interface WebGLContext {
  mount(container: string | Element): void
  update(): void
  createNode(node: Node): void
  createConnect(parent: Node, child: Node): void
  rotate(axis: { x: number; y: number; z: number }, angle: number): void
}
