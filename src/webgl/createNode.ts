import { NeuronNode } from "@/types"
import { getColorHex } from "@/utils"
import { Event, Mesh, MeshBasicMaterial, Object3D, SphereGeometry } from "three"

export function createNode(node: NeuronNode): Object3D<Event> {
  const geometry = new SphereGeometry(node.radius)
  const material = new MeshBasicMaterial({ color: getColorHex(node.structure) })
  const object = new Mesh(geometry, material)
  object.position.set(node.x, node.y, node.z)
  return object
}
