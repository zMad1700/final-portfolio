import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import TodoView from './views/TodoView.vue'
import LandingDemoView from './views/LandingDemoView.vue'

export default createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/projects/todo-list', name: 'todo-list', component: TodoView },
    { path: '/projects/aster-studio', name: 'aster-studio', component: LandingDemoView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
