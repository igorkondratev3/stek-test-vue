import { createRouter, createWebHistory } from 'vue-router'
import StartPage from "@/pages/StartPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    name: 'StartPage',
    component: StartPage
  }],
})

export default router
