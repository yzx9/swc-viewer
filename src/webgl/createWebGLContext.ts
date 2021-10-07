import type { NeuronNode, WebGLContext } from "@/types"
import { getElement } from "@/utils"
import { Object3D, PerspectiveCamera, Scene, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { createConnect as _createConnect } from "./createConnect"
import { createNode as _createNode } from "./createNode"

export function createWebGLContext(): WebGLContext {
  // init
  const scene = new Scene()
  const camera = new PerspectiveCamera()
  const renderer = new WebGLRenderer()
  const root = new Object3D()
  const animateEvents: (() => void)[] = []
  scene.add(root)

  function mount(container: string | Element) {
    const el = getElement(container)
    el.appendChild(renderer.domElement)

    // update camera
    const { clientWidth: width, clientHeight: height } = el
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.position.set(0, 0, 1000)
    camera.updateProjectionMatrix()

    // enable rotate and damping
    const controls = new OrbitControls(camera, el)
    controls.autoRotate = true
    controls.enableDamping = true
    controls.update()
    animateEvents.push(() => controls.update())
  }

  // enable animate, rotate and damping
  function animate() {
    requestAnimationFrame(animate)
    animateEvents.forEach((event) => event())
    renderer.render(scene, camera)
  }

  function createNode(node: NeuronNode) {
    const object = _createNode(node)
    root.add(object) // TODO: parent
  }

  function createConnect(from: NeuronNode, to: NeuronNode) {
    const connect = _createConnect(from, to)
    // TODO
  }

  return {
    mount,
    animate,
    createNode,
    createConnect,
  }
}
