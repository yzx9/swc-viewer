import type { NeuronNode } from "../swc"

export interface WebGLContext {
  mount(container: string | Element): void
  update(): void
  createNode(node: NeuronNode): void
  createConnect(parent: NeuronNode, child: NeuronNode): void
  rotate(axis: { x: number; y: number; z: number }, angle: number): void
}
