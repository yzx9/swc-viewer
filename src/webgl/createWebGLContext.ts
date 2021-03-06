import type { NeuronNode, WebGLContext } from "@/types"
import { getElement } from "@/utils"
import { Group, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { createConnect as _createConnect } from "./createConnect"
import { createNode as _createNode } from "./createNode"

export function createWebGLContext(): WebGLContext {
  const scene = new Scene()
  const camera = new PerspectiveCamera()
  const renderer = new WebGLRenderer()
  const root = new Group()
  const animateEvents: (() => void)[] = []

  scene.add(root)

  return {
    mount(container) {
      const el = getElement(container)
      el.appendChild(renderer.domElement)

      // update camera
      const { clientWidth: width, clientHeight: height } = el
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.position.set(0, 0, 1000)
      camera.updateProjectionMatrix()

      // enable damping
      const controls = new OrbitControls(camera, el)
      controls.enableDamping = true
      controls.update()
      animateEvents.push(() => controls.update())

      // render event which must be last one
      animateEvents.push(() => renderer.render(scene, camera))
    },
    rotate(axis, angle) {
      root.rotateOnAxis(new Vector3(axis.x, axis.y, axis.z), angle)
    },
    update() {
      animateEvents.forEach((event) => event())
    },
    createNode(node) {
      const object = _createNode(node)
      root.add(object)
    },
    createConnect(parent: NeuronNode, child: NeuronNode) {
      const connect = _createConnect(parent, child)
      root.add(connect)
    },
  }
}
