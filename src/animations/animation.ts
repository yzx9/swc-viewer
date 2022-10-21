import { WebGLContext } from "../webgl"

export type AnimateEvent = (ctx: WebGLContext) => void
export type AnimateEventRemover = () => void

export function createAnimation(ctx: WebGLContext): Animation {
  return new Animation(ctx)
}

export class Animation {
  ctx: WebGLContext
  events: AnimateEvent[] = []

  constructor(ctx: WebGLContext) {
    this.ctx = ctx
  }

  update(): void {
    requestAnimationFrame(this.update.bind(this))
    this.events.forEach((event) => event(this.ctx))
    this.ctx.update()
  }

  use(event: AnimateEvent): AnimateEventRemover {
    this.events.push(event)
    return () => this.remove(event)
  }

  remove(event: AnimateEvent): void {
    const index = this.events.indexOf(event)
    if (index === -1) {
      return
    }

    this.events.splice(index, 1)
  }
}
