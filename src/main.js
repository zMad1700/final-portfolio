import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './style.css'
import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  defaults: { VBtn: { rounded: 'pill', elevation: 0 } },
  theme: {
    defaultTheme: 'portfolioTheme',
    themes: {
      portfolioTheme: {
        dark: false,
        colors: { primary: '#8f529b', secondary: '#3d2a5d', surface: '#2b103c' },
      },
    },
  },
})

createApp(App).use(router).use(vuetify).mount('#app')
