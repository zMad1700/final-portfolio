<template>
  <v-app>
    <Transition name="mad-loader-fade">
      <div v-if="isLoading" class="mad-loader" role="status" aria-label="Loading portfolio">
        <div class="mad-loader-content">
          <p class="mad-loader-kicker">KENNETH LANCE JOROLAN <span>· PORTFOLIO</span></p>
          <h1 aria-hidden="true"><span v-for="(letter, index) in ['M', 'A', 'D']" :key="letter" :style="{ '--letter-index': index }">{{ letter }}</span><i>.</i></h1>
          <div class="mad-loader-track" aria-hidden="true"><span></span></div>
          <p class="mad-loader-note">A MISFIT MIND, MAKING THINGS FOR THE WEB</p>
        </div>
      </div>
    </Transition>
    <ParticleField />
    <router-view v-slot="{ Component, route }">
      <Transition
        mode="out-in"
        :css="false"
        @leave="onRouteLeave"
        @enter="onRouteEnter"
        @leave-cancelled="onRouteTransitionCancelled"
        @enter-cancelled="onRouteTransitionCancelled"
      >
        <component :is="Component" :key="route.name" />
      </Transition>
    </router-view>
    <div ref="routeCurtain" class="route-curtain" aria-hidden="true"><span>MAD.</span></div>
    <SettingsControl />
  </v-app>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import ParticleField from './components/ParticleField.vue'
import SettingsControl from './components/SettingsControl.vue'

const isLoading = ref(true)
const routeCurtain = ref(null)
let loaderTimer
let routeTimer
let routeTimeline
let routeCompletion

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function cancelRouteTransition(resetCurtain = true) {
  routeTimeline?.kill()
  routeTimeline = null
  window.clearTimeout(routeTimer)
  routeTimer = undefined
  const complete = routeCompletion
  routeCompletion = null
  complete?.()
  if (resetCurtain && routeCurtain.value) gsap.set(routeCurtain.value, { yPercent: -105, autoAlpha: 0 })
}

function animateRoute(direction, element, done) {
  cancelRouteTransition(false)
  const curtain = routeCurtain.value
  let settled = false
  const complete = () => {
    if (settled) return
    settled = true
    window.clearTimeout(routeTimer)
    routeTimer = undefined
    routeCompletion = null
    done()
    if (direction === 'enter') {
      const heading = element.querySelector('h1')
      if (heading) {
        if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
        heading.focus({ preventScroll: true })
      }
    }
  }

  routeCompletion = complete
  if (!curtain || reducedMotion()) {
    if (curtain) gsap.set(curtain, { yPercent: -105, autoAlpha: 0 })
    complete()
    return
  }

  try {
    if (direction === 'leave') {
      gsap.set(curtain, { yPercent: -105, autoAlpha: 1 })
      routeTimeline = gsap.timeline({ onComplete: complete })
        .to(curtain, { yPercent: 0, duration: 0.34, ease: 'power3.inOut' })
        .to(element, { y: -7, opacity: 0.86, duration: 0.24, ease: 'power2.in' }, 0.12)
    } else {
      gsap.set(curtain, { yPercent: 0, autoAlpha: 1 })
      routeTimeline = gsap.timeline({
        onComplete: () => {
          gsap.set(curtain, { yPercent: -105, autoAlpha: 0 })
          complete()
        },
      })
        .fromTo(element, { y: 9, opacity: 0.9 }, { y: 0, opacity: 1, duration: 0.38, ease: 'power2.out' }, 0)
        .to(curtain, { yPercent: -105, duration: 0.42, ease: 'power3.inOut' }, 0)
    }

    routeTimer = window.setTimeout(() => {
      routeTimeline?.kill()
      if (direction === 'enter') gsap.set(curtain, { yPercent: -105, autoAlpha: 0 })
      else gsap.set(curtain, { yPercent: 0, autoAlpha: 1 })
      complete()
    }, 1100)
  } catch {
    gsap.set(curtain, { yPercent: -105, autoAlpha: 0 })
    complete()
  }
}

function onRouteLeave(element, done) {
  animateRoute('leave', element, done)
}

function onRouteEnter(element, done) {
  animateRoute('enter', element, done)
}

