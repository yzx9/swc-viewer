type Event = () => void

type RemoveEventHandler = () => void

export interface EventControl {
  events: Event[]
  register(event: Event): RemoveEventHandler
  remove(event: Event): void
}
