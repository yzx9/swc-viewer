import { createViewer } from "@/createViewer"

const viewer = createViewer()
  .setSize(window.innerWidth, window.innerHeight)
  .mount("#container")
  .animate()
