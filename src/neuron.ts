import { getColorRgbHex } from "./utils"
import { WebGLContext } from "./webgl"

type Nodes = Record<string, NeuronNode>

export type Neuron = {
  addTo(ctx: WebGLContext): Neuron
  shift(x: number, y: number, z: number): void
}

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

export function loadSWC(swc: string, shiftOrigin: boolean = true): Neuron {
  const nodes = parseSWC(swc)
  const neuron = new _Neuron(nodes)

  if (shiftOrigin) {
    const { x, y, z } = nodes["1"]
    neuron.shift(-x, -y, -z)
  }

  return neuron
}

class _Neuron {
  nodes: Record<string, NeuronNode>

  constructor(nodes: Record<string, NeuronNode>) {
    this.nodes = nodes
  }

  addTo(ctx: WebGLContext): this {
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
      ctx.createConnect(ctxParentNode, ctxNode)
    })

    return this
  }

  shift(x: number, y: number, z: number) {
    Reflect.ownKeys(this.nodes).map((key) => {
      const node = this.nodes[key as string]
      node.x += x
      node.y += y
      node.z += z
    })
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
