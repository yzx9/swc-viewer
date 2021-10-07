import type { NeuronNode } from "./neuronNode"

export interface WebGLContext {
  createNode(node: NeuronNode): void
  createConnect(from: NeuronNode, to: NeuronNode): void
  update(): void
  rotate(axis: { x: number; y: number; z: number }, angle: number): void
  mount(container: string | Element): void
}
