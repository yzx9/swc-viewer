import type { NeuronNode } from "./swc"

export interface WebGLContext {
  createNode(node: NeuronNode): void
  createConnect(parent: NeuronNode, child: NeuronNode): void
  update(): void
  rotate(axis: { x: number; y: number; z: number }, angle: number): void
  mount(container: string | Element): void
}
