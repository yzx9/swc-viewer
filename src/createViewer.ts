import { createAutoRotateControl } from "./autoRotate"
import { createNeuron } from "./createNeuron"
import { parseSWC } from "./parseSWC"
import { EventControl, NeuronStructure, WebGLContext } from "./types"
import { identifyFunctions } from "./utils"
import { createWebGLContext } from "./webgl"

export function createViewer() {
  const ctx = createWebGLContext()

  function load(content: string) {
    const swc = parseSWC(content)
    createNeuron(ctx, swc)
  }

  const animateEventControl: EventControl = {
    events: [] as (() => void)[],
    register(event: () => void) {
      this.events.push(event)
      return () => this.remove(event)
    },
    remove(event: () => void) {
      const events = (this as any).events

      const index = events.indexOf(event)
      if (index === -1) {
        return
      }

      events.splice(index, 1)
    },
  }

  function animate() {
    requestAnimationFrame(animate)
    animateEventControl.events.forEach((event) => event())
    ctx.update()
  }

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
