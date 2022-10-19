import { WebGLContext } from "./webgl"
import { getColorRgbHex } from "./utils"

export type SWC = Record<string, NeuronNode>

export type NeuronNode = {
  id: number
  type: NeuronType
  x: number
  y: number
  z: number
  radius: number
  parent: number | null
}

export enum NeuronType {
  undefined,
  soma,
  axon,
  basalDendrite,
  apicalDendrite,

  // 5+: custom
  // Standardized swc files (www.neuromorpho.org)

  /**
   * CNIC data
   */
  forkPoint,

  /**
   * CNIC data
   */
  endPoint,
}

export function createNeuron(ctx: WebGLContext, record: SWC) {
  Reflect.ownKeys(record).map((key) => {
    const node = record[key as string]
    const ctxNode = {
      x: node.x,
      y: node.y,
      z: node.z,
      radius: node.radius,
      color: getColorRgbHex(node.type),
    }
    ctx.createNode(ctxNode)

    const parentId = node.parent
    if (!parentId) {
      return
    }

    const parent = record[parentId]
    if (!parent) {
      throw new Error("Invalid parent node")
    }

    const ctxParentNode = {
      x: parent.x,
      y: parent.y,
      z: parent.z,
      radius: parent.radius,
      color: getColorRgbHex(parent.type),
    }
    ctx.createConnect(ctxParentNode, ctxNode)
  })
}
