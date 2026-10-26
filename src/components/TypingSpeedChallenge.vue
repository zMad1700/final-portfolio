<script setup>
import { computed, nextTick, onUnmounted, ref } from 'vue'

const wordBank = 'curiosity turns small ideas into thoughtful work every new project teaches us something useful about people design and the details that make digital experiences feel clear calm and human good interfaces invite exploration while careful motion helps each moment find its rhythm build with patience test what matters and keep learning one useful step at a time'.split(' ')
const passage = ref(makePassage())
const duration = ref(30)
const typed = ref('')
const ready = ref(false)
const started = ref(false)
const finished = ref(false)
const elapsedSeconds = ref(0)
const startedAt = ref(0)
const input = ref(null)
let timerId

const correctCharacters = computed(() => {
  let total = 0
  for (let index = 0; index < typed.value.length; index += 1) {
    if (typed.value[index] === passage.value[index]) total += 1
  }
  return total
})
const accuracy = computed(() => typed.value.length ? Math.round((correctCharacters.value / typed.value.length) * 100) : 0)
const wordsPerMinute = computed(() => {
  if (!started.value) return 0
  const minutes = Math.max(elapsedSeconds.value, 0.1) / 60
  return Math.round((correctCharacters.value / 5) / minutes)
})
const timeLeft = computed(() => Math.max(0, duration.value - Math.floor(elapsedSeconds.value)))
const typedWords = computed(() => typed.value.trim() ? typed.value.trim().split(/\s+/).length : 0)
const status = computed(() => {
  if (finished.value) return 'Challenge complete — nice work.'
  if (started.value) return 'Keep going. Stay in rhythm.'
  if (ready.value) return 'Type the words below to start the clock.'
  return 'Choose a time and start when you’re ready.'
})

function makePassage() {
  const words = Array.from({ length: 110 }, () => wordBank[Math.floor(Math.random() * wordBank.length)])
  return `${words.join(' ')}.`
}

function setDuration(seconds) {
  if (started.value && !finished.value) return
  duration.value = seconds
  resetChallenge(false)
}

function resetChallenge(createNewPassage = true) {
  window.clearInterval(timerId)
  timerId = undefined
  typed.value = ''
  started.value = false
  finished.value = false
  elapsedSeconds.value = 0
  startedAt.value = 0
  ready.value = false
  if (createNewPassage) passage.value = makePassage()
}

async function startOrFocus() {
  if (!ready.value || finished.value) {
    resetChallenge()
    ready.value = true
  }
  await nextTick()
  input.value?.focus()
}

function onTyping(event) {
  typed.value = event.target.value.slice(0, passage.value.length)
  if (!started.value && typed.value.length) {
    started.value = true
    startedAt.value = Date.now()
    timerId = window.setInterval(updateClock, 100)
  }
  if (typed.value.length >= passage.value.length) finishChallenge()
}

function updateClock() {
  elapsedSeconds.value = Math.min((Date.now() - startedAt.value) / 1000, duration.value)
  if (elapsedSeconds.value >= duration.value) finishChallenge()
}

function finishChallenge() {
  if (finished.value) return
  if (startedAt.value) elapsedSeconds.value = Math.min((Date.now() - startedAt.value) / 1000, duration.value)
  finished.value = true
  window.clearInterval(timerId)
  timerId = undefined
}

function characterClass(index) {
  if (index < typed.value.length) return typed.value[index] === passage.value[index] ? 'typed-correct' : 'typed-error'
  if (index === typed.value.length && !finished.value) return 'typing-current'
  return ''
}

onUnmounted(() => window.clearInterval(timerId))
</script>

