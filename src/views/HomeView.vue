<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile, projects } from '../data/portfolio'
import TypingSpeedChallenge from '../components/TypingSpeedChallenge.vue'
import PhotoGallery from '../components/PhotoGallery.vue'

gsap.registerPlugin(ScrollTrigger)
let context
let motionContext
const quotes = [
  'Make it work, make it clear, then make it better.',
  'Small steps still move you forward.',
  'Curiosity turns ideas into things you can build.',
  'Keep learning. Keep making.',
  'A different point of view can be your strength.',
]
const experienceTitleWords = ['WHERE', 'I’VE', 'CONTRIBUTED.']
const approachTitleWords = ['CREATIVE', 'BY', 'NATURE.']
const currentTime = ref('')
const currentQuote = ref(quotes[Math.floor(Math.random() * quotes.length)])
const portfolioRoot = ref(null)
const headerElement = ref(null)
const headerVisible = ref(true)
const menuOpen = ref(false)
let clockInterval
let quoteInterval
let lastScrollY = 0
let scrollDirectionDistance = 0
let scrollFrame

function updateClock() {
  currentTime.value = new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date())
}

function rotateQuote() {
  const availableQuotes = quotes.filter((quote) => quote !== currentQuote.value)
  currentQuote.value = availableQuotes[Math.floor(Math.random() * availableQuotes.length)]
}

function updateHeaderOnScroll() {
  scrollFrame = undefined
  const scrollY = window.scrollY
  scrollDirectionDistance += scrollY - lastScrollY
  lastScrollY = scrollY

  if (menuOpen.value) {
    headerVisible.value = true
    return
  }

  if (scrollY < 100) {
    headerVisible.value = true
    scrollDirectionDistance = 0
    return
  }

  if (headerElement.value?.contains(document.activeElement) && document.activeElement.matches(':focus-visible')) return

  if (scrollDirectionDistance > 12) {
    headerVisible.value = false
    scrollDirectionDistance = 0
  } else if (scrollDirectionDistance < -8) {
    headerVisible.value = true
    scrollDirectionDistance = 0
  }
}

function scheduleHeaderUpdate() {
  if (scrollFrame === undefined) scrollFrame = window.requestAnimationFrame(updateHeaderOnScroll)
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  scrollDirectionDistance = 0
  lastScrollY = window.scrollY
  if (menuOpen.value) headerVisible.value = true
}

function closeMenu() {
  menuOpen.value = false
  scrollDirectionDistance = 0
  lastScrollY = window.scrollY
}

function splitApproachText() {
  const selectors = [
    '#approach .eyebrow',
    '#approach .panel-copy',
    '#approach .tool-group h3',
    '#approach .adobe-mark',
    '#approach .tech-gsap b',
    '#approach .game-list > span',
    '#approach .process-list li > span',
    '#approach .process-list strong',
    '#approach .process-list p',
    '#approach .quote-mark',
    '#approach blockquote',
    '#approach .quote-signoff',
    '#approach .quote-link-text',
  ].join(', ')

  let processGlyphIndex = 0
  portfolioRoot.value?.querySelectorAll(selectors).forEach((element) => {
    element.classList.add('approach-type-line')
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
    const textNodes = []
    while (walker.nextNode()) textNodes.push(walker.currentNode)

    textNodes.forEach((textNode) => {
      if (!textNode.textContent.trim()) return
      const fragment = document.createDocumentFragment()
      textNode.textContent.split(/(\s+)/).forEach((part) => {
        if (!part || /^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part))
          return
        }

        const mask = document.createElement('span')
        const word = document.createElement('span')
        mask.className = 'approach-type-mask'
        word.className = 'approach-type-word'
        Array.from(part).forEach((character) => {
          const letter = document.createElement('span')
          letter.className = 'approach-type-char'
          if (element.closest('.process-list')) {
            const glyph = document.createElement('span')
            glyph.className = 'approach-auto-letter'
            glyph.style.setProperty('--glyph-index', String(processGlyphIndex++ % 8))
            glyph.textContent = character
            letter.append(glyph)
          } else {
            letter.textContent = character
          }
          word.append(letter)
        })
        mask.append(word)
        fragment.append(mask)
      })
      if (element.matches('.eyebrow')) {
        const content = document.createElement('span')
        content.className = 'approach-type-content'
        content.append(fragment)
        textNode.replaceWith(content)
      } else {
        textNode.replaceWith(fragment)
      }
    })
  })
}

function splitArcadeText() {
  const selectors = [
    '#arcade .typing-intro .eyebrow',
    '#arcade .typing-intro h2',
    '#arcade .typing-description',
    '#arcade .typing-how > span:last-child',
    '#arcade .typing-label',
    '#arcade .typing-header h3',
    '#arcade .typing-modes button',
    '#arcade .typing-stats > div > span',
  ].join(', ')

  portfolioRoot.value?.querySelectorAll(selectors).forEach((element) => {
    element.classList.add('arcade-type-line')
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
    const textNodes = []
    while (walker.nextNode()) textNodes.push(walker.currentNode)

    textNodes.forEach((textNode) => {
      if (!textNode.textContent.trim()) return
      const fragment = document.createDocumentFragment()
      textNode.textContent.split(/(\s+)/).forEach((part) => {
        if (!part || /^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part))
          return
        }

        const mask = document.createElement('span')
        const word = document.createElement('span')
        mask.className = 'arcade-type-mask'
        word.className = 'arcade-type-word'
        word.textContent = part
        mask.append(word)
        fragment.append(mask)
      })

      if (element.matches('.eyebrow')) {
        const content = document.createElement('span')
        content.className = 'arcade-type-content'
        content.append(fragment)
        textNode.replaceWith(content)
      } else {
        textNode.replaceWith(fragment)
      }
    })
  })
}

