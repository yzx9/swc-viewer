import {
  Color,
  CylinderGeometry,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from "three"
import { getEulerDistance, getMidpoint, getVertex } from "../utils"
import { ThreeContext } from "./ThreeContext"
import { Node, WebGLContext } from "./webglContext"

export function createThreeGeometryContext(
  options: {
    alpha?: boolean
  } = {}
): WebGLContext {
  const { alpha = false } = options
  return new ThreeGeometryContext({ alpha })
}

class ThreeGeometryContext extends ThreeContext implements WebGLContext {
  createNode(node: Node): () => void {
    const geometry = new SphereGeometry(node.radius)
    const material = new MeshBasicMaterial({ color: node.color })
    const object = new Mesh(geometry, material)
    object.position.set(node.x, node.y, node.z)
    this.root.add(object)
    return () => this.root.remove(object)
  }

  createConnect(parent: Node, child: Node): () => void {
    const distance = getEulerDistance(parent, child)

    const geometry = new CylinderGeometry(
      parent.radius,
      child.radius,
      distance,
      32,
      8,
      true
    )

    const material = new ShaderMaterial({
      uniforms: {
        color1: { value: new Color(child.color) },
        color2: { value: new Color(parent.color) },
      },
      vertexShader: `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
      `,
      fragmentShader: `
  uniform vec3 color1;
  uniform vec3 color2;
  
  varying vec2 vUv;
  
  void main() {
    gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
  }
      `,
    })
    const object = new Mesh(geometry, material)

    const midpoint = getMidpoint(parent, child)
    object.position.set(midpoint.x, midpoint.y, midpoint.z)

    const vec = getVertex(child, parent)
    object.quaternion.setFromUnitVectors(
      new Vector3(0, 1, 0),
      new Vector3(vec.x, vec.y, vec.z).normalize()
    )
    // geometry.lookAt(new Vector3(0, 0, 0))

    this.root.add(object)
    return () => this.root.remove(object)
  }
}
