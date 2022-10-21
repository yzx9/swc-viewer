import { Animation, createAnimation } from "./animations"
import { loadSWC } from "./neuron"
import { getElement } from "./utils"
import { WebGLContext } from "./webgl"

export function createViewer(options: {
  ctx: WebGLContext
  mount: string | Element
}): Viewer {
  const { ctx, mount } = options
  return new Viewer(ctx).mount(getElement(mount))
}

export class Viewer {
  ctx: WebGLContext
  animation: Animation

  constructor(ctx: WebGLContext) {
    this.ctx = ctx
    this.animation = createAnimation(ctx)
  }

  mount(container: HTMLElement): this {
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
