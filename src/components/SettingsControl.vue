<script setup>
import { onMounted, ref, watch } from 'vue'

const open = ref(false)
const darkMode = ref(true)

onMounted(() => {
  const saved = localStorage.getItem('kj-portfolio-theme')
  darkMode.value = saved ? saved === 'dark' : true
  applyTheme()
})

watch(darkMode, () => {
  applyTheme()
  localStorage.setItem('kj-portfolio-theme', darkMode.value ? 'dark' : 'light')
})

function applyTheme() {
  document.documentElement.dataset.theme = darkMode.value ? 'dark' : 'light'
}
</script>

<template>
  <div class="settings-control">
    <button class="settings-trigger" type="button" aria-label="Settings" title="Settings" :aria-expanded="open" aria-controls="site-settings" @click="open = !open">
      <i class="mdi mdi-cog-outline" aria-hidden="true"></i>
    </button>
    <section v-if="open" id="site-settings" class="settings-popover" aria-label="Website settings">
      <div class="settings-heading"><button class="settings-close" type="button" aria-label="Close settings" @click="open = false">×</button></div>
      <label class="theme-setting">
        <span class="theme-icon"><i class="mdi" :class="darkMode ? 'mdi-weather-night' : 'mdi-white-balance-sunny'" aria-hidden="true"></i></span>
        <span class="theme-copy"><strong>Dark mode</strong><small>{{ darkMode ? 'On · easy on the eyes' : 'Off · light appearance' }}</small></span>
        <input v-model="darkMode" type="checkbox" role="switch" aria-label="Toggle dark mode" />
        <span class="theme-switch" aria-hidden="true"></span>
      </label>
    </section>
  </div>
</template>

<style scoped>
.settings-control { position: fixed; z-index: 100; right: 22px; bottom: 22px; display: grid; justify-items: end; gap: 10px; font-family: 'DM Sans', sans-serif; }
.settings-trigger { display: inline-flex; min-height: 44px; align-items: center; gap: 9px; padding: 0 15px; border: 1px solid rgb(227 206 243 / 34%); border-radius: 99px; color: #f5eefc; background: linear-gradient(135deg, rgb(87 40 102 / 92%), rgb(43 16 60 / 94%)); box-shadow: 0 10px 30px rgb(9 3 18 / 35%), inset 0 1px rgb(255 255 255 / 19%); font-size: 11px; cursor: pointer; -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px); transition: transform .2s ease, box-shadow .2s ease; }
.settings-trigger:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgb(9 3 18 / 42%), 0 0 20px rgb(172 145 192 / 19%); }.settings-trigger i { font-size: 17px; }
.settings-popover { width: min(310px, calc(100vw - 32px)); padding: 18px; border: 1px solid rgb(227 206 243 / 28%); border-radius: 17px; color: #f5eefc; background: linear-gradient(145deg, rgb(48 27 63 / 97%), rgb(34 18 47 / 98%)); box-shadow: 0 20px 60px rgb(4 1 9 / 48%), inset 0 1px rgb(255 255 255 / 12%); -webkit-backdrop-filter: blur(22px); backdrop-filter: blur(22px); }
.settings-heading { display: flex; justify-content: flex-end; margin-bottom: 12px; }.settings-close { width: 27px; height: 27px; border: 1px solid rgb(227 206 243 / 20%); border-radius: 50%; color: #e9def0; background: transparent; font-size: 17px; cursor: pointer; }
.theme-setting { position: relative; display: flex; min-height: 55px; align-items: center; gap: 11px; padding: 10px; border: 1px solid rgb(227 206 243 / 15%); border-radius: 11px; background: rgb(255 255 255 / 4%); cursor: pointer; }.theme-icon { display: grid; width: 32px; height: 32px; flex: 0 0 32px; place-items: center; border-radius: 9px; color: #e0c4f0; background: rgb(172 145 192 / 16%); font-size: 17px; }.theme-copy { display: grid; flex: 1; gap: 4px; }.theme-copy strong { color: #f3eaf8; font-size: 11px; font-weight: 600; }.theme-copy small { color: #b8a7c5; font-size: 9px; }.theme-setting input { position: absolute; right: 12px; width: 38px; height: 22px; margin: 0; opacity: 0; cursor: pointer; }.theme-switch { position: relative; width: 34px; height: 19px; flex: 0 0 34px; border: 1px solid rgb(255 255 255 / 24%); border-radius: 99px; background: rgb(255 255 255 / 12%); transition: background .2s; }.theme-switch::after { position: absolute; top: 2px; left: 2px; width: 13px; height: 13px; border-radius: 50%; content: ''; background: #e7d9ef; transition: transform .2s; }.theme-setting input:checked + .theme-switch { background: #8f529b; }.theme-setting input:checked + .theme-switch::after { transform: translateX(15px); }.theme-setting input:focus-visible + .theme-switch { outline: 2px solid #d9b9ed; outline-offset: 3px; }
@media (max-width: 480px) { .settings-control { right: 12px; bottom: 12px; }.settings-trigger { min-height: 41px; padding-inline: 13px; } }
.settings-trigger { border-color: #454545; border-radius: 4px; color: #f6f1e5; background: #111; box-shadow: 0 8px 24px rgb(0 0 0 / 35%); backdrop-filter: none; }
.settings-trigger { width: 42px; min-height: 42px; justify-content: center; padding: 0; }
.settings-trigger i { font-size: 18px; }
.settings-trigger:hover { border-color: #8a8a8a; box-shadow: 0 10px 28px rgb(0 0 0 / 48%); }
.settings-popover { border-color: #454545; border-radius: 6px; color: #f6f1e5; background: #111; box-shadow: 0 18px 48px rgb(0 0 0 / 55%); backdrop-filter: none; animation: settings-pop-in .2s ease-out both; }
.settings-close { border-color: #454545; border-radius: 4px; color: #f6f1e5; }
.theme-setting { border-color: #383838; border-radius: 4px; background: #171717; }
.theme-icon { border-radius: 4px; color: #f6f1e5; background: #252525; }
.theme-copy strong { color: #f6f1e5; }
.theme-copy small { color: #aaa59d; }
.theme-switch { border-color: #555; background: #282828; }
.theme-switch::after { background: #a9a9a9; }
.theme-setting input:checked + .theme-switch { background: #f6f1e5; }
.theme-setting input:checked + .theme-switch::after { background: #080808; }
@keyframes settings-pop-in { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
@media (prefers-reduced-motion: reduce) { .settings-popover { animation: none; } }
@media (max-width: 480px) { .settings-trigger { width: 40px; min-height: 40px; padding: 0; } }
</style>
