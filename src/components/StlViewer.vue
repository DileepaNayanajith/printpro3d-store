<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

const props = defineProps<{ file: File | null; color: string }>()
const emit = defineEmits<{
  dimensions: [value: { x: number; y: number; z: number } | null]
  metrics: [value: { volume: number; surfaceArea: number; triangles: number } | null]
}>()
const container = ref<HTMLElement | null>(null)
const error = ref('')
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let controls: OrbitControls | null = null
let mesh: THREE.Mesh | null = null
let animationId = 0
let resizeObserver: ResizeObserver | null = null
let viewportSize = ''

const resetView = () => {
  if (!camera || !controls || !mesh) return
  if (container.value && renderer) {
    const { clientWidth: width, clientHeight: height } = container.value
    renderer.setSize(width, height, false)
    camera.aspect = width / Math.max(height, 1)
  }
  const box = new THREE.Box3().setFromObject(mesh)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const sphere = box.getBoundingSphere(new THREE.Sphere())
  const maxDimension = Math.max(size.x, size.y, size.z) || 100
  const verticalFov = THREE.MathUtils.degToRad(camera.fov)
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect)
  const limitingFov = Math.min(verticalFov, horizontalFov)
  const distance = (sphere.radius / Math.sin(limitingFov / 2)) * 1.25
  camera.near = Math.max(distance / 1000, .01)
  camera.far = distance * 100
  camera.updateProjectionMatrix()
  const viewDirection = new THREE.Vector3(1, .72, 1.15).normalize()
  camera.position.copy(center).addScaledVector(viewDirection, distance)
  camera.lookAt(center)
  controls.dispose()
  controls = new OrbitControls(camera, renderer!.domElement)
  controls.enableDamping = false
  controls.target.copy(center)
  controls.minDistance = Math.max(maxDimension * .2, .1)
  controls.maxDistance = distance * 8
  controls.update()
  controls.saveState()
  controls.enableDamping = true
  renderer?.render(scene!, camera)
}

const initViewer = async () => {
  await nextTick()
  if (!container.value || renderer) return
  scene = new THREE.Scene()
  scene.background = new THREE.Color('#0f172a')
  camera = new THREE.PerspectiveCamera(45, 1, .1, 100000)
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  container.value.appendChild(renderer.domElement)
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  scene.add(new THREE.HemisphereLight(0xffffff, 0x172554, 2.2))
  const key = new THREE.DirectionalLight(0xffffff, 2.8)
  key.position.set(4, 7, 5); key.castShadow = true; scene.add(key)
  const grid = new THREE.GridHelper(400, 20, 0x22d3ee, 0x334155)
  grid.position.y = 0; scene.add(grid)
  resizeObserver = new ResizeObserver(() => {
    if (!container.value || !renderer || !camera) return
    const { clientWidth: width, clientHeight: height } = container.value
    renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix()
    const nextSize = `${width}x${height}`
    if (mesh && nextSize !== viewportSize) requestAnimationFrame(resetView)
    viewportSize = nextSize
  })
  resizeObserver.observe(container.value)
  const animate = () => { animationId = requestAnimationFrame(animate); controls?.update(); if (scene && camera) renderer?.render(scene, camera) }
  animate()
}

const loadFile = async (file: File | null) => {
  error.value = ''
  emit('dimensions', null)
  emit('metrics', null)
  if (!file) return
  await initViewer()
  try {
    const buffer = await file.arrayBuffer()
    const geometry = new STLLoader().parse(buffer)
    geometry.computeVertexNormals(); geometry.center(); geometry.computeBoundingBox()
    const positions = geometry.getAttribute('position')
    let signedVolume = 0
    let surfaceArea = 0
    const a = new THREE.Vector3()
    const b = new THREE.Vector3()
    const c = new THREE.Vector3()
    const edge1 = new THREE.Vector3()
    const edge2 = new THREE.Vector3()
    const volumeCross = new THREE.Vector3()
    for (let index = 0; index < positions.count; index += 3) {
      a.fromBufferAttribute(positions, index)
      b.fromBufferAttribute(positions, index + 1)
      c.fromBufferAttribute(positions, index + 2)
      signedVolume += a.dot(volumeCross.copy(b).cross(c)) / 6
      edge1.subVectors(b, a)
      edge2.subVectors(c, a)
      surfaceArea += edge1.cross(edge2).length() / 2
    }
    emit('metrics', { volume: Math.abs(signedVolume), surfaceArea, triangles: Math.floor(positions.count / 3) })
    if (mesh && scene) { scene.remove(mesh); mesh.geometry.dispose(); (mesh.material as THREE.Material).dispose() }
    mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: props.color, roughness: .45, metalness: .08 }))
    mesh.rotation.x = -Math.PI / 2
    mesh.updateMatrixWorld(true)
    const rotatedBox = new THREE.Box3().setFromObject(mesh)
    const rotatedCenter = rotatedBox.getCenter(new THREE.Vector3())
    mesh.position.set(-rotatedCenter.x, -rotatedBox.min.y + .5, -rotatedCenter.z)
    mesh.updateMatrixWorld(true)
    mesh.castShadow = true; mesh.receiveShadow = true; scene?.add(mesh)
    const originalBox = geometry.boundingBox
    if (originalBox) {
      const size = originalBox.getSize(new THREE.Vector3())
      emit('dimensions', { x: size.x, y: size.y, z: size.z })
    }
    resetView()
    requestAnimationFrame(resetView)
  } catch { error.value = 'This STL file could not be previewed. Please check that the file is valid.' }
}

watch(() => props.file, loadFile, { immediate: true })
watch(() => props.color, value => { if (mesh) (mesh.material as THREE.MeshStandardMaterial).color.set(value) })
onBeforeUnmount(() => { cancelAnimationFrame(animationId); resizeObserver?.disconnect(); controls?.dispose(); renderer?.dispose(); mesh?.geometry.dispose(); (mesh?.material as THREE.Material | undefined)?.dispose() })
defineExpose({ resetView })
</script>

<template>
  <div class="relative h-full min-h-[420px] overflow-hidden rounded-[1.5rem] bg-slate-900">
    <div ref="container" class="absolute inset-0"></div>
    <div v-if="!file" class="absolute inset-0 grid place-items-center p-8 text-center"><div><div class="mx-auto grid h-20 w-20 place-items-center rounded-full border border-dashed border-cyan-400/40 bg-cyan-400/10 text-3xl">3D</div><p class="mt-5 font-bold">Your STL preview will appear here</p><p class="mt-2 text-sm text-slate-500">Rotate with drag · Zoom with scroll</p></div></div>
    <div v-if="error" class="absolute inset-x-4 bottom-4 rounded-xl bg-rose-500 px-4 py-3 text-sm font-bold text-white">{{ error }}</div>
  </div>
</template>
