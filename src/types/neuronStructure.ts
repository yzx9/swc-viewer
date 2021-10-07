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
