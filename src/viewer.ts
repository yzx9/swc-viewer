import { createAutoRotateControl } from "./autoRotate"
import { createAnimate } from "./animate"
import { createNeuron } from "./neuron"
import { parseSWC } from "./parseSWC"
import { identifyFunctions } from "./utils"
import { createWebGLContext } from "./webgl"

export function createViewer() {
  const ctx = createWebGLContext()

  function load(content: string) {
    const swc = parseSWC(content)
    createNeuron(ctx, swc)
  }

  const { animate, animateEventControl } = createAnimate(ctx)

  const { enableAutoRotate, disableAutoRotate } = createAutoRotateControl(
    animateEventControl,
    ctx
  )

  // enable auto rotate by default
  enableAutoRotate({ x: -1, y: 1, z: 1 }, 0.001)

  return identifyFunctions({
    mount: ctx.mount,
    load,
    animate,
    enableAutoRotate,
    disableAutoRotate,
  })
}
