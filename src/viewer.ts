import { Animation, createAnimation } from "./animations"
import { loadSWC } from "./neuron"
import { WebGLContext } from "./webgl"

export function createViewer(options: { ctx: WebGLContext }): Viewer {
  const { ctx } = options
  return new Viewer(ctx)
}

export class Viewer {
  ctx: WebGLContext
  animation: Animation

  constructor(ctx: WebGLContext) {
    this.ctx = ctx
    this.animation = createAnimation(ctx)
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
    this.animation.update()
    return this
  }
}
