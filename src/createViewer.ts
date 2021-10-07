import { NeuronStructure } from "./types"
import { identifyFunctions } from "./utils"
import { createWebGLContext } from "./webgl"

export function createViewer() {
  const context = createWebGLContext()

  context.createNode({
    id: 0,
    structure: NeuronStructure.axon,
    x: 0,
    y: 0,
    z: 0,
    radius: 50,
    parent: -1,
  })

  return identifyFunctions({
    mount: context.mount,
    animate: context.animate,
  })
}
