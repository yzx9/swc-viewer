import { PerspectiveCamera, Scene, WebGLRenderer } from "three"
import type { NeuronNode, WebGLContext } from "../types"
import { createNode as _createNode } from "./createNode"
import { createConnect as _createConnect } from "./createConnect"

export function createWebGLContext(): WebGLContext {
  const scene = new Scene()

  const camera = new PerspectiveCamera()
  camera.position.z = 1000

  const renderer = new WebGLRenderer()

  function mount(container: string | Element) {
    const element =
      typeof container === "string"
        ? globalThis.document.querySelector(container)
        : container

    if (!(element instanceof Element)) {
      throw new Error("Invalid container")
    }

    const { clientWidth: width, clientHeight: height } = element
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    element.appendChild(renderer.domElement)
  }

  const animateEvents: (() => void)[] = []
  function animate() {
    requestAnimationFrame(animate)

    for (let event of animateEvents) {
      event()
    }

    renderer.render(scene, camera)
  }

  function createNode(node: NeuronNode) {
    const object = _createNode(node)
    scene.add(object)
    animateEvents.push(() => {
      object.rotation.x += 0.001
      object.rotation.y += 0.001
    })
  }

  function createConnect(from: NeuronNode, to: NeuronNode) {
    const object = _createConnect(from, to)
    // TODO
  }

  return {
    mount,
    animate,
    createNode,
    createConnect,
  }
}
