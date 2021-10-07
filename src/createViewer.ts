import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three"
import { identifyFunctions } from "./utils"

export function createViewer() {
  const scene = new Scene()
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  )

  const renderer = new WebGLRenderer()
  const animateEvents: (() => void)[] = []

  // create a box
  const geometry = new BoxGeometry()
  const material = new MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new Mesh(geometry, material)
  scene.add(cube)

  animateEvents.push(() => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
  })

  camera.position.z = 5

  const setSize = (width: number, height: number) =>
    renderer.setSize(width, height)

  const animate = () => {
    requestAnimationFrame(animate)

    for (let event of animateEvents) {
      event()
    }

    renderer.render(scene, camera)
  }

  const mount = (selectors: string) => {
    const element = globalThis.document.querySelector(selectors)

    if (!element) {
      throw new Error("Invalid container")
    }

    element.appendChild(renderer.domElement)
  }

  return identifyFunctions({
    setSize,
    mount,
    animate,
  })
}
