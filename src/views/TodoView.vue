<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

const tasks = ref([])
const draft = ref('')
const filter = ref('all')
const ready = ref(false)

const visibleTasks = computed(() => {
  if (filter.value === 'active') return tasks.value.filter((task) => !task.done)
  if (filter.value === 'completed') return tasks.value.filter((task) => task.done)
  return tasks.value
})
const remaining = computed(() => tasks.value.filter((task) => !task.done).length)

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('mad-todo-tasks') || '[]')
    if (Array.isArray(saved)) tasks.value = saved.filter((task) => task && typeof task.text === 'string')
  } catch {
    tasks.value = []
  }
  ready.value = true
})

watch(tasks, (value) => {
  if (ready.value) localStorage.setItem('mad-todo-tasks', JSON.stringify(value))
}, { deep: true })

function addTask() {
  const text = draft.value.trim()
  if (!text) return
  tasks.value.unshift({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, done: false })
  draft.value = ''
}

function removeTask(id) {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}

function clearCompleted() {
  tasks.value = tasks.value.filter((task) => !task.done)
}
</script>

<template>
  <main class="demo-page todo-page">
    <header class="demo-nav">
      <RouterLink class="demo-brand" to="/">KJ<span>.</span></RouterLink>
      <RouterLink class="demo-back" to="/#work">← Back to portfolio</RouterLink>
    </header>

    <section class="todo-layout">
      <div class="todo-intro">
        <p class="demo-kicker"><span></span> MINI PROJECT / 02</p>
        <h1>A little more<br /><em>order.</em></h1>
        <p class="demo-description">A simple, calm space to collect your tasks, keep moving, and see what you’ve finished.</p>
        <div class="todo-note"><span class="note-dot"></span> Your tasks stay saved in this browser.</div>
      </div>

      <section class="todo-board" aria-labelledby="todo-title">
        <div class="todo-board-head">
          <div><p class="todo-overline">YOUR LIST</p><h2 id="todo-title">Today, in focus.</h2></div>
          <span class="todo-count">{{ String(remaining).padStart(2, '0') }} LEFT</span>
        </div>

        <form class="todo-form" @submit.prevent="addTask">
          <label class="sr-only" for="new-task">Add a task</label>
          <input id="new-task" v-model="draft" maxlength="100" placeholder="What needs doing?" autocomplete="off" />
          <button type="submit" :disabled="!draft.trim()" aria-label="Add task">+</button>
        </form>

        <div class="todo-controls" aria-label="Filter tasks">
          <button v-for="option in ['all', 'active', 'completed']" :key="option" type="button" :class="{ selected: filter === option }" @click="filter = option">{{ option }}</button>
          <button v-if="tasks.some((task) => task.done)" class="clear-done" type="button" @click="clearCompleted">Clear completed</button>
        </div>

        <ul v-if="visibleTasks.length" class="todo-list">
          <li v-for="task in visibleTasks" :key="task.id" :class="{ done: task.done }">
            <label class="todo-task">
              <input v-model="task.done" type="checkbox" />
              <span class="custom-check" aria-hidden="true"></span>
              <span>{{ task.text }}</span>
            </label>
            <button type="button" class="delete-task" :aria-label="`Delete ${task.text}`" @click="removeTask(task.id)">×</button>
          </li>
        </ul>
        <div v-else class="todo-empty"><span aria-hidden="true">✳</span><p>{{ filter === 'all' ? 'Your list is clear.' : `No ${filter} tasks.` }}</p><small>{{ filter === 'all' ? 'Add a task above to get started.' : 'Try another filter or add a new task.' }}</small></div>
        <div class="todo-board-foot"><span>{{ tasks.length }} {{ tasks.length === 1 ? 'task' : 'tasks' }} total</span><span>SMALL STEPS COUNT</span></div>
      </section>
    </section>
    <footer class="demo-footer"><span>BUILT BY KENNETH JOROLAN</span><span>VUE · CSS · LOCAL STORAGE</span></footer>
  </main>
</template>

