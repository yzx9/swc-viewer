import { AnimateEvent } from "./animation"

export type Axis = { x: number; y: number; z: number }

export function createAutoRotateAnimation(
  axis: Axis,
  angle: number
): AnimateEvent {
  return (ctx) => ctx.rotate(axis, angle)
}
