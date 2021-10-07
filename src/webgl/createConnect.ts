import {
  getColorRgbHex,
  getEulerDistance,
  getMidpoint,
  getVertex,
} from "@/utils"
import {
  CylinderGeometry,
  Event,
  Mesh,
  ShaderMaterial,
  Object3D,
  Color,
  Vector3,
} from "three"
import { NeuronNode } from "../types"

export function createConnect(
  parent: NeuronNode,
  child: NeuronNode
): Object3D<Event> {
  const distance = getEulerDistance(parent, child)

  const geometry = new CylinderGeometry(
    parent.radius,
    child.radius,
    distance,
    32,
    8,
    true
  )

  const color1 = getColorRgbHex(child.structure)
  const color2 = getColorRgbHex(parent.structure)
  const material = new ShaderMaterial({
    uniforms: {
      color1: {
        value: new Color(color1),
      },
      color2: {
        value: new Color(color2),
      },
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

  return object
}
