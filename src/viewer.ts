import { createAnimate } from "./animate"
import { AutoRotateControl, Axis, createAutoRotateControl } from "./autoRotate"
import { loadSWC } from "./neuron"
import { WebGLContext } from "./webgl"

export type Viewer = {
  mount(container: string | Element): Viewer
  load(content: string): Viewer
  animate(): Viewer
  enableAutoRotate(axis: Axis, angle: number): Viewer
  disableAutoRotate(): Viewer
}

export function createViewer(options: { ctx: WebGLContext }): _Viewer {
  const { ctx } = options
  const viewer = new _Viewer(ctx)

  // enable auto rotate by default
  viewer.enableAutoRotate({ x: -1, y: 1, z: 1 }, 0.001)

  return viewer
}

class _Viewer {
  ctx: WebGLContext
  #animate: () => void
  #autoRotate: AutoRotateControl

  constructor(ctx: WebGLContext) {
    this.ctx = ctx

    const { animate, animateEventControl } = createAnimate(ctx)
    this.#animate = animate

    this.#autoRotate = createAutoRotateControl(animateEventControl, ctx)
  }

  mount(container: string | Element): this {
    this.ctx.mount(container)
    return this
  }

  load(content: string): this {
    const swc = loadSWC(content)
    swc.addTo(this.ctx)
    return this
  }

  animate(): this {
    this.#animate()
    return this
  }

  enableAutoRotate(axis: Axis, angle: number): this {
    this.#autoRotate.enable(axis, angle)
    return this
  }

  disableAutoRotate(): this {
    this.#autoRotate.disable()
    return this
  }
}
