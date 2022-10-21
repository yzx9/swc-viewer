import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Object3D,
  Vector3,
} from "three"
import { ThreeContext } from "./ThreeContext"
import { Node, WebGLContext } from "./webglContext"

const DoNothing = () => {}

export function createThreeLineContext(
  options: { alpha?: boolean } = {}
): WebGLContext {
  const { alpha = false } = options
  return new ThreeLineContext({ alpha })
}

class ThreeLineContext extends ThreeContext implements WebGLContext {
  createNode(node: Node): () => void {
    return DoNothing
  }

  createConnect(parent: Node, child: Node): () => void {
    const material = new LineBasicMaterial({ color: parent.color })
    const points = [
      new Vector3(parent.x, parent.y, parent.z),
      new Vector3(child.x, child.y, child.z),
    ]
    const geometry = new BufferGeometry().setFromPoints(points)
    const line = new Line(geometry, material)
    this.root.add(line)

    return () => this.root.remove(line)
  }
}