function splitContactText() {
  const selectors = [
    '#contact .contact-info .eyebrow',
    '#contact .contact-location',
    '#contact .contact-email',
    '#contact .contact-navigation a',
    '#contact .contact-callout h2',
    '#contact .contact-callout .button-label',
    '.site-footer .brand',
    '.site-footer > span',
    '.site-footer .footer-social a',
    '.site-footer .back-top',
  ].join(', ')

  portfolioRoot.value?.querySelectorAll(selectors).forEach((element) => {
    element.classList.add('contact-type-line')
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
    const textNodes = []
    while (walker.nextNode()) textNodes.push(walker.currentNode)

    textNodes.forEach((textNode) => {
      if (!textNode.textContent.trim()) return
      if (element.matches('.contact-email') && textNode.parentElement?.tagName === 'SPAN') return
      const fragment = document.createDocumentFragment()
      textNode.textContent.split(/(\s+)/).forEach((part) => {
        if (!part || /^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part))
          return
        }

        const mask = document.createElement('span')
        const word = document.createElement('span')
        mask.className = 'contact-type-mask'
        word.className = 'contact-type-word'
        Array.from(part).forEach((character) => {
          const letter = document.createElement('span')
          letter.className = 'contact-type-char'
          letter.textContent = character
          word.append(letter)
        })
        mask.append(word)
        fragment.append(mask)
      })

      if (element.matches('.eyebrow, .contact-email, .button-label')) {
        const content = document.createElement('span')
        content.className = 'contact-type-content'
        content.append(fragment)
        textNode.replaceWith(content)
      } else {
        textNode.replaceWith(fragment)
      }
    })
  })
}

function splitAboutText() {
  const selectors = ['#about .about-eyebrow', '#about .about-copy > p', '#about .location-note > span:last-child'].join(', ')

  portfolioRoot.value?.querySelectorAll(selectors).forEach((element) => {
    element.classList.add('about-type-line')
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
    const textNodes = []
    while (walker.nextNode()) textNodes.push(walker.currentNode)

    textNodes.forEach((textNode) => {
      if (!textNode.textContent.trim()) return
      const fragment = document.createDocumentFragment()
      textNode.textContent.split(/(\s+)/).forEach((part) => {
        if (!part || /^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part))
          return
        }
        const mask = document.createElement('span')
        const word = document.createElement('span')
        mask.className = 'about-type-mask'
        word.className = 'about-type-word'
        word.textContent = part
        mask.append(word)
        fragment.append(mask)
      })

      if (element.matches('.eyebrow')) {
        const content = document.createElement('span')
        content.className = 'about-type-content'
        content.append(fragment)
        textNode.replaceWith(content)
      } else {
        textNode.replaceWith(fragment)
      }
    })
  })
}

function splitCardTypography() {
  const selectors = [
    '.education-level',
    '.education-card h3',
    '.education-card > p',
    '.education-status',
    '.experience-number',
    '.experience-role h3',
    '.experience-role p',
    '.experience-type',
  ].join(', ')

  portfolioRoot.value?.querySelectorAll(selectors).forEach((element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
    const textNodes = []
    while (walker.nextNode()) textNodes.push(walker.currentNode)

    textNodes.forEach((textNode) => {
      if (!textNode.textContent.trim()) return
      const fragment = document.createDocumentFragment()
      textNode.textContent.split(/(\s+)/).forEach((part) => {
        if (!part || /^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part))
          return
        }
        const mask = document.createElement('span')
        const word = document.createElement('span')
        mask.className = 'directional-type-mask'
        word.className = 'directional-type-word'
        word.textContent = part
        mask.append(word)
        fragment.append(mask)
      })
      if (element.matches('.education-status')) {
        const content = document.createElement('span')
        content.className = 'directional-type-content'
        content.append(fragment)
        textNode.replaceWith(content)
      } else {
        textNode.replaceWith(fragment)
      }
    })
  })
}

function splitEditorialTitles() {
  const selectors = [
    '#education .section-heading h2',
    '#work .section-heading h2',
    '#gallery .gallery-heading h2',
  ].join(', ')

  portfolioRoot.value?.querySelectorAll(selectors).forEach((title) => {
    title.classList.add('scroll-type-title')
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT)
    const textNodes = []
    while (walker.nextNode()) textNodes.push(walker.currentNode)

    textNodes.forEach((textNode) => {
      const fragment = document.createDocumentFragment()
      Array.from(textNode.textContent).forEach((character) => {
        if (/\s/.test(character)) {
          fragment.append(document.createTextNode(character))
          return
        }
        const letter = document.createElement('span')
        letter.className = 'scroll-title-char'
        letter.textContent = character
        fragment.append(letter)
      })
      textNode.replaceWith(fragment)
    })
  })
}

