<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { galleryPhotos } from '../data/gallery'

gsap.registerPlugin(ScrollTrigger)
const paused = ref(false)
const activeIndex = ref(-1)
const activePhoto = computed(() => galleryPhotos[activeIndex.value] ?? null)
const galleryRoot = ref(null)
let previousBodyOverflow = ''
let flipContext
let flipTrigger

watch(paused, (isPaused) => {
  if (!flipTrigger) return
  if (isPaused) flipTrigger.disable(false)
  else flipTrigger.enable(false)
})

function toggleMotion() {
  paused.value = !paused.value
}

function openPhoto(photo) {
  activeIndex.value = galleryPhotos.findIndex((item) => item.id === photo.id)
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
}

function closePhoto() {
  activeIndex.value = -1
  document.body.style.overflow = previousBodyOverflow
}

function showNextPhoto() {
  activeIndex.value = (activeIndex.value + 1) % galleryPhotos.length
}

function showPreviousPhoto() {
  activeIndex.value = (activeIndex.value - 1 + galleryPhotos.length) % galleryPhotos.length
}

function handleViewerKeys(event) {
  if (activeIndex.value < 0) return
  if (event.key === 'Escape') closePhoto()
  if (event.key === 'ArrowRight') showNextPhoto()
  if (event.key === 'ArrowLeft') showPreviousPhoto()
}

onMounted(() => {
  window.addEventListener('keydown', handleViewerKeys)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  flipContext = gsap.context(() => {
    const frames = gsap.utils.toArray('.gallery-sequence:first-child .gallery-card-filled .gallery-image-frame')
    const orderedFrames = frames.slice(0, 5)
    const flips = gsap.timeline({
      scrollTrigger: {
        trigger: galleryRoot.value,
        start: 'top 92%',
        end: 'bottom 35%',
        scrub: 0.7,
        invalidateOnRefresh: true,
      },
    })
    flipTrigger = flips.scrollTrigger

    orderedFrames.forEach((frame, index) => {
      flips.fromTo(frame,
        { rotationY: 0, transformPerspective: 900 },
        {
          rotationY: 360,
          transformPerspective: 900,
          duration: 0.28,
          ease: 'none',
        },
        index * 0.3,
      )
    })
  }, galleryRoot.value)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleViewerKeys)
  document.body.style.overflow = previousBodyOverflow
  flipContext?.revert()
})
</script>