<template>
  <section id="arcade" class="typing-challenge section-pad">
    <div class="shell typing-layout">
      <div class="typing-intro">
        <p class="eyebrow"><span class="eyebrow-line"></span> A LITTLE BRAIN BREAK</p>
        <h2>Find your<br /><em>flow.</em></h2>
        <p class="typing-description">A quick typing challenge. Keep your pace, aim for accuracy, and see how many words you can get down before time runs out.</p>
        <div class="typing-how"><span class="typing-how-icon">⌁</span><span>Choose 30 or 60 seconds.<br /><strong>Your timer starts with your first keystroke.</strong></span></div>
      </div>

      <div class="typing-panel">
        <div class="typing-header">
          <div><span class="typing-label">KJ ARCADE / 01</span><h3>Typing speed challenge</h3></div>
          <div class="timer-display" :class="{ 'timer-urgent': ready && !finished && timeLeft <= 5 }"><strong>{{ String(timeLeft).padStart(2, '0') }}</strong><small>SECONDS</small></div>
        </div>

        <div class="typing-modes" aria-label="Challenge duration">
          <button v-for="seconds in [30, 60]" :key="seconds" type="button" :class="{ selected: duration === seconds }" :disabled="started && !finished" :aria-pressed="duration === seconds" @click="setDuration(seconds)">{{ seconds }} seconds</button>
          <span class="typing-live"><i></i> {{ started && !finished ? 'IN PROGRESS' : finished ? 'FINISHED' : 'READY' }}</span>
        </div>

        <div class="typing-stats" aria-label="Your results" aria-live="polite">
          <div><strong>{{ wordsPerMinute }}</strong><span>WORDS / MIN</span></div>
          <div><strong>{{ accuracy }}<small>%</small></strong><span>ACCURACY</span></div>
          <div><strong>{{ typedWords }}</strong><span>WORDS TYPED</span></div>
        </div>

        <p class="typing-status" aria-live="polite">{{ status }}</p>
        <div class="passage-wrap" :class="{ 'passage-disabled': !ready }" @click="ready && !finished && input?.focus()">
          <p class="sr-only">{{ passage }}</p>
          <div class="typing-passage" aria-hidden="true"><span v-for="(character, index) in passage" :key="index" :class="characterClass(index)">{{ character === ' ' ? '\u00a0' : character }}</span></div>
        </div>
        <label class="sr-only" for="typing-input">Type the displayed words here</label>
        <textarea id="typing-input" ref="input" :value="typed" class="typing-input" rows="2" :disabled="!ready || finished" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Your typing goes here…" @input="onTyping"></textarea>

        <div class="typing-actions"><button class="typing-start" type="button" @click="startOrFocus">{{ finished ? 'Try again' : started ? 'Restart challenge' : ready ? 'Continue typing' : 'Start challenge' }} <span>{{ finished ? '↻' : '→' }}</span></button><span class="typing-hint">{{ finished ? 'Your result is above.' : 'Punctuation counts toward accuracy.' }}</span></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.typing-challenge { padding-top: 32px; padding-bottom: 108px; }
