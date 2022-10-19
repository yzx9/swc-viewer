export interface NeuronNode {
  id: number
  structure: NeuronStructure
  x: number
  y: number
  z: number
  radius: number
  parent: number | null
}

export enum NeuronStructure {
  undefined,
  soma,
  axon,
  basalDendrite,
  apicalDendrite,

  // 5+: custom
  // Standardized swc files (www.neuromorpho.org)

  /**
   * CNIC data
   */
  forkPoint,

  /**
   * CNIC data
   */
  endPoint,
}
