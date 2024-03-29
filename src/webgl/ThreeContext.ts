import { Group, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Node, WebGLContext } from "./webglContext"

export class ThreeContext implements WebGLContext {
  scene = new Scene()
  camera = new PerspectiveCamera()
  renderer: WebGLRenderer
  animateEvents: (() => void)[] = []
  root = new Group()

  constructor(options: { alpha: boolean }) {
    const { alpha } = options
    this.renderer = new WebGLRenderer({ alpha })
    this.scene.add(this.root)
  }

  mount(container: HTMLElement) {
    container.appendChild(this.renderer.domElement)

    // update camera
    const { clientWidth: width, clientHeight: height } = container
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.position.set(0, 0, 100)
    this.camera.updateProjectionMatrix()

    // enable damping
    const controls = new OrbitControls(this.camera, container)
    controls.enableDamping = true
    controls.update()
    this.animateEvents.push(() => controls.update())

    // render event which must be last one
    this.animateEvents.push(() => this.renderer.render(this.scene, this.camera))
  }

  update() {
    this.animateEvents.forEach((event) => event())
  }

  createNode(node: Node): () => void {
    throw new Error("Not Implement")
  }

  createConnect(parent: Node, child: Node): () => void {
    throw new Error("Not Implement")
  }

  rotate(axis: { x: number; y: number; z: number }, angle: number): void {
    this.root.rotateOnAxis(new Vector3(axis.x, axis.y, axis.z), angle)
  }

  setCameraPosition(x: number, y: number, z: number): void {
    this.camera.position.set(x, y, z)
    this.camera.updateProjectionMatrix()
  }
}
