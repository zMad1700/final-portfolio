<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref(null)
let frameId
let resizeObserver
let context
let width = 0
let height = 0
let time = 0
let pointerX = 0
let pointerY = 0
let particles = []
let reducedMotion = false
let mediaQuery

function makeParticles() {
  const count = Math.min(1100, Math.max(440, Math.round((width * height) / 1500)))

  particles = Array.from({ length: count }, () => ({
    x: Math.random(),
    lane: Math.random() * 2 - 1,
    size: 0.35 + Math.random() * 1.05,
    phase: Math.random() * Math.PI * 2,
    speed: 0.0007 + Math.random() * 0.0013,
    brightness: 0.3 + Math.random() * 0.7,
    tint: Math.random(),
  }))
}

function resize() {
  if (!canvasRef.value) return
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
  width = window.innerWidth
  height = window.innerHeight
  canvasRef.value.width = Math.round(width * pixelRatio)
  canvasRef.value.height = Math.round(height * pixelRatio)
  canvasRef.value.style.width = `${width}px`
  canvasRef.value.style.height = `${height}px`
  context = canvasRef.value.getContext('2d', { alpha: true })
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  makeParticles()
  draw(time)
}

function draw(timestamp) {
  if (!context) return
  context.clearRect(0, 0, width, height)
  const centerY = height * 0.52 + pointerY * height * 0.018
  const amplitude = Math.min(height * 0.105, 108)

  for (const particle of particles) {
    const drift = reducedMotion ? 0 : timestamp * particle.speed
    const x = ((particle.x * width + drift) % (width + 20)) - 10
    const normalizedX = (x / width - 0.5) * 2
    const wave = Math.sin(normalizedX * 3.1 + time * 0.00045) * amplitude
      + Math.sin(normalizedX * 8.5 - time * 0.00026) * amplitude * 0.2
    const y = centerY + wave + particle.lane * (height * 0.14)
      + Math.sin(particle.phase + time * 0.0005) * 8
    const focus = Math.max(0, 1 - Math.abs(particle.lane) * 0.78)
    const shimmer = 0.72 + Math.sin(particle.phase + time * 0.0012) * 0.28
    const alpha = Math.min(0.47, (0.055 + focus * 0.24) * particle.brightness * shimmer)
    const radius = particle.size * (0.7 + focus * 0.55)

    if (y < -5 || y > height + 5) continue
    context.beginPath()
    context.fillStyle = particle.tint > 0.76
      ? `rgba(205, 176, 226, ${alpha})`
      : `rgba(245, 237, 252, ${alpha})`
    context.arc(x + pointerX * 9, y, radius, 0, Math.PI * 2)
    context.fill()
  }
}

function animate(timestamp) {
  time = timestamp
  draw(timestamp)
  if (!reducedMotion) frameId = window.requestAnimationFrame(animate)
}

function handlePointerMove(event) {
  pointerX = (event.clientX / width - 0.5) * 2
  pointerY = (event.clientY / height - 0.5) * 2
}

function handleMotionPreference(event) {
  reducedMotion = event.matches
  window.cancelAnimationFrame(frameId)
  if (reducedMotion) draw(time)
  else frameId = window.requestAnimationFrame(animate)
}

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion = mediaQuery.matches
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(document.documentElement)
  resize()
  if (!reducedMotion) frameId = window.requestAnimationFrame(animate)
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  mediaQuery.addEventListener('change', handleMotionPreference)
})

onUnmounted(() => {
  window.cancelAnimationFrame(frameId)
  resizeObserver?.disconnect()
  window.removeEventListener('pointermove', handlePointerMove)
  mediaQuery?.removeEventListener('change', handleMotionPreference)
})
</script>

<template>
  <canvas ref="canvasRef" class="particle-field" aria-hidden="true"></canvas>
</template>
