import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const colors = [
  '#B6960B',
  '#B7413F',
  '#2E6F8E',
  '#AEAE9D',
  '#8D8496',
  '#B6AD46',
  '#B6868E',
  '#2F2E2F',
  '#068E76',
  '#6E9F8F',
]

const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width, sizes.height)
document.body.appendChild(renderer.domElement)
renderer.domElement.setAttribute('class', 'webgl')

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  1,
  500
)
camera.position.set(0, 0, 30)

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
})

const scene = new THREE.Scene()
const semicirclesGroup = new THREE.Group()
scene.add(semicirclesGroup)

const createSemicircle = semicircleFabricator()

const ring = createRing()
scene.add(ring)

const semicircleList: { mesh: THREE.Mesh; initialRotation: number }[] = []
const angleIncrement = (2 * Math.PI) / colors.length
for (let i = 0; i < colors.length; i++) {
  const initialRotation = angleIncrement * i
  const semicircle = createSemicircle(colors[i], initialRotation)

  semicirclesGroup.add(semicircle)

  semicircleList.push({
    mesh: semicircle,
    initialRotation,
  })
}

const animationObj = {
  radius: 0,
  semicircleAngle: 0,
  ringOpacity: 0,
  ringScale: 0.5,
}

const tl = gsap.timeline({
  repeat: -1,
})

// Animation
tl.to(animationObj, {
  radius: 7.5,
  semicircleAngle: Math.PI / 3,
  duration: 1,
  ease: 'power4.out',
  onUpdate: updateSemicircleAnimation,
})
tl.to(
  animationObj,
  {
    ringOpacity: 0.7,
    ringScale: 1,
    duration: 0.5,
    ease: 'elastic.out(1, 0.6)',
    onStart: function () {
      ring.material.color.set(colors[1])
    },
    onUpdate: updateRingAnimation,
    onComplete: function () {
      ring.material.opacity = 0
    },
  },
  '-=0.5'
)
tl.to(animationObj, {
  radius: 5,
  semicircleAngle: Math.PI / 2,
  duration: 1,
  ease: 'power4.out',
  onUpdate: updateSemicircleAnimation,
})
tl.to(animationObj, {
  radius: 4,
  semicircleAngle: 1.5 * Math.PI,
  duration: 1,
  ease: 'power4.out',
  onUpdate: updateSemicircleAnimation,
})
tl.to(
  animationObj,
  {
    ringOpacity: 0.7,
    ringScale: 1.25,
    duration: 1,
    ease: 'elastic.out(1, 0.6)',
    onStart: function () {
      ring.material.color.set(colors[0])
    },
    onUpdate: updateRingAnimation,
    onComplete: function () {
      ring.material.opacity = 0
    },
  },
  '-=0.8'
)
tl.to(animationObj, {
  radius: 5,
  semicircleAngle: Math.PI / 2,
  duration: 1,
  ease: 'power4.out',
  onUpdate: updateSemicircleAnimation,
})
tl.to(animationObj, {
  radius: 5,
  semicircleAngle: 0,
  duration: 1,
  ease: 'power4.out',
  onUpdate: updateSemicircleAnimation,
})

// Helper functions
function createRing() {
  const ringGeometry = new THREE.RingGeometry(1.8, 2, 32)
  const ringMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
  })
  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
  ring.material.opacity = 0

  return ring
}

function semicircleFabricator() {
  const shape = new THREE.Shape()
  shape.arc(0, 0, 5, 0, Math.PI, false)
  const geometry = new THREE.ShapeGeometry(shape)

  return function (color: string, angle: number) {
    const material = new THREE.MeshBasicMaterial({
      color,
      opacity: 0.4,
      transparent: true,
    })

    const semicircle = new THREE.Mesh(geometry, material)
    semicircle.rotation.z = angle

    return semicircle
  }
}

function updateSemicircleAnimation() {
  for (const { mesh, initialRotation } of semicircleList) {
    mesh.position.set(
      Math.cos(initialRotation) * animationObj.radius,
      Math.sin(initialRotation) * animationObj.radius,
      0
    )
    mesh.rotation.z = initialRotation + animationObj.semicircleAngle
  }
}

function updateRingAnimation() {
  ring.material.opacity = animationObj.ringOpacity
  ring.scale.set(
    animationObj.ringScale,
    animationObj.ringScale,
    animationObj.ringScale
  )
}

const clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  semicirclesGroup.rotation.z = elapsedTime

  requestAnimationFrame(animate)

  renderer.render(scene, camera)
}
animate()
