import type { NeuronNode, WebGLContext } from "@/types"
import { getElement } from "@/utils"
import {
  Object3D,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three"
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

    // enable damping
    const controls = new OrbitControls(camera, el)
    controls.enableDamping = true
    controls.update()
    animateEvents.push(() => controls.update())

    // enable auto rotate
    enableAutoRotate()
  }

  // auto rotate
  let autoRotateEvent: (() => void) | null = null
  function enableAutoRotate(angle = 0.001, axis = new Vector3(-1, 1, 1)) {
    if (!autoRotateEvent) {
      disableAutoRotate()
    }

    autoRotateEvent = () => root.rotateOnAxis(axis, angle)
    animateEvents.push(autoRotateEvent)
  }

  function disableAutoRotate() {
    if (!autoRotateEvent) {
      return
    }

    const index = animateEvents.indexOf(autoRotateEvent)
    animateEvents.splice(index, 1)
    autoRotateEvent = null
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