<template>
  <section id="gallery" ref="galleryRoot" class="photo-gallery section-pad" :class="{ 'gallery-paused': paused }">
    <div class="shell gallery-shell">
      <div class="section-heading gallery-heading">
        <div><p class="eyebrow"><span class="eyebrow-line"></span> MOMENTS & MAKING</p><h2>A little <em>gallery.</em></h2></div>
        <button class="gallery-motion-toggle" type="button" :aria-pressed="paused" @click="toggleMotion">
          <i class="mdi" :class="paused ? 'mdi-play' : 'mdi-pause'" aria-hidden="true"></i>{{ paused ? 'Play motion' : 'Pause motion' }}
        </button>
      </div>
      <div class="gallery-lane" role="button" tabindex="0" :aria-label="paused ? 'Resume moving photo gallery' : 'Pause moving photo gallery'" @click="toggleMotion" @keydown.enter.prevent="toggleMotion" @keydown.space.prevent="toggleMotion">
        <div class="gallery-track">
          <div v-for="copy in 2" :key="copy" class="gallery-sequence" :aria-hidden="copy === 2">
            <figure v-for="photo in galleryPhotos" :key="photo.id" class="gallery-card" :class="{ 'gallery-card-filled': photo.src }" role="button" tabindex="0" :aria-label="`View photo: ${photo.caption}`" @click.stop="openPhoto(photo)" @keydown.enter.stop.prevent="openPhoto(photo)" @keydown.space.stop.prevent="openPhoto(photo)">
              <div class="gallery-image-frame">
                <img v-if="photo.src" :src="photo.src" :alt="photo.alt || photo.caption" loading="lazy" />
                <div v-else class="gallery-empty-slot"><span class="gallery-plus" aria-hidden="true">+</span><span class="gallery-slot-number">{{ photo.id }}</span><small>ADD PHOTO</small></div>
                <span class="gallery-index">{{ photo.id }} / {{ String(galleryPhotos.length).padStart(2, '0') }}</span>
              </div>
              <figcaption>{{ photo.caption }}</figcaption>
            </figure>
          </div>
        </div>
      </div>
      <p class="gallery-note"><span>05</span> PHOTOS <i></i> MOVE AT YOUR OWN PACE</p>
    </div>

    <Teleport to="body">
      <div v-if="activePhoto" class="gallery-lightbox" role="dialog" aria-modal="true" :aria-label="activePhoto.caption" @click.self="closePhoto">
        <button class="lightbox-close" type="button" aria-label="Close photo viewer" @click="closePhoto"><i class="mdi mdi-close" aria-hidden="true"></i></button>
        <button class="lightbox-nav lightbox-previous" type="button" aria-label="Previous photo" @click="showPreviousPhoto"><i class="mdi mdi-chevron-left" aria-hidden="true"></i></button>
        <figure class="lightbox-figure">
          <img :src="activePhoto.src" :alt="activePhoto.alt" />
          <figcaption><span>{{ activePhoto.caption }}</span><small>{{ String(activeIndex + 1).padStart(2, '0') }} / {{ String(galleryPhotos.length).padStart(2, '0') }}</small></figcaption>
        </figure>
        <button class="lightbox-nav lightbox-next" type="button" aria-label="Next photo" @click="showNextPhoto"><i class="mdi mdi-chevron-right" aria-hidden="true"></i></button>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.photo-gallery { padding-top: 42px; padding-bottom: 105px; overflow: hidden; }
