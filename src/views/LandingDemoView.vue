<script setup>
import { onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
let context

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  context = gsap.context(() => {
    gsap.from('.landing-nav, .landing-kicker, .landing-title, .landing-lede, .landing-cta, .landing-art', {
      y: 25, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', clearProps: 'all',
    })
    gsap.utils.toArray('.landing-reveal').forEach((element) => {
      gsap.from(element, { y: 28, opacity: 0, duration: 0.75, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 83%', once: true } })
    })
    gsap.to('.landing-orb', { y: -18, rotate: 8, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  })
})

onUnmounted(() => context?.revert())
</script>

<template>
  <main class="landing-demo">
    <header class="landing-nav">
      <RouterLink class="landing-logo" to="/">aster<span>®</span></RouterLink>
      <nav aria-label="Aster concept navigation"><a href="#approach">Approach</a><a href="#details">Details</a><a class="landing-nav-cta" href="#contact">Say hello <span>↗</span></a></nav>
    </header>

    <section class="landing-hero">
      <div class="landing-copy">
        <p class="landing-kicker"><span></span> A CREATIVE STUDIO CONCEPT</p>
        <h1 class="landing-title">Make room<br />for <em>good ideas.</em></h1>
        <p class="landing-lede">A small independent studio for brands with something real to say. Thoughtful strategy, warm identities, and digital experiences made to last.</p>
        <a class="landing-cta" href="#approach">Explore the studio <span>↓</span></a>
        <p class="landing-footnote">INDEPENDENT BY NATURE · ONLINE EVERYWHERE</p>
      </div>
      <div class="landing-art" aria-label="Abstract lilac studio artwork" role="img">
        <div class="art-grid"></div><div class="landing-orb"></div><div class="art-ribbon"></div><span class="art-caption">IDEAS TAKE SHAPE<br />WHEN YOU MAKE SPACE.</span><span class="art-number">AST—01</span>
      </div>
      <span class="landing-index">01 — 03</span>
    </section>

    <section id="approach" class="landing-about landing-reveal">
      <p class="landing-section-label">01 / THE APPROACH</p>
      <div><h2>Curiosity first.<br /><em>Clarity always.</em></h2><p>Good work starts with listening. We find the heart of an idea, give it a clear voice, and build a visual world people want to spend time in.</p></div>
    </section>

    <section id="details" class="landing-services landing-reveal">
      <div class="landing-services-head"><p class="landing-section-label">02 / WHAT WE DO</p><span>SMALL STUDIO, THOUGHTFUL OUTPUT</span></div>
      <article><span>01</span><h3>Brand worlds</h3><p>Identity, art direction, and the details that make a brand feel unmistakably itself.</p><b>STRATEGY · IDENTITY · GUIDELINES</b></article>
      <article><span>02</span><h3>Digital places</h3><p>Responsive websites with considered motion, useful content, and a little character.</p><b>DESIGN · DEVELOPMENT · MOTION</b></article>
      <article><span>03</span><h3>Good stories</h3><p>Clear, human words and images that help the right people find their way in.</p><b>CAMPAIGNS · CONTENT · DIRECTION</b></article>
    </section>

    <section id="contact" class="landing-contact landing-reveal"><p class="landing-section-label">03 / START A CONVERSATION</p><h2>Have a good one<br />in <em>mind?</em></h2><a href="mailto:hello@aster.studio">hello@aster.studio <span>↗</span></a></section>
    <footer class="landing-footer"><RouterLink to="/">← Back to Kenneth’s portfolio</RouterLink><span>CONCEPT LANDING PAGE · BUILT WITH VUE & GSAP</span></footer>
  </main>
</template>

<style scoped>
.landing-demo { --paper: #eee9df; --plum: #321a34; --lilac: #aa8bb0; --orange: #e66b45; min-height: 100vh; padding: 0 max(24px, calc((100vw - 1180px) / 2)); color: var(--plum); background: var(--paper); font-family: 'DM Sans', sans-serif; }
.landing-nav { display: flex; height: 76px; align-items: center; justify-content: space-between; border-bottom: 1px solid rgb(50 26 52 / 20%); }.landing-logo { color: var(--plum); font: 800 24px/1 var(--display); letter-spacing: -.1em; }.landing-logo span { margin-left: 4px; color: var(--orange); font: 10px var(--mono); vertical-align: top; }.landing-nav nav { display: flex; align-items: center; gap: clamp(18px, 4vw, 46px); }.landing-nav nav a { color: var(--plum); font-size: 11px; }.landing-nav nav .landing-nav-cta { padding: 10px 13px; border: 1px solid rgb(50 26 52 / 29%); border-radius: 99px; }.landing-nav-cta span, .landing-cta span, .landing-contact a span { margin-left: 12px; color: var(--orange); }
.landing-hero { position: relative; display: grid; min-height: 620px; grid-template-columns: 1fr .85fr; align-items: center; gap: 7%; padding: 55px 4% 76px; border-bottom: 1px solid rgb(50 26 52 / 20%); }.landing-copy { position: relative; z-index: 2; }.landing-kicker, .landing-section-label { color: #775b7a; font: 9px var(--mono); letter-spacing: .14em; }.landing-kicker { display: flex; align-items: center; gap: 10px; }.landing-kicker span { width: 24px; height: 1px; background: var(--orange); }.landing-title { margin: 30px 0 20px; font: 600 clamp(54px, 7.5vw, 95px)/.91 var(--display); letter-spacing: -.075em; }.landing-title em, .landing-about h2 em, .landing-contact h2 em { color: #946e99; font: italic 400 1em Georgia, serif; letter-spacing: -.07em; }.landing-lede { max-width: 390px; color: #69556a; font-size: 13px; line-height: 1.8; }.landing-cta { display: inline-flex; align-items: center; margin-top: 17px; padding: 13px 16px; border: 1px solid rgb(50 26 52 / 28%); border-radius: 99px; color: var(--plum); font-size: 11px; transition: background .2s, color .2s; }.landing-cta:hover { color: var(--paper); background: var(--plum); }.landing-footnote { margin: 48px 0 0; color: #947e95; font: 8px var(--mono); letter-spacing: .09em; }
.landing-art { position: relative; min-height: 425px; overflow: hidden; background: #d7c8d8; }.art-grid { position: absolute; inset: 0; opacity: .35; background-image: linear-gradient(rgb(50 26 52 / 15%) 1px, transparent 1px), linear-gradient(90deg, rgb(50 26 52 / 15%) 1px, transparent 1px); background-size: 34px 34px; }.landing-orb { position: absolute; top: 14%; left: 20%; width: 63%; aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle at 34% 30%, #f6e5f1, #b18bb1 55%, #8c648e); box-shadow: 20px 25px 50px rgb(50 26 52 / 18%); }.art-ribbon { position: absolute; top: 5%; right: -23%; width: 76%; height: 94%; border: 1px solid rgb(50 26 52 / 38%); border-radius: 50%; transform: rotate(35deg); }.art-caption { position: absolute; bottom: 24px; left: 22px; color: var(--plum); font: 8px/1.5 var(--mono); letter-spacing: .1em; }.art-number { position: absolute; top: 18px; right: 18px; color: #735c76; font: 8px var(--mono); }.landing-index { position: absolute; right: 4%; bottom: 24px; color: #8d778e; font: 8px var(--mono); }
.landing-about { display: grid; grid-template-columns: .7fr 1.3fr; gap: 10%; padding: 105px 4%; border-bottom: 1px solid rgb(50 26 52 / 20%); }.landing-about h2, .landing-contact h2 { margin: 0 0 18px; font: 600 clamp(38px, 5vw, 60px)/.98 var(--display); letter-spacing: -.065em; }.landing-about > div { display: grid; grid-template-columns: 1fr .8fr; align-items: end; gap: 25px; }.landing-about > div p { max-width: 310px; margin: 0 0 5px; color: #69556a; font-size: 12px; line-height: 1.8; }
.landing-services { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0 24px; padding: 70px 4% 88px; border-bottom: 1px solid rgb(50 26 52 / 20%); }.landing-services-head { display: flex; grid-column: 1 / -1; justify-content: space-between; margin-bottom: 20px; }.landing-services-head > span { color: #9c879d; font: 8px var(--mono); }.landing-services article { padding: 22px 18px 0 0; border-top: 1px solid rgb(50 26 52 / 30%); }.landing-services article > span { color: var(--orange); font: 9px var(--mono); }.landing-services h3 { margin: 23px 0 9px; font: 600 22px var(--display); letter-spacing: -.05em; }.landing-services article p { min-height: 55px; color: #69556a; font-size: 11px; line-height: 1.7; }.landing-services article b { display: block; margin-top: 20px; color: #947e95; font: 7px var(--mono); letter-spacing: .08em; }
.landing-contact { display: grid; grid-template-columns: .7fr 1.3fr; gap: 10%; align-items: end; padding: 84px 4% 90px; }.landing-contact .landing-section-label { grid-column: 1 / -1; }.landing-contact h2 { margin: 0; }.landing-contact > a { justify-self: start; padding-bottom: 8px; border-bottom: 1px solid rgb(50 26 52 / 32%); color: var(--plum); font-size: 12px; }.landing-footer { display: flex; justify-content: space-between; gap: 15px; padding: 18px 4% 23px; border-top: 1px solid rgb(50 26 52 / 20%); color: #806b81; font: 8px var(--mono); }.landing-footer a { color: inherit; }
@media (max-width: 720px) { .landing-demo { padding-inline: 22px; }.landing-hero { min-height: auto; grid-template-columns: 1fr; gap: 38px; padding: 58px 0 58px; }.landing-title { font-size: clamp(54px, 13vw, 78px); }.landing-art { min-height: 340px; }.landing-about { grid-template-columns: 1fr; gap: 24px; padding: 70px 0; }.landing-about > div { grid-template-columns: 1fr; gap: 10px; }.landing-services { grid-template-columns: 1fr; gap: 24px; padding: 58px 0 66px; }.landing-services-head { margin-bottom: 0; }.landing-services article { padding-top: 17px; }.landing-services h3 { margin-top: 15px; }.landing-services article p { min-height: 0; max-width: 450px; }.landing-contact { grid-template-columns: 1fr; gap: 20px; padding: 66px 0 70px; }.landing-contact .landing-section-label { grid-column: auto; } }
@media (max-width: 440px) { .landing-nav nav { gap: 12px; }.landing-nav nav a { font-size: 9px; }.landing-nav nav .landing-nav-cta { padding: 8px 10px; }.landing-art { min-height: 290px; }.landing-footer { flex-direction: column; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; } }
</style>
