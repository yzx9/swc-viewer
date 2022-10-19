import { EventControl } from "./animate"
import { WebGLContext } from "./webgl"

export type Axis = { x: number; y: number; z: number }
export type AutoRotateControl = {
  enable(axis: Axis, angle: number): void
  disable(): void
}

class _AutoRotateControl {
  animateEvents: EventControl
  ctx: WebGLContext

  // auto rotate
  handleRemove: (() => void) | null = null

  constructor(animateEvents: EventControl, ctx: WebGLContext) {
    this.animateEvents = animateEvents
    this.ctx = ctx
  }

  enable(axis: Axis, angle: number) {
    if (!this.handleRemove) {
      this.disable()
    }

    this.handleRemove = this.animateEvents.register(() =>
      this.ctx.rotate(axis, angle)
    )
  }

  disable() {
    if (!this.handleRemove) {
      return
    }

    this.handleRemove()
    this.handleRemove = null
  }
}

export function createAutoRotateControl(
  animateEvents: EventControl,
  ctx: WebGLContext
) {
  return new _AutoRotateControl(animateEvents, ctx)
}
