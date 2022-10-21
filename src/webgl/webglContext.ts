import { Object3D } from "three"

type Remover = () => void

export type Node = {
  x: number
  y: number
  z: number
  radius: number
  color: number
}

export interface WebGLContext {
  mount(container: HTMLElement): void
  update(): void
  createNode(node: Node): Remover
  createConnect(parent: Node, child: Node): Remover
  rotate(axis: { x: number; y: number; z: number }, angle: number): void
}