.gallery-shell { width: 100%; max-width: none; }
.gallery-heading { width: min(1180px, calc(100% - 112px)); margin: 0 auto 10px; }
.gallery-heading h2 { margin: 0; color: #f5eefc; font: 700 clamp(42px, 5vw, 62px)/.99 var(--display); letter-spacing: -.065em; }.gallery-heading h2 em { color: #c9aedc; font: italic 400 1em Georgia, serif; letter-spacing: -.06em; }
.gallery-motion-toggle { display: inline-flex; align-items: center; gap: 7px; padding: 9px 12px; border: 1px solid rgb(227 206 243 / 21%); border-radius: 99px; color: #d9cce5; background: rgb(61 42 93 / 24%); font: 8px var(--mono); cursor: pointer; }.gallery-motion-toggle:hover { border-color: rgb(227 206 243 / 42%); color: #fff; }.gallery-motion-toggle i { font-size: 13px; }
.gallery-intro { width: min(1180px, calc(100% - 112px)); margin: 0 auto 25px; color: #b9a8c7; font-size: 11px; }
.gallery-lane { position: relative; isolation: isolate; width: 100%; overflow: hidden; padding: 16px 0 20px; cursor: pointer; mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent); }.gallery-lane::after { position: absolute; z-index: 2; top: 0; bottom: 0; left: -35%; width: 27%; background: linear-gradient(105deg, transparent, rgb(237 215 250 / 5%), rgb(255 255 255 / 11%), transparent); content: ''; filter: blur(12px); pointer-events: none; animation: gallery-light-sweep 13s cubic-bezier(.45,0,.55,1) infinite; }.gallery-lane:focus-visible { outline: 2px solid #d9b9ed; outline-offset: 4px; }.gallery-track { display: flex; width: max-content; animation: photo-gallery-scroll 52s linear infinite; will-change: transform; }.gallery-paused .gallery-track, .gallery-paused .gallery-card, .gallery-paused .gallery-lane::after { animation-play-state: paused; }
.gallery-sequence { display: flex; flex: 0 0 auto; gap: 14px; padding-right: 14px; }.gallery-card { width: clamp(190px, 19vw, 250px); flex: 0 0 auto; margin: 0; animation: gallery-card-drift 6.8s ease-in-out infinite alternate; }.gallery-card:nth-child(5n + 2) { animation-delay: -2.1s; }.gallery-card:nth-child(5n + 3) { animation-delay: -4.3s; }.gallery-card:nth-child(5n + 4) { animation-delay: -1.2s; }.gallery-card:nth-child(5n + 5) { animation-delay: -3.4s; }.gallery-image-frame { position: relative; display: grid; aspect-ratio: 4 / 5; overflow: hidden; place-items: center; border: 1px solid rgb(227 206 243 / 19%); border-radius: 15px; background: linear-gradient(145deg, rgb(87 40 102 / 56%), rgb(43 16 60 / 73%)); box-shadow: 0 17px 38px rgb(9 3 18 / 24%), inset 0 1px rgb(255 255 255 / 11%); transform: perspective(1000px) rotateY(-2deg); transform-style: preserve-3d; backface-visibility: hidden; transition: transform .5s cubic-bezier(.2,.7,.2,1), border-color .4s, box-shadow .4s; }.gallery-card:nth-child(even) .gallery-image-frame { transform: perspective(1000px) rotateY(2deg); }.gallery-image-frame::after { position: absolute; inset: 0; border: 1px solid rgb(255 255 255 / 7%); border-radius: inherit; content: ''; pointer-events: none; }.gallery-image-frame img { width: 100%; height: 100%; object-fit: cover; transition: transform .75s cubic-bezier(.2,.7,.2,1), filter .5s; }.gallery-card:hover .gallery-image-frame, .gallery-card:focus-visible .gallery-image-frame { z-index: 3; border-color: rgb(226 194 244 / 60%); box-shadow: 0 24px 55px rgb(9 3 18 / 35%), 0 0 26px rgb(172 145 192 / 19%), inset 0 1px rgb(255 255 255 / 24%); transform: perspective(1000px) translateY(-7px) rotateY(0) scale(1.025); }.gallery-card:hover .gallery-image-frame img, .gallery-card:focus-visible .gallery-image-frame img { transform: scale(1.06); filter: saturate(1.1) contrast(1.02); }
.gallery-empty-slot { display: grid; width: 100%; height: 100%; align-content: center; justify-items: center; gap: 11px; background: radial-gradient(ellipse at 50% 40%, rgb(172 145 192 / 15%), transparent 52%), repeating-linear-gradient(135deg, transparent 0 16px, rgb(255 255 255 / 2%) 16px 17px); }.gallery-plus { display: grid; width: 36px; height: 36px; place-items: center; border: 1px solid rgb(227 206 243 / 28%); border-radius: 50%; color: #d9b9ed; font: 20px/1 var(--display); }.gallery-empty-slot small { color: #ad9abc; font: 7px var(--mono); letter-spacing: .13em; }.gallery-slot-number { color: rgb(201 174 220 / 68%); font: 500 32px/.9 var(--display); }.gallery-index { position: absolute; top: 12px; right: 12px; z-index: 1; padding: 6px 7px; border: 1px solid rgb(255 255 255 / 17%); border-radius: 99px; color: #f4eafa; background: rgb(23 13 32 / 35%); font: 7px var(--mono); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }.gallery-card figcaption { padding: 9px 2px 0; color: #b9a8c7; font: 8px var(--mono); letter-spacing: .06em; text-transform: uppercase; }
.gallery-note { display: flex; width: min(1180px, calc(100% - 112px)); align-items: center; gap: 9px; margin: 18px auto 0; color: #9684a3; font: 7px var(--mono); letter-spacing: .1em; }.gallery-note span { color: #d0b4e3; font-size: 10px; }.gallery-note i { width: 18px; height: 1px; background: #8f529b; }
.gallery-card[role='button'] { cursor: zoom-in; }.gallery-card[role='button']:focus-visible { outline: 2px solid #d9b9ed; outline-offset: 4px; border-radius: 15px; }
.gallery-lightbox { position: fixed; z-index: 10000; inset: 0; display: grid; grid-template-columns: minmax(48px, 1fr) minmax(0, min(900px, 76vw)) minmax(48px, 1fr); align-items: center; gap: 20px; padding: 52px 24px 28px; background: rgb(13 8 18 / 91%); -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px); animation: lightbox-appear .2s ease-out both; }
.lightbox-figure { display: grid; max-height: 100%; min-width: 0; grid-template-rows: minmax(0, 1fr) auto; justify-items: center; margin: 0; }
.lightbox-figure img { display: block; max-width: 100%; max-height: calc(100vh - 130px); object-fit: contain; border-radius: 5px; box-shadow: 0 25px 80px rgb(0 0 0 / 48%); }
.lightbox-figure figcaption { display: flex; width: 100%; justify-content: space-between; gap: 18px; padding-top: 13px; color: #f4edf9; font: 11px var(--display); }.lightbox-figure figcaption small { flex: 0 0 auto; color: #c6b5d2; font: 9px var(--mono); }
.lightbox-close, .lightbox-nav { display: grid; place-items: center; border: 1px solid rgb(255 255 255 / 19%); color: #f8f0fd; background: rgb(61 42 93 / 45%); cursor: pointer; -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); transition: background .2s, transform .2s; }
.lightbox-close:hover, .lightbox-nav:hover { background: rgb(143 82 155 / 68%); transform: scale(1.05); }
.lightbox-close { position: absolute; top: 20px; right: 22px; width: 42px; height: 42px; border-radius: 50%; font-size: 20px; }
.lightbox-nav { width: 46px; height: 46px; justify-self: center; border-radius: 50%; font-size: 28px; }
/* Keep the photo subject centered in both the moving cards and full-screen viewer. */
.gallery-image-frame img, .lightbox-figure img { object-position: center center; }
@keyframes lightbox-appear { from { opacity: 0; } to { opacity: 1; } }
@keyframes photo-gallery-scroll { to { transform: translateX(-50%); } }
@keyframes gallery-card-drift { from { transform: translateY(2px); } to { transform: translateY(-5px); } }
@keyframes gallery-light-sweep { 0%, 12% { transform: translateX(0) skewX(-12deg); opacity: 0; } 25% { opacity: .7; } 58% { opacity: .32; } 88%, 100% { transform: translateX(520%) skewX(-12deg); opacity: 0; } }
@media (max-width: 760px) { .photo-gallery { padding-top: 25px; padding-bottom: 75px; }.gallery-heading, .gallery-intro, .gallery-note { width: calc(100% - 44px); }.gallery-heading { align-items: end; }.gallery-card { width: 180px; }.gallery-sequence { gap: 10px; padding-right: 10px; }.gallery-track { animation-duration: 42s; } }
@media (max-width: 440px) { .gallery-heading { align-items: flex-start; flex-direction: column; gap: 12px; }.gallery-heading h2 { font-size: 42px; }.gallery-intro { line-height: 1.7; }.gallery-card { width: 158px; }.gallery-image-frame { border-radius: 11px; }.gallery-index { top: 8px; right: 8px; }.gallery-track { animation-duration: 36s; } }
@media (max-width: 620px) { .gallery-lightbox { grid-template-columns: 38px minmax(0, 1fr) 38px; gap: 8px; padding: 64px 10px 22px; }.lightbox-nav { width: 36px; height: 36px; font-size: 23px; }.lightbox-figure img { max-height: calc(100vh - 130px); }.lightbox-figure figcaption { font-size: 9px; }.lightbox-close { top: 13px; right: 13px; width: 36px; height: 36px; } }
@media (prefers-reduced-motion: reduce) { .gallery-track, .gallery-card, .gallery-lane::after { animation: none; transform: none; }.gallery-card:hover .gallery-image-frame, .gallery-card:hover .gallery-image-frame img { transform: none; } }
</style>