function onRouteTransitionCancelled() {
  cancelRouteTransition(true)
}

onMounted(() => {
  if (routeCurtain.value) gsap.set(routeCurtain.value, { yPercent: -105, autoAlpha: 0 })
  loaderTimer = window.setTimeout(() => { isLoading.value = false }, 4550)
})

onBeforeUnmount(() => {
  cancelRouteTransition(true)
  window.clearTimeout(loaderTimer)
})
</script>

<style>
.mad-loader {
  position: fixed;
  z-index: 20000;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: #f6f1e5;
  background:
    radial-gradient(ellipse at 50% 45%, rgb(255 255 255 / 4%), transparent 48%),
    #080808;
}
.mad-loader::before,
.mad-loader::after {
  position: absolute;
  width: min(68vw, 680px);
  aspect-ratio: 1;
  border: 1px solid rgb(255 255 255 / 9%);
  border-radius: 50%;
  content: '';
  animation: mad-loader-orbit 8s ease-in-out infinite alternate;
}
.mad-loader::after { width: min(48vw, 480px); animation-delay: -4s; }
.mad-loader-content { position: relative; z-index: 1; width: min(520px, calc(100% - 48px)); text-align: center; }
.mad-loader-kicker, .mad-loader-note { color: #aaa59d; font: 9px var(--mono, monospace); letter-spacing: .16em; }
.mad-loader-kicker { margin: 0 0 15px; }
.mad-loader-kicker span { color: #f6f1e5; }
.mad-loader-content h1 { display: flex; justify-content: center; margin: 0; font: 800 clamp(100px, 25vw, 190px)/.9 var(--display, sans-serif); letter-spacing: -.1em; }
.mad-loader-content h1 span { display: inline-block; opacity: 0; animation: mad-letter-arrive .75s cubic-bezier(.2,.75,.25,1) forwards; animation-delay: calc(var(--letter-index) * 120ms); }
.mad-loader-content h1 i { align-self: flex-start; margin: .07em 0 0 .015em; color: #f6f1e5; font: italic 400 .68em/1 Georgia, serif; opacity: 0; animation: mad-letter-arrive .55s ease-out .42s forwards; }
.mad-loader-track { width: min(190px, 58%); height: 1px; margin: 28px auto 15px; overflow: hidden; background: rgb(255 255 255 / 17%); }
.mad-loader-track span { display: block; width: 38%; height: 100%; background: #f6f1e5; animation: mad-loader-progress 1.25s cubic-bezier(.5,0,.3,1) infinite; }
.mad-loader-note { margin: 0; font-size: 7px; letter-spacing: .11em; }
.mad-loader-fade-leave-active { transition: opacity .45s ease, visibility .45s ease; }
.mad-loader-fade-leave-to { visibility: hidden; opacity: 0; }
.route-curtain {
  position: fixed;
  z-index: 15000;
  inset: 0;
  display: grid;
  place-items: center;
  visibility: hidden;
  overflow: hidden;
  color: #f5eefc;
  background: radial-gradient(ellipse at 50% 45%, #572866 0, #321a3b 42%, #21112b 100%);
  pointer-events: none;
  will-change: transform;
}
.route-curtain::after { position: absolute; top: 50%; left: 12%; width: 76%; height: 1px; background: linear-gradient(90deg, transparent, rgb(227 206 243 / 35%), transparent); content: ''; }
.route-curtain span { color: rgb(245 238 252 / 78%); font: 700 11px var(--mono, monospace); letter-spacing: .28em; }
@keyframes mad-letter-arrive { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes mad-loader-progress { from { transform: translateX(-110%); } to { transform: translateX(280%); } }
@keyframes mad-loader-orbit { from { transform: scale(.92) rotate(-12deg); opacity: .35; } to { transform: scale(1.06) rotate(12deg); opacity: .8; } }
@media (prefers-reduced-motion: reduce) {
  .mad-loader::before, .mad-loader::after, .mad-loader-content h1 span, .mad-loader-content h1 i, .mad-loader-track span { animation: none; }
  .mad-loader-content h1 span, .mad-loader-content h1 i { opacity: 1; }
  .mad-loader-fade-leave-active { transition-duration: .01ms; }
  .route-curtain { display: none; }
}
</style>
