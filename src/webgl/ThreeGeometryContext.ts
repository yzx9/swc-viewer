import {
  Color,
  CylinderGeometry,
  Event,
  Group,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { getElement, getEulerDistance, getMidpoint, getVertex } from "../utils"
import { Node, WebGLContext } from "./webglContext"

export function createThreeGeometryContext(
  options: {
    alpha?: boolean
  } = {}
): WebGLContext {
  const { alpha = false } = options
  return new ThreeGeometryContext({
    alpha,
  })
}

class ThreeGeometryContext implements WebGLContext {
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

  mount(container: string | Element) {
    const el = getElement(container)
    el.appendChild(this.renderer.domElement)

    // update camera
    const { clientWidth: width, clientHeight: height } = el
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.position.set(0, 0, 1000)
    this.camera.updateProjectionMatrix()

    // enable damping
    const controls = new OrbitControls(this.camera, el)
    controls.enableDamping = true
    controls.update()
    this.animateEvents.push(() => controls.update())

    // render event which must be last one
    this.animateEvents.push(() => this.renderer.render(this.scene, this.camera))
  }

  update() {
    this.animateEvents.forEach((event) => event())
  }

  createNode(node: Node) {
    const object = createNode(node)
    this.root.add(object)
  }

  createConnect(parent: Node, child: Node) {
    const connect = createConnect(parent, child)
    this.root.add(connect)
  }

  rotate(axis: { x: number; y: number; z: number }, angle: number) {
    this.root.rotateOnAxis(new Vector3(axis.x, axis.y, axis.z), angle)
  }
}

function createNode(node: Node): Object3D<Event> {
  const geometry = new SphereGeometry(node.radius)
  const material = new MeshBasicMaterial({
    color: node.color,
  })
  const object = new Mesh(geometry, material)
  object.position.set(node.x, node.y, node.z)
  return object
}

function createConnect(parent: Node, child: Node): Object3D<Event> {
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
      color1: {
        value: new Color(child.color),
      },
      color2: {
        value: new Color(parent.color),
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
