import type { NeuronStructure } from "../../types"

const colors = [
  [255, 255, 255], // white, 0-undefined
  [20, 20, 20], // black, 1-soma
  [200, 20, 0], // red, 2-axon
  [0, 20, 200], // blue, 3-dendrite
  [200, 0, 200], // purple, 4-apical dendrite

  // the following is Hanchuan’s extended color. 090331
  [0, 200, 200], // cyan, 5
  [220, 200, 0], // yellow, 6
  [0, 200, 20], // green, 7
  [188, 94, 37], // coffee, 8
  [180, 200, 120], // asparagus, 9
  [250, 100, 120], // salmon, 10
  [120, 200, 200], // ice, 11
  [100, 120, 200], // orchid, 12

  // the following is Hanchuan’s further extended color. 111003
  [255, 128, 168], // 13
  [128, 255, 168], // 14
  [128, 168, 255], // 15
  [168, 255, 128], // 16
  [255, 168, 128], // 17
  [168, 128, 255], // 18
  [0, 0, 0], //19 // totally black. PHC, 2012-02-15

  // the following (20-275) is used for matlab heat map. 120209 by WYN
  [0, 0, 131], //20
].map(([r, g, b]) => r * 0x010000 + g * 0x000100 + b * 0x000001)

export function getColorHex(structure: NeuronStructure): number {
  const index = structure as number
  console.log(index, colors[index])
  return colors[index] ?? NaN
}

export function getColorStr(structure: NeuronStructure): string {
  const color = getColorHex(structure)
  return color ? `#${color}` : ``
}
