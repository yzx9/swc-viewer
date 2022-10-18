import type { EventControl, WebGLContext } from "./types"

export function createAutoRotateControl(
  animateEvents: EventControl,
  ctx: WebGLContext
) {
  // auto rotate
  let handleRemove: (() => void) | null = null

  function enableAutoRotate(
    axis: { x: number; y: number; z: number },
    angle: number
  ) {
    if (!handleRemove) {
      disableAutoRotate()
    }

    handleRemove = animateEvents.register(() => ctx.rotate(axis, angle))
  }

  function disableAutoRotate() {
    if (!handleRemove) {
      return
    }

    handleRemove()
    handleRemove = null
  }

  return { enableAutoRotate, disableAutoRotate }
}
