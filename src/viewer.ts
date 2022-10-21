import { Animation, createAnimation } from "./animations"
import { Neuron } from "./neuron"
import { getElement } from "./utils"
import { WebGLContext } from "./webgl"

type Remover = () => void

export function createViewer(options: {
  ctx: WebGLContext
  mount: string | Element
}): Viewer {
  const { ctx, mount } = options
  return new Viewer(ctx).mount(getElement(mount)).animate()
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

  animate(): this {
    this.animation.update()
    return this
  }

  add(neuron: Neuron): Remover {
    return neuron.addTo(this.ctx)
  }
}
