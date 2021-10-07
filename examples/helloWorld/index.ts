import { createViewer } from "@/createViewer"
import { test2 } from "./test"

const viewer = createViewer().mount("#container").load(test2).animate()
