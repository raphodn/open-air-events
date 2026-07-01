import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('./views/Home.vue'), meta: { title: 'Home', icon: 'mdi-home' } },
  { path: '/events', name: 'events', component: () => import('./views/EventList.vue'), meta: { title: 'Events', icon: 'mdi-calendar' } },
  { path: '/events/create', name: 'create-event', component: () => import('./views/EventCreate.vue'), meta: { title: 'Create Event', icon: 'mdi-plus' } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
