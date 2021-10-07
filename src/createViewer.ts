import { createAutoRotateControl } from "./autoRotate"
import { EventControl, NeuronStructure, WebGLContext } from "./types"
import { identifyFunctions } from "./utils"
import { createWebGLContext } from "./webgl"

export function createViewer() {
  const ctx = createWebGLContext()

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
    ctx.animate()
  }

  const { enableAutoRotate, disableAutoRotate } = createAutoRotateControl(
    animateEventControl,
    ctx
  )

  // enable auto rotate by default
  enableAutoRotate({ x: -1, y: 1, z: 1 }, 0.001)

  createTestData(ctx)

  return identifyFunctions({
    mount: ctx.mount,
    animate,
    enableAutoRotate,
    disableAutoRotate,
  })
}

function createTestData(ctx: WebGLContext) {
  ctx.createNode({
    id: 0,
    structure: NeuronStructure.axon,
    x: 0,
    y: 0,
    z: 0,
    radius: 50,
    parent: -1,
  })

  ctx.createNode({
    id: 1,
    structure: NeuronStructure.apicalDendrite,
    x: 30,
    y: 30,
    z: 30,
    radius: 50,
    parent: -1,
  })
}
