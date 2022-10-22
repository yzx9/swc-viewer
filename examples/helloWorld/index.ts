import { createThreeGeometryContext, createViewer, loadSWC } from "../../src"
import { test2 } from "./test"

const viewer = createViewer({
  mount: "#container",
  ctx: createThreeGeometryContext(),
})

viewer.add(loadSWC(test2))
