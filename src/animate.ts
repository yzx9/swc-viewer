import { WebGLContext } from "./types"

type Event = () => void

type RemoveEventHandler = () => void

export interface EventControl {
  events: Event[]
  register(event: Event): RemoveEventHandler
  remove(event: Event): void
}

export function createAnimate(ctx: WebGLContext) {
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

  return {
    animate,
    animateEventControl,
  }
}
