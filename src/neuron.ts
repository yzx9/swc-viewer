import { NeuronNode } from "./swc"
import { WebGLContext } from "./webgl"

export function createNeuron(
  ctx: WebGLContext,
  record: Record<string, NeuronNode>
) {
  Reflect.ownKeys(record).map((key) => {
    const node = record[key as string]
    ctx.createNode(node)

    const parentId = node.parent
    if (!parentId) {
      return
    }

    const parent = record[parentId]
    if (!parent) {
      throw new Error("Invalid parent node")
    }

    ctx.createConnect(record[parentId], node)
  })
}
