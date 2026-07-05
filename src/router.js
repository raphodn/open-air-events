import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('./views/Home.vue'), meta: { title: 'Accueil', icon: 'mdi-home', breadcrumbs: null } },
  { path: '/events', name: 'events', component: () => import('./views/EventList.vue'), meta: { title: 'Toutes  les séances', icon: 'mdi-calendar', breadcrumbs: [{ title: 'Toutes les séances', to: '/events' }] } },
  { path: '/events/create', name: 'create-event', component: () => import('./views/EventCreate.vue'), meta: { title: 'Ajouter une séance', icon: 'mdi-plus', breadcrumbs: [{ title: 'Liste', to: '/events' }, { title: 'Ajouter une séance' }] } },
  { path: '/events/:id', name: 'event-details', component: () => import('./views/EventDetail.vue'), meta: { title: "Détails de la séance", icon: 'mdi-calendar', breadcrumbs: [{ title: 'Liste', to: '/events' }, { title: "Détails de la séance" }] } },
  { path: '/events/:id/edit', name: 'edit-event', component: () => import('./views/EventEdit.vue'), meta: { title: "Modifier la séance", icon: 'mdi-pencil', breadcrumbs: [{ title: 'Liste', to: '/events' }, { title: ':id', to: '/events/:id' }, { title: "Modifier la séance" }] } },
  { path: '/about', name: 'about', component: () => import('./views/About.vue'), meta: { title: 'À propos', icon: 'mdi-information', breadcrumbs: [{ title: 'À propos', to: '/about' }] } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
