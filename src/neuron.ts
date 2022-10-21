import { getColorRgbHex } from "./utils"
import { WebGLContext } from "./webgl"

type Remover = () => void
type Nodes = Record<string, NeuronNode>

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

export function loadSWC(
  swc: string,
  options: { shiftOrigin?: boolean } = {}
): Neuron {
  const { shiftOrigin = true } = options

  const nodes = parseSWC(swc)
  const neuron = new Neuron(nodes)

  if (shiftOrigin) {
    neuron.shiftOrigin()
  }

  return neuron
}

export class Neuron {
  nodes: Record<string, NeuronNode>

  constructor(nodes: Record<string, NeuronNode>) {
    this.nodes = nodes
  }

  addTo(ctx: WebGLContext): Remover {
    const removers: (() => void)[] = []
    Reflect.ownKeys(this.nodes).map((key) => {
      const node = this.nodes[key as string]
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

      const parent = this.nodes[parentId]
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

      removers.push(ctx.createConnect(ctxParentNode, ctxNode))
    })

    return () => removers.forEach((remove) => remove())
  }

  shift(x: number, y: number, z: number): void {
    Reflect.ownKeys(this.nodes).map((key) => {
      const node = this.nodes[key as string]
      node.x += x
      node.y += y
      node.z += z
    })
  }

  rotate(T: number[][]): void {
    if (T.length === 3 && T.every((a) => a.length === 3)) {
      Reflect.ownKeys(this.nodes).map((key) => {
        const node = this.nodes[key as string]
        const { x, y, z } = node
        node.x = T[0][0] * x + T[0][1] * y + T[0][2] * z
        node.y = T[1][0] * x + T[1][1] * y + T[1][2] * z
        node.z = T[2][0] * x + T[2][1] * y + T[2][2] * z
      })
    } else if (T.length === 4 && T.every((a) => a.length === 4)) {
      throw Error("Not implement")
    } else {
      throw Error("Invalid transformation matrix")
    }
  }

  shiftOrigin(): void {
    const { x, y, z } = this.nodes["1"]
    this.shift(-x, -y, -z)
  }
}

const float = "-?\\d*(?:\\.\\d+)?"
const pattern = new RegExp(
  "^[ \\t]*(" +
    [
      "\\d+", // index
      "\\d+", // type
      float, // x
      float, // y
      float, // z
      float, // radius
      "-1|\\d+", // parent
    ].join(")[ \\t]+(") +
    ")[ \\t]*\\r?$",
  "m"
)

function parseSWC(content: string): Nodes {
  const nodes = {} as Nodes

  content.split("\n").forEach((e) => {
    const match = e.match(pattern)
    if (match) {
      const id = Number.parseInt(match[1], 10)
      const parent = Number.parseInt(match[7], 10)

      nodes[id] = {
        id,
        type: Number.parseInt(match[2], 10),
        x: Number.parseFloat(match[3]),
        y: Number.parseFloat(match[4]),
        z: Number.parseFloat(match[5]),
        radius: Number.parseFloat(match[6]),
        parent: parent !== -1 ? parent : null,
      }
    }
  })

  return nodes
}
