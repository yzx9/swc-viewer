import type { NeuronStructure } from "./neuronStructure"

export interface NeuronNode {
  id: number
  structure: NeuronStructure
  x: number
  y: number
  z: number
  radius: number
  parent: number | null
}