onMounted(() => {
  lastScrollY = window.scrollY
  window.addEventListener('scroll', scheduleHeaderUpdate, { passive: true })
  updateClock()
  clockInterval = window.setInterval(updateClock, 1000)
  quoteInterval = window.setInterval(rotateQuote, 12000)

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  splitApproachText()
  splitArcadeText()
  splitContactText()
  splitAboutText()
  splitCardTypography()
  splitEditorialTitles()

  context = gsap.context(() => {
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
    intro
      .from('.hero-kicker', { y: 18, opacity: 0, duration: 0.55 })
      .from('.hero-title', { y: 34, opacity: 0, duration: 0.85, clearProps: 'transform,opacity' }, '-=0.25')
      .from('.hero-copy', { y: 18, opacity: 0, duration: 0.6, clearProps: 'transform,opacity' }, '-=0.48')
      .from('.hero-actions > a', { y: 14, opacity: 0, duration: 0.5, stagger: 0.1, clearProps: 'transform,opacity' }, '-=0.32')
      .from('.hero-moment', { y: 12, opacity: 0, duration: 0.55, clearProps: 'transform,opacity' }, '-=0.4')
      .from('.hero-facts > div', { y: 12, opacity: 0, duration: 0.45, stagger: 0.08, clearProps: 'transform,opacity' }, '-=0.24')
      .from('.portrait-card', { y: 26, opacity: 0, scale: 0.985, duration: 0.9, clearProps: 'transform,opacity' }, 0.16)

    gsap.utils.toArray('[data-reveal]').forEach((element, index) => {
      gsap.fromTo(element,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.72,
          delay: (index % 3) * 0.045,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true,
            invalidateOnRefresh: true,
          },
        },
      )
    })

    gsap.fromTo('.experience-title-char',
      { yPercent: 115, rotationX: -45, opacity: 0 },
      {
        yPercent: 0,
        rotationX: 0,
        opacity: 1,
        duration: 0.68,
        stagger: 0.018,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.experience .section-heading',
          start: 'top 80%',
          once: true,
          invalidateOnRefresh: true,
        },
      },
    )

    gsap.utils.toArray('.scroll-type-title').forEach((title) => {
      gsap.fromTo(title.querySelectorAll('.scroll-title-char'),
        { yPercent: 82, rotationX: -42, opacity: 0.14 },
        {
          yPercent: 0,
          rotationX: 0,
          opacity: 1,
          stagger: 0.014,
          ease: 'none',
          scrollTrigger: {
            trigger: title,
            start: 'top 92%',
            end: 'top 48%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      )
    })

    gsap.fromTo('.approach-title-char',
      { yPercent: 110, rotationX: -55, opacity: 0.12 },
      {
        yPercent: 0,
        rotationX: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.075,
        ease: 'none',
        scrollTrigger: {
          trigger: '.skill-panel h2',
          start: 'top 88%',
          end: 'top 28%',
          scrub: 1.4,
          invalidateOnRefresh: true,
        },
      },
    )

    gsap.utils.toArray('.approach-type-line').forEach((line) => {
      gsap.fromTo(line.querySelectorAll('.approach-type-char'),
        (index) => ({
          x: index % 2 === 0 ? -7 : 7,
          yPercent: index % 2 === 0 ? 44 : -34,
          rotationX: index % 2 === 0 ? -24 : 24,
          opacity: 0.38,
        }),
        {
          x: 0,
          yPercent: 0,
          rotationX: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.012,
          ease: 'none',
          scrollTrigger: {
            trigger: line,
            start: 'top 96%',
            end: 'top 58%',
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        },
      )
    })

    gsap.utils.toArray('.arcade-type-line').forEach((line) => {
      gsap.fromTo(line.querySelectorAll('.arcade-type-word'),
        { yPercent: 80, opacity: 0.22 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: {
            trigger: line,
            start: 'top 98%',
            end: 'top 42%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      )
    })

    gsap.utils.toArray('.contact-type-line').forEach((line) => {
      gsap.fromTo(line.querySelectorAll('.contact-type-char'),
        (index) => ({
          x: [-12, 12, -7, 7][index % 4],
          yPercent: [30, -24, -30, 24][index % 4],
          rotationX: [18, -18, 13, -13][index % 4],
          opacity: 0.62,
        }),
        {
          x: 0,
          yPercent: 0,
          rotationX: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.012,
          ease: 'none',
          scrollTrigger: {
            trigger: line,
            start: 'top 105%',
            end: 'top 70%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      )
    })

    gsap.fromTo('.about-word',
      { yPercent: 80, opacity: 0.18 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.06,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-lead',
          start: 'top 100%',
          end: 'top 22%',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      },
    )

    gsap.utils.toArray('.about-type-line').forEach((line) => {
      gsap.fromTo(line.querySelectorAll('.about-type-word'),
        { yPercent: 80, opacity: 0.18 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.055,
          ease: 'none',
          scrollTrigger: {
            trigger: line,
            start: 'top 100%',
            end: 'top 34%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      )
    })

    const animateDirectionalCards = (selector) => {
      gsap.utils.toArray(selector).forEach((card, index) => {
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
        // Keep the reveal inside the viewport so card edges and text never slide off-screen.
        const distance = isTouchDevice ? 0 : Math.min(34, window.innerWidth * 0.02)
        const direction = index === 0
          ? { x: -distance, y: 34 }
          : index === 1
            ? { x: distance, y: 34 }
            : { x: 0, y: 90 }

        gsap.fromTo(card,
          { ...direction, scale: 0.965, opacity: 0.62 },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 96%',
              end: 'top 56%',
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          },
        )

        gsap.fromTo(card.querySelectorAll('.directional-type-word'),
          { yPercent: 55, opacity: 0.45 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.035,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'top 52%',
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          },
        )
      })
    }

    animateDirectionalCards('.education-card')
    animateDirectionalCards('.experience-entry')

    gsap.utils.toArray('.project-card').forEach((card, index) => {
      const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
      const offset = isTouchDevice ? 32 : 96
      const fromX = index % 2 === 0 ? -offset : offset
      gsap.fromTo(card,
        { x: fromX, opacity: 0.45 },
        {
          x: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top 94%',
            end: 'top 54%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      )

      const art = card.querySelector('.project-art')
      const mockup = art?.classList.contains('todo-art')
        ? art.querySelector('.mini-todo-preview')
        : art?.classList.contains('landing-art')
          ? art.querySelector('.mini-landing-preview')
          : art?.querySelector('.art-window')
      if (!art || !mockup) return

      const showcase = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: card,
          start: 'top 82%',
          once: true,
          invalidateOnRefresh: true,
        },
      })

      showcase
        .fromTo(art,
          { y: 22, opacity: 0.72 },
          { y: 0, opacity: 1, duration: 0.72, clearProps: 'transform,opacity' },
        )
        .fromTo(mockup,
          {
            y: 28,
            z: -90,
            scale: 0.92,
            rotationX: 7,
            rotationY: -16,
            rotationZ: index === 2 ? 1.5 : -1.5,
            transformPerspective: 1000,
            opacity: 0,
          },
          {
            y: 0,
            z: 0,
            scale: 1,
            rotationX: 0,
            rotationY: 0,
            rotationZ: index === 2 ? 1.5 : -1.5,
            transformPerspective: 1000,
            opacity: 1,
            duration: 1.05,
          },
          '-=0.48',
        )

      gsap.to(mockup, {
        z: 32,
        rotationX: -4,
        rotationY: isTouchDevice ? 13 : 24,
        duration: isTouchDevice ? 3.2 : 2.4,
        delay: 1.05,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        scrollTrigger: {
          trigger: card,
          start: 'top 82%',
          once: true,
        },
      })
    })

    const approachDirections = [
      { x: -38, y: 0 },
      { x: 38, y: 0 },
      { x: 0, y: -34 },
      { x: 0, y: 34 },
    ]
    const directionalPanels = [
      { selector: '#approach .skill-panel', x: -52, y: 0 },
      { selector: '#approach .process-panel', x: 0, y: 48 },
      { selector: '#approach .approach-quote', x: 52, y: 0 },
    ]

    directionalPanels.forEach(({ selector, x, y }) => {
      const panel = document.querySelector(selector)
      if (!panel) return
      gsap.fromTo(panel,
        { x, y, opacity: 0.28 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top 94%',
            end: 'top 62%',
            scrub: 0.75,
            invalidateOnRefresh: true,
          },
        },
      )
    })

    const quoteDirections = [
      { selector: '#approach .quote-mark', x: -34, y: 0 },
      { selector: '#approach .approach-quote blockquote', x: 38, y: 0 },
      { selector: '#approach .quote-signoff', x: 0, y: -28 },
      { selector: '#approach .quote-link', x: 0, y: 28 },
    ]
    quoteDirections.forEach(({ selector, x, y }) => {
      const element = document.querySelector(selector)
      if (!element) return
      gsap.fromTo(element,
        { x, y, opacity: 0.3, scale: 0.97 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top 94%',
            end: 'top 62%',
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        },
      )
    })

    gsap.utils.toArray('#approach .tech-logo, #approach .adobe-mark').forEach((item, index) => {
      const direction = approachDirections[index % approachDirections.length]
      gsap.fromTo(item,
        { ...direction, opacity: 0.18, scale: 0.88 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top 94%',
            end: 'top 72%',
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        },
      )
    })

    const pocketPanels = gsap.utils.toArray('#top.hero, #about, #education, #experience, #work, #gallery, #arcade, #approach, #contact')
    pocketPanels.forEach((panel, index) => {
      panel.classList.add('pocket-panel')
      panel.style.zIndex = String(index + 1)

      if (index === 0) return
      const previousPanel = pocketPanels[index - 1]
      const incomingContent = panel.querySelector(':scope > .shell, :scope > .typing-layout') || panel.firstElementChild

      gsap.to(previousPanel, {
        yPercent: -5,
        scale: 0.92,
        opacity: 0.58,
        ease: 'none',
        transformOrigin: '50% 0%',
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'top top',
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      })

      if (!incomingContent) return
      gsap.fromTo(incomingContent,
        { y: 54, scale: 0.965 },
        {
          y: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'top top',
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        },
      )
    })

    gsap.to('.hero-backdrop-name', {
      yPercent: 38,
      opacity: 0.28,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    })

    motionContext = gsap.matchMedia()
    motionContext.add('(min-width: 901px) and (pointer: fine)', () => {
      gsap.to('.portrait-card', {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })
    })
  }, portfolioRoot.value)
})

onUnmounted(() => {
  window.removeEventListener('scroll', scheduleHeaderUpdate)
  if (scrollFrame !== undefined) window.cancelAnimationFrame(scrollFrame)
  motionContext?.revert()
  context?.revert()
  window.clearInterval(clockInterval)
  window.clearInterval(quoteInterval)
})
</script>

<template>
  <main ref="portfolioRoot">
    <header ref="headerElement" class="site-header shell" :class="{ 'header-hidden': !headerVisible, 'menu-open': menuOpen }" :inert="!headerVisible" :aria-hidden="!headerVisible" @keydown.esc="closeMenu">
      <a class="header-brand" href="#top" @click="closeMenu">{{ profile.name }}</a>
      <div class="header-nav-panel">
        <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="portfolio-navigation" @click="toggleMenu">
          <span>{{ menuOpen ? 'Close' : 'Menu' }}</span><span class="menu-glyph" :class="{ 'menu-glyph-open': menuOpen }" aria-hidden="true"><i></i><i></i><i></i></span>
        </button>
        <nav id="portfolio-navigation" v-show="menuOpen" aria-label="Main navigation">
          <a href="#about" @click="closeMenu">About</a>
          <a href="#education" @click="closeMenu">Education</a>
          <a href="#experience" @click="closeMenu">Experience</a>
          <a href="#work" @click="closeMenu">Projects</a>
          <a href="#gallery" @click="closeMenu">Gallery</a>
          <a href="#arcade" @click="closeMenu">Play</a>
          <a href="#approach" @click="closeMenu">Process</a>
          <a href="#contact" @click="closeMenu">Contact</a>
        </nav>
      </div>
    </header>

    <section id="top" class="hero shell">
      <div class="hero-backdrop-name" aria-hidden="true">KENNETH</div>
      <div class="hero-world-map" aria-hidden="true"></div>
      <div class="hero-content">
        <p class="eyebrow hero-kicker"><span class="eyebrow-line"></span> ASPIRING WEB DEVELOPER · DAVAO DEL SUR</p>
        <h1 class="hero-title">You can<br />call me Mad.<br /><em>{{ profile.name }}</em></h1>
        <p class="hero-copy">{{ profile.tagline }} I’m building my skills through thoughtful, hands-on web projects.</p>
        <div class="hero-actions">
          <a class="button button-dark" href="#work">Explore my work <span>↘</span></a>
          <a class="text-link" href="#contact">Let’s talk <span>↗</span></a>
          <aside class="hero-moment" aria-label="Current date and rotating quote">
            <time>{{ currentTime }}</time>
            <span class="moment-orbit" aria-hidden="true"></span>
            <blockquote aria-live="polite">“{{ currentQuote }}”</blockquote>
          </aside>
        </div>
        <div class="hero-facts" aria-label="Portfolio highlights">
          <div><strong>{{ String(projects.length).padStart(2, '0') }}</strong><span>FEATURED PROJECT</span></div>
          <div><strong>PH</strong><span>BASED IN DAVAO</span></div>
          <div><strong>VUE</strong><span>CURRENTLY LEARNING</span></div>
        </div>
        <a class="scroll-note" href="#about"><span class="scroll-line"></span> SCROLL TO EXPLORE</a>
      </div>
      <div class="hero-visual">
        <div class="portrait-card" aria-label="Editorial portrait of Kenneth Lance Jorolan">
          <img class="profile-photo" src="/images/kenneth-lance-jorolan.png?v=2" alt="Kenneth Lance Jorolan in a dark jacket" fetchpriority="high" />
        </div>
      </div>
      <div class="hero-marquee" aria-hidden="true">
        <div class="hero-marquee-track">
          <div class="hero-marquee-group"><span>You can call me Mad</span><i></i><span>Aspiring Web Developer</span><i></i><span>Digos City · Philippines</span><i></i></div>
          <div class="hero-marquee-group"><span>You can call me Mad</span><i></i><span>Aspiring Web Developer</span><i></i><span>Digos City · Philippines</span><i></i></div>
        </div>
      </div>
    </section>

    <section id="about" class="about section-pad">
      <div class="shell about-grid">
        <p class="eyebrow about-eyebrow"><span class="eyebrow-line"></span> A LITTLE ABOUT ME</p>
        <h2 class="about-lead" :aria-label="profile.bio[0]"><template v-for="(word, index) in profile.bio[0].split(' ')" :key="index"><span class="about-word-mask" aria-hidden="true"><span class="about-word">{{ word }}</span></span>{{ ' ' }}</template></h2>
        <div class="about-copy"><p>{{ profile.bio[1] }}</p><div class="location-note"><span class="location-icon">◎</span><span>Currently based in<br /><strong>{{ profile.location }}</strong></span></div></div>
      </div>
    </section>

    <section id="education" class="education section-pad">
      <div class="shell">
        <div class="section-heading" data-reveal>
          <div><p class="eyebrow"><span class="eyebrow-line"></span> EDUCATION</p><h2>Where I’ve <em>learned.</em></h2></div>
          <span class="section-count">( 02 )</span>
        </div>
        <div class="education-grid">
          <article class="education-card education-panel-light">
            <div class="education-card-top"><span class="education-index">01</span><span class="education-level">ELEMENTARY</span></div>
            <h3>Donmariano Marcos<br />Elementary School</h3>
            <p>Elementary education</p>
            <div class="education-card-bottom"><span class="education-status"><i></i> GRADUATE</span><span class="education-plus" aria-hidden="true">+</span></div>
          </article>
          <article class="education-card education-panel-dark">
            <div class="education-card-top"><span class="education-index">02</span><span class="education-level">HIGH SCHOOL</span></div>
            <h3>Digos City National<br />High School</h3>
            <p>Secondary education</p>
            <div class="education-card-bottom"><span class="education-status"><i></i> GRADUATE</span><span class="education-plus" aria-hidden="true">+</span></div>
          </article>
          <article class="education-card education-panel-light education-current">
            <div class="education-card-top"><span class="education-index">03</span><span class="education-level">COLLEGE</span></div>
            <h3>Cor Jesu College</h3>
            <p>Currently in 3rd year</p>
            <div class="education-card-bottom"><span class="education-status"><i></i> IN PROGRESS</span><span class="education-plus" aria-hidden="true">+</span></div>
          </article>
        </div>
      </div>
    </section>

    <section id="experience" class="experience section-pad">
      <div class="shell">
        <div class="section-heading" data-reveal>
          <div>
            <p class="eyebrow"><span class="eyebrow-line"></span> WORK EXPERIENCE</p>
            <h2 aria-label="Where I’ve contributed.">
              <template v-for="(word, wordIndex) in experienceTitleWords" :key="word">
                <em v-if="wordIndex === 2" class="experience-title-word" aria-hidden="true">
                  <span v-for="(character, characterIndex) in word" :key="characterIndex" class="experience-title-char">{{ character }}</span>
                </em>
                <span v-else class="experience-title-word" aria-hidden="true">
                  <span v-for="(character, characterIndex) in word" :key="characterIndex" class="experience-title-char">{{ character }}</span>
                </span>
                <span v-if="wordIndex < experienceTitleWords.length - 1" aria-hidden="true"> </span>
              </template>
            </h2>
          </div>
          <span class="section-count">( 03 )</span>
        </div>
        <div class="experience-list">
          <article class="experience-entry experience-panel-light">
            <span class="experience-number">01</span>
            <div class="experience-role"><h3>Virtual Assistant</h3><p>Remotasks</p></div>
            <span class="experience-type">1 YEAR</span>
          </article>
          <article class="experience-entry experience-panel-dark">
            <span class="experience-number">02</span>
            <div class="experience-role"><h3>Job Order</h3><p>Government</p></div>
            <span class="experience-type">ONGOING</span>
          </article>
          <article class="experience-entry experience-panel-light">
            <span class="experience-number">03</span>
            <div class="experience-role"><h3>Promodiser</h3><p>Gmall</p></div>
            <span class="experience-type">2 YEARS</span>
          </article>
        </div>
      </div>
    </section>

    <section id="work" class="work section-pad">
      <div class="shell">
        <div class="section-heading" data-reveal><div><p class="eyebrow"><span class="eyebrow-line"></span> SELECTED WORK</p><h2>Things I’ve <em>made.</em></h2></div><span class="section-count">( 04 )</span></div>
        <div class="project-grid">
          <article v-for="project in projects" :key="project.number" class="project-card">
            <div class="project-art" :class="project.art" aria-hidden="true">
              <div class="art-window"><div class="window-bar"><i></i><i></i><i></i><span>my-work — preview</span></div><div class="window-body"><div class="window-nav"><b>KJ.</b><span>ABOUT&nbsp;&nbsp; WORK&nbsp;&nbsp; CONTACT</span></div><div class="window-copy"><small>PORTFOLIO / 2026</small><strong>Curious mind.<br /><em>Builder’s hands.</em></strong><span class="window-cta">Explore my work&nbsp; ↘</span></div><div class="window-orb"></div></div></div>
              <div v-if="project.art === 'todo-art'" class="mini-todo-preview">
                <div class="mini-preview-head"><span>today, in focus.</span><b>03 LEFT</b></div>
                <div class="mini-task"><i></i><span>Plan the week</span></div>
                <div class="mini-task complete"><i></i><span>Make a little progress</span></div>
                <div class="mini-task"><i></i><span>Take a proper break</span></div>
                <div class="mini-add">+ <span>What needs doing?</span></div>
              </div>
              <div v-else-if="project.art === 'landing-art'" class="mini-landing-preview">
                <span class="mini-landing-logo">aster<span>®</span></span><i class="mini-landing-orb"></i>
                <strong>Make room<br />for <em>good ideas.</em></strong><small>A CREATIVE STUDIO CONCEPT</small>
              </div>
              <span v-if="project.art !== 'portfolio-art'" class="art-label">LIVE DEMO ↗</span>
              <span v-if="project.art === 'portfolio-art'" class="art-label">DESIGNING IN PROGRESS</span>
            </div>
            <div class="project-meta"><span class="project-number">{{ project.number }}</span><span class="project-category">PERSONAL</span><span class="project-year">2026</span></div>
            <div class="project-details"><div><h3>{{ project.title }}</h3><p>{{ project.description }}</p></div><span class="project-arrow" aria-hidden="true">↗</span></div>
            <div class="project-bottom"><div class="tag-list"><span v-for="tag in project.technologies" :key="tag">{{ tag }}</span></div><div v-if="project.githubUrl || project.liveUrl" class="project-links"><a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" rel="noreferrer">GITHUB ↗</a><RouterLink v-if="project.liveUrl?.startsWith('/')" :to="project.liveUrl">LIVE SITE ↗</RouterLink><a v-else-if="project.liveUrl" :href="project.liveUrl" target="_blank" rel="noreferrer">LIVE SITE ↗</a></div></div>
          </article>
        </div>
      </div>
    </section>

    <PhotoGallery />
    <TypingSpeedChallenge />

    <section id="approach" class="approach section-pad">
      <div class="shell approach-grid">
        <article class="approach-panel skill-panel">
          <p class="eyebrow"><span class="eyebrow-line"></span> SKILLS & INTERESTS</p>
          <h2 aria-label="Creative by nature.">
            <template v-for="(word, wordIndex) in approachTitleWords" :key="word">
              <em v-if="wordIndex === 2" class="approach-title-word" aria-hidden="true">
                <span v-for="(character, characterIndex) in word" :key="characterIndex" class="approach-title-char">{{ character }}</span>
              </em>
              <span v-else class="approach-title-word" aria-hidden="true">
                <span v-for="(character, characterIndex) in word" :key="characterIndex" class="approach-title-char">{{ character }}</span>
              </span>
              <br v-if="wordIndex === 1" aria-hidden="true" />
              <span v-else-if="wordIndex < 2" aria-hidden="true"> </span>
            </template>
          </h2>
          <p class="panel-copy">Tools I use to build, create, and unwind.</p>
          <div class="tool-group">
            <h3>WEB DEVELOPMENT</h3>
            <div class="tech-logo-grid" aria-label="Web development skills">
              <span class="tech-logo tech-html" role="img" aria-label="HTML5" title="HTML5"><i class="mdi mdi-language-html5" aria-hidden="true"></i></span>
              <span class="tech-logo tech-css" role="img" aria-label="CSS3" title="CSS3"><i class="mdi mdi-language-css3" aria-hidden="true"></i></span>
              <span class="tech-logo tech-js" role="img" aria-label="JavaScript" title="JavaScript"><i class="mdi mdi-language-javascript" aria-hidden="true"></i></span>
              <span class="tech-logo tech-vue" role="img" aria-label="Vue.js" title="Vue.js"><i class="mdi mdi-vuejs" aria-hidden="true"></i></span>
              <span class="tech-logo tech-vuetify" role="img" aria-label="Vuetify" title="Vuetify"><i class="mdi mdi-vuetify" aria-hidden="true"></i></span>
              <span class="tech-logo tech-laravel" role="img" aria-label="Laravel" title="Laravel"><i class="mdi mdi-laravel" aria-hidden="true"></i></span>
              <span class="tech-logo tech-postgres" role="img" aria-label="PostgreSQL database" title="PostgreSQL"><i class="mdi mdi-elephant" aria-hidden="true"></i></span>
              <span class="tech-logo tech-gsap" role="img" aria-label="GSAP" title="GSAP"><b aria-hidden="true">GSAP</b></span>
              <span class="tech-logo tech-github" role="img" aria-label="GitHub" title="GitHub"><i class="mdi mdi-github" aria-hidden="true"></i></span>
              <span class="tech-logo tech-vercel" role="img" aria-label="Vercel" title="Vercel"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 24 21H0L12 3Z" fill="currentColor" /></svg></span>
            </div>
          </div>
          <div class="tool-group">
            <h3>VIDEO & PHOTO EDITING</h3>
            <div class="adobe-skills">
              <span class="adobe-mark adobe-mark-pr" role="img" aria-label="Adobe Premiere Pro" title="Adobe Premiere Pro">Pr</span>
              <span class="adobe-mark adobe-mark-ps" role="img" aria-label="Adobe Photoshop" title="Adobe Photoshop">Ps</span>
            </div>
          </div>
          <div class="tool-group gaming-group">
            <h3>GAMING</h3>
            <div class="skill-list game-list" aria-label="Games I play">
              <span class="game-badge game-valorant" role="img" aria-label="Valorant"><svg class="game-logo" viewBox="0 0 32 32" aria-hidden="true"><path d="M4 5h7l5 12 5-12h7L16 28 4 5Z" fill="currentColor"/><path d="M20 18h8l-4 7h-8l4-7Z" fill="#080808"/></svg><span class="game-name">VALORANT</span></span>
              <span class="game-badge game-dota" role="img" aria-label="Dota 2"><svg class="game-logo" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2.8A13.2 13.2 0 1 0 16 29.2 13.2 13.2 0 0 0 16 2.8Zm5.6 5.1-2.1 5.3 4.1 3.5-5.4 1.4-1.6 5.3-3.1-4.6-5.6.1 3.4-4.4-1.8-5.3 5.2 2 4.7-3.3-.2 5.6 4.4 3.4-5.6.2 3.6-3.9Z" fill="currentColor"/></svg><span class="game-name">DOTA 2</span></span>
              <span class="game-badge game-league" role="img" aria-label="League of Legends"><svg class="game-logo" viewBox="0 0 32 32" aria-hidden="true"><path d="M7 4h5v18h13v5H7V4Zm11 0h8v5h-8V4Zm0 8h7v5h-7v-5Z" fill="currentColor"/><path d="M4 3h2v26H4z" fill="currentColor"/></svg><span class="game-name">LEAGUE OF LEGENDS</span></span>
              <span class="game-badge game-apex" role="img" aria-label="Apex Legends"><svg class="game-logo" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3 29 27h-7l-6-11-6 11H3L16 3Z" fill="currentColor"/><path d="M12.3 23h7.4l-3.7-6.7-3.7 6.7Z" fill="#080808"/><path d="M10 29h12" stroke="currentColor" stroke-width="2"/></svg><span class="game-name">APEX LEGENDS</span></span>
            </div>
          </div>
        </article>
        <article class="approach-panel process-panel">
          <p class="eyebrow"><span class="eyebrow-line"></span> HOW I APPROACH A BUILD</p>
          <ol class="process-list">
            <li><span>01</span><div><strong>Understand</strong><p>Get clear on the goal and who it is for.</p></div></li>
            <li><span>02</span><div><strong>Shape</strong><p>Plan the content, layout, and visual direction.</p></div></li>
            <li><span>03</span><div><strong>Build</strong><p>Turn the idea into a responsive working page.</p></div></li>
            <li><span>04</span><div><strong>Refine</strong><p>Review details, improve, and keep learning.</p></div></li>
          </ol>
        </article>
        <aside class="approach-quote">
          <span class="quote-mark">“</span>
          <blockquote>Being a misfit means I’m not afraid to look at an idea from a different angle.</blockquote>
          <span class="quote-signoff">KENNETH “MAD” JOROLAN</span>
          <a href="#contact" class="quote-link"><span class="quote-link-text">LET’S MAKE SOMETHING THOUGHTFUL</span><span aria-hidden="true">↗</span></a>
        </aside>
      </div>
    </section>

    <section id="contact" class="contact section-pad">
      <div class="shell contact-inner">
        <div class="contact-info">
          <p class="eyebrow"><span class="eyebrow-line"></span> LET’S CONNECT</p>
          <p class="contact-location">{{ profile.location }}</p>
          <div class="contact-methods">
            <a class="contact-email" :href="`mailto:${profile.email}`"><i class="contact-icon mdi mdi-email-outline" aria-hidden="true"></i>{{ profile.email }} <span>↗</span></a>
            <a class="contact-email" :href="`tel:${profile.phoneLink}`"><i class="contact-icon mdi mdi-phone-outline" aria-hidden="true"></i>{{ profile.phone }} <span>↗</span></a>
            <a class="contact-email" :href="profile.facebookUrl" target="_blank" rel="noreferrer"><i class="contact-icon mdi mdi-facebook" aria-hidden="true"></i>Facebook · Lance Kenneth <span>↗</span></a>
          </div>
        </div>
        <nav class="contact-navigation" aria-label="Footer navigation">
          <a href="#top">HOME</a>
          <a href="#about">ABOUT</a>
          <a href="#education">EDUCATION</a>
          <a href="#experience">EXPERIENCE</a>
          <a href="#work">PROJECTS</a>
          <a href="#gallery">GALLERY</a>
          <a href="#arcade">PLAY</a>
          <a href="#contact">CONTACT</a>
        </nav>
      <div class="contact-callout">
          <h2>Curious minds<br /><em>build together.</em></h2>
          <a :href="`mailto:${profile.email}`" class="button button-light"><span class="button-label">Get in touch</span><span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>

    <footer class="site-footer shell"><a class="brand" href="#top">KJ<span>.</span></a><span>© {{ new Date().getFullYear() }} Kenneth Lance Jorolan</span><div class="footer-social"><a :href="`mailto:${profile.email}`" aria-label="Email Kenneth">EMAIL ↗</a><a :href="`tel:${profile.phoneLink}`" aria-label="Call Kenneth">CALL ↗</a><a :href="profile.facebookUrl" target="_blank" rel="noreferrer" aria-label="Find Lance Kenneth on Facebook">FACEBOOK ↗</a></div><a class="back-top" href="#top">BACK TO TOP ↑</a></footer>
  </main>
</template>