<style scoped>
.demo-page { min-height: 100vh; padding: 0 max(24px, calc((100vw - 1180px) / 2)); color: #f5eefc; background: radial-gradient(ellipse at 77% 35%, rgb(87 40 102 / 26%), transparent 38%), linear-gradient(140deg, #170d20, #21132a 60%, #170d20); }
.demo-nav { display: flex; height: 78px; align-items: center; justify-content: space-between; border-bottom: 1px solid rgb(227 206 243 / 16%); }
.demo-brand { font: 800 24px/1 var(--display); letter-spacing: -1.8px; }.demo-brand span { color: #ac91c0; }
.demo-back { color: #d0c1da; font-size: 12px; transition: color .2s; }.demo-back:hover { color: #fff; }
.todo-layout { display: grid; min-height: calc(100vh - 140px); grid-template-columns: .8fr 1.2fr; align-items: center; gap: clamp(42px, 8vw, 120px); padding: 65px 0 80px; }
.demo-kicker, .todo-overline { color: #c7accf; font: 9px var(--mono); letter-spacing: .14em; }.demo-kicker { display: flex; align-items: center; gap: 10px; }.demo-kicker span { width: 25px; height: 1px; background: #ac91c0; box-shadow: 0 0 12px #ac91c0; }
.todo-intro h1 { margin: 28px 0 20px; font: 700 clamp(52px, 7vw, 88px)/.94 var(--display); letter-spacing: -.07em; }.todo-intro h1 em { color: #c9aedc; font: italic 400 1em Georgia, serif; letter-spacing: -.06em; }
.demo-description { max-width: 370px; color: #c4b4d1; font-size: 14px; line-height: 1.8; }.todo-note { display: flex; align-items: center; gap: 9px; margin-top: 30px; color: #ae9bbd; font: 9px var(--mono); }.note-dot { width: 6px; height: 6px; border-radius: 50%; background: #a9d89a; box-shadow: 0 0 12px #a9d89a; }
.todo-board { padding: 30px; border: 1px solid rgb(227 206 243 / 22%); border-radius: 22px; background: linear-gradient(145deg, rgb(87 40 102 / 29%), rgb(43 16 60 / 42%)); box-shadow: 0 28px 80px rgb(5 2 10 / 32%), inset 0 1px rgb(255 255 255 / 15%); -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px); }
.todo-board-head { display: flex; align-items: end; justify-content: space-between; gap: 15px; margin-bottom: 24px; }.todo-overline { margin: 0 0 9px; font-size: 8px; }.todo-board h2 { margin: 0; font: 600 clamp(21px, 3vw, 29px)/1.1 var(--display); letter-spacing: -.05em; }.todo-count { padding: 7px 9px; border: 1px solid rgb(227 206 243 / 19%); border-radius: 999px; color: #d5c4df; font: 8px var(--mono); white-space: nowrap; }
.todo-form { display: flex; gap: 8px; }.todo-form input { width: 100%; min-width: 0; height: 48px; padding: 0 15px; border: 1px solid rgb(227 206 243 / 20%); border-radius: 10px; outline: 0; color: #f5eefc; background: rgb(15 8 21 / 40%); font: 12px 'DM Sans', sans-serif; }.todo-form input:focus { border-color: #ac91c0; box-shadow: 0 0 0 3px rgb(172 145 192 / 12%); }.todo-form input::placeholder { color: #8f7c9c; }.todo-form button { width: 48px; flex: 0 0 48px; border: 1px solid rgb(237 221 249 / 30%); border-radius: 10px; color: #fff; background: linear-gradient(135deg, #8f529b, #572866); font-size: 24px; cursor: pointer; }.todo-form button:disabled { opacity: .5; cursor: not-allowed; }
.todo-controls { display: flex; align-items: center; gap: 6px; margin: 20px 0 8px; }.todo-controls button { padding: 7px 10px; border: 0; border-radius: 99px; color: #ab9ab8; background: transparent; font: 9px var(--mono); text-transform: capitalize; cursor: pointer; }.todo-controls button.selected { color: #f6eefb; background: rgb(172 145 192 / 19%); }.todo-controls .clear-done { margin-left: auto; color: #cbb2dc; text-transform: none; }
.todo-list { display: grid; max-height: 330px; gap: 3px; margin: 8px 0 0; padding: 0; overflow: auto; list-style: none; }.todo-list li { display: flex; min-height: 50px; align-items: center; justify-content: space-between; gap: 10px; padding: 0 10px; border-bottom: 1px solid rgb(227 206 243 / 10%); }.todo-task { position: relative; display: flex; min-width: 0; align-items: center; gap: 11px; color: #e6dcef; font-size: 12px; cursor: pointer; }.todo-task input { position: absolute; width: 1px; height: 1px; opacity: 0; }.custom-check { display: grid; width: 17px; height: 17px; flex: 0 0 17px; place-items: center; border: 1px solid rgb(227 206 243 / 40%); border-radius: 5px; }.todo-task input:focus-visible + .custom-check { outline: 2px solid #d9b9ed; outline-offset: 3px; }.todo-task input:checked + .custom-check { border-color: #ac91c0; background: #8f529b; }.todo-task input:checked + .custom-check::after { width: 7px; height: 4px; border-bottom: 1.5px solid #fff; border-left: 1.5px solid #fff; content: ''; transform: translateY(-1px) rotate(-45deg); }.todo-list li.done .todo-task > span:last-child { color: #8d7b99; text-decoration: line-through; }.delete-task { width: 28px; height: 28px; flex: 0 0 28px; border: 0; border-radius: 7px; color: #a791b7; background: transparent; font-size: 19px; cursor: pointer; }.delete-task:hover { color: #fff; background: rgb(172 145 192 / 15%); }
.todo-empty { display: grid; min-height: 190px; align-content: center; justify-items: center; color: #b7a6c4; text-align: center; }.todo-empty > span { color: #c9aedc; font-size: 26px; }.todo-empty p { margin: 10px 0 4px; color: #eee5f5; font: 500 15px var(--display); }.todo-empty small { color: #a997b7; font-size: 10px; }.todo-board-foot { display: flex; justify-content: space-between; gap: 8px; margin-top: 20px; padding-top: 14px; border-top: 1px solid rgb(227 206 243 / 13%); color: #a894b7; font: 8px var(--mono); }.demo-footer { display: flex; justify-content: space-between; gap: 12px; padding: 18px 0 24px; border-top: 1px solid rgb(227 206 243 / 12%); color: #9f8cad; font: 8px var(--mono); letter-spacing: .08em; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; clip-path: inset(50%); }
@media (max-width: 760px) { .todo-page { padding-inline: 22px; }.todo-layout { min-height: auto; grid-template-columns: 1fr; gap: 35px; padding: 55px 0 62px; }.todo-intro h1 { margin: 22px 0 14px; }.todo-note { margin-top: 19px; } }
@media (max-width: 480px) { .todo-board { padding: 22px 17px; border-radius: 17px; }.todo-controls { gap: 1px; }.todo-controls button { padding-inline: 8px; }.todo-board-foot { font-size: 7px; }.demo-footer { font-size: 7px; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; } }
</style>