.typing-layout { display: grid; grid-template-columns: .72fr 1.28fr; align-items: center; gap: clamp(38px, 7vw, 92px); }
.typing-intro h2 { margin: 0; color: #f5eefc; font: 700 clamp(43px, 5.5vw, 68px)/.98 var(--display); letter-spacing: -.065em; }.typing-intro h2 em { color: #c9aedc; font: italic 400 1em Georgia, serif; letter-spacing: -.06em; }
.typing-description { max-width: 360px; margin: 18px 0 28px; color: #c4b4d1; font-size: 12px; line-height: 1.8; }
.typing-how { display: flex; align-items: center; gap: 11px; color: #ad9abc; font-size: 10px; line-height: 1.7; }.typing-how strong { color: #e7daef; font-weight: 500; }.typing-how-icon { display: grid; width: 34px; height: 34px; flex: 0 0 34px; place-items: center; border: 1px solid rgb(227 206 243 / 19%); border-radius: 10px; color: #dfc4ed; background: rgb(172 145 192 / 12%); font-size: 22px; }
.typing-panel { min-width: 0; padding: 25px; border: 1px solid rgb(227 206 243 / 23%); border-radius: 22px; background: linear-gradient(145deg, rgb(87 40 102 / 26%), rgb(43 16 60 / 36%)); box-shadow: 0 24px 65px rgb(9 3 18 / 30%), inset 0 1px rgb(255 255 255 / 14%); -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px); }
.typing-header { display: flex; align-items: center; justify-content: space-between; gap: 15px; }.typing-label { color: #bba5cb; font: 8px var(--mono); letter-spacing: .1em; }.typing-header h3 { margin: 6px 0 0; color: #f5eefc; font: 600 clamp(17px, 2vw, 22px)/1.2 var(--display); letter-spacing: -.04em; }.timer-display { display: flex; min-width: 67px; flex-direction: column; align-items: center; padding: 8px 10px; border: 1px solid rgb(227 206 243 / 18%); border-radius: 11px; background: rgb(20 11 28 / 25%); }.timer-display strong { color: #e7d5f1; font: 700 22px/1 var(--display); font-variant-numeric: tabular-nums; }.timer-display small { margin-top: 4px; color: #aa96b8; font: 6px var(--mono); letter-spacing: .12em; }.timer-display.timer-urgent { border-color: rgb(244 143 143 / 45%); box-shadow: 0 0 20px rgb(244 100 130 / 14%); }.timer-urgent strong { color: #ffb1c2; }
.typing-modes { display: flex; align-items: center; gap: 7px; margin-top: 19px; padding-bottom: 15px; border-bottom: 1px solid rgb(227 206 243 / 13%); }.typing-modes button { padding: 7px 11px; border: 1px solid transparent; border-radius: 99px; color: #b6a4c2; background: transparent; font: 8px var(--mono); cursor: pointer; }.typing-modes button.selected { border-color: rgb(227 206 243 / 21%); color: #f2e8f8; background: rgb(172 145 192 / 15%); }.typing-modes button:disabled { cursor: not-allowed; opacity: .55; }.typing-live { display: inline-flex; align-items: center; gap: 6px; margin-left: auto; color: #a997b4; font: 7px var(--mono); letter-spacing: .06em; }.typing-live i { width: 5px; height: 5px; border-radius: 50%; background: #a9d89a; box-shadow: 0 0 8px #a9d89a; }
.typing-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 15px 0 12px; }.typing-stats > div { display: grid; gap: 4px; padding: 10px 11px; border: 1px solid rgb(227 206 243 / 12%); border-radius: 10px; background: rgb(255 255 255 / 3%); }.typing-stats strong { color: #f0e6f6; font: 700 19px/1 var(--display); font-variant-numeric: tabular-nums; }.typing-stats strong small { margin-left: 1px; color: #c9aedc; font-size: 11px; }.typing-stats span { color: #a997b4; font: 6px var(--mono); letter-spacing: .07em; }
.typing-status { margin: 0 0 9px; color: #d3c1df; font-size: 9px; }.passage-wrap { max-height: 145px; padding: 14px; overflow: auto; border: 1px solid rgb(227 206 243 / 15%); border-radius: 11px; background: rgb(15 8 21 / 32%); cursor: text; }.passage-disabled { opacity: .76; }.typing-passage { color: #9685a1; font: 12px/1.95 var(--mono); letter-spacing: .005em; white-space: pre-wrap; overflow-wrap: anywhere; }.typing-passage .typed-correct { color: #e9d9f2; }.typing-passage .typed-error { border-radius: 2px; color: #ffc0cd; background: rgb(220 82 112 / 28%); }.typing-passage .typing-current { border-bottom: 1px solid #e8cbf6; color: #f4e9fa; animation: typing-caret 1s steps(2, start) infinite; }
.typing-input { display: block; width: 100%; min-height: 58px; margin-top: 10px; padding: 12px 13px; resize: vertical; border: 1px solid rgb(227 206 243 / 18%); border-radius: 10px; outline: none; color: #f5eefc; background: rgb(15 8 21 / 34%); font: 11px/1.6 var(--mono); transition: border-color .2s, box-shadow .2s; }.typing-input::placeholder { color: #8d7a99; }.typing-input:focus { border-color: #ac91c0; box-shadow: 0 0 0 3px rgb(172 145 192 / 11%); }.typing-input:disabled { opacity: .65; resize: none; }
.typing-actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 14px; }.typing-start { padding: 10px 13px; border: 1px solid rgb(227 206 243 / 25%); border-radius: 99px; color: #f3eafa; background: linear-gradient(110deg, rgb(87 40 102 / 60%), rgb(143 82 155 / 32%)); font-size: 9px; cursor: pointer; }.typing-start span { margin-left: 10px; color: #dfc4ed; font-size: 13px; }.typing-start:hover { border-color: rgb(227 206 243 / 45%); box-shadow: 0 0 20px rgb(172 145 192 / 13%); }.typing-hint { color: #a18eae; font-size: 8px; text-align: right; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; clip-path: inset(50%); }
@keyframes typing-caret { to { border-color: transparent; } }
@media (max-width: 760px) { .typing-challenge { padding-top: 4px; padding-bottom: 78px; }.typing-layout { grid-template-columns: 1fr; gap: 28px; }.typing-description { margin-bottom: 18px; }.typing-panel { padding: 21px; } }
@media (max-width: 440px) { .typing-panel { padding: 17px 14px; border-radius: 17px; }.typing-stats { gap: 5px; }.typing-stats > div { padding: 9px 7px; }.typing-stats strong { font-size: 17px; }.typing-stats span { font-size: 5px; }.typing-modes button { padding-inline: 8px; }.typing-live { font-size: 6px; }.typing-actions { align-items: flex-start; flex-direction: column; }.typing-hint { text-align: left; } }
@media (prefers-reduced-motion: reduce) { .typing-passage .typing-current { animation: none; } }
</style>
