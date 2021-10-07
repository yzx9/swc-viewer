import { NeuronNode } from "@/types"

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

export function parseSWC(content: string): Record<string, NeuronNode> {
  const map = {} as Record<string, NeuronNode>

  content.split("\n").forEach((e) => {
    const match = e.match(pattern)
    if (match) {
      const id = Number.parseInt(match[1], 10)
      const parent = Number.parseInt(match[7], 10)

      map[id] = {
        id,
        structure: Number.parseInt(match[2], 10),
        x: Number.parseFloat(match[3]),
        y: Number.parseFloat(match[4]),
        z: Number.parseFloat(match[5]),
        radius: Number.parseFloat(match[6]),
        parent: parent !== -1 ? parent : null,
      }
    }
  })

  return map
}
