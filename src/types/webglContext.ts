import type { NeuronNode } from "./neuronNode"

export interface WebGLContext {
  createNode(node: NeuronNode): void
  createConnect(from: NeuronNode, to: NeuronNode): void
  animate(): void
  mount(container: string | Element): void
}
