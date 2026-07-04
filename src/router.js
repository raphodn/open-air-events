import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('./views/Home.vue'), meta: { title: 'Accueil', icon: 'mdi-home', breadcrumbs: null } },
  { path: '/events', name: 'events', component: () => import('./views/EventList.vue'), meta: { title: 'Tous les événements', icon: 'mdi-calendar', breadcrumbs: [{ title: 'Tous les événements', to: '/events' }] } },
  { path: '/events/create', name: 'create-event', component: () => import('./views/EventCreate.vue'), meta: { title: 'Ajouter un événement', icon: 'mdi-plus', breadcrumbs: [{ title: 'Liste', to: '/events' }, { title: 'Ajouter un événement' }] } },
  { path: '/events/:id', name: 'event-details', component: () => import('./views/EventDetail.vue'), meta: { title: "Détails de l'événement", icon: 'mdi-calendar', breadcrumbs: [{ title: 'Liste', to: '/events' }, { title: "Détails de l'événement" }] } },
  { path: '/events/:id/edit', name: 'edit-event', component: () => import('./views/EventEdit.vue'), meta: { title: "Modifier l'événement", icon: 'mdi-pencil', breadcrumbs: [{ title: 'Liste', to: '/events' }, { title: ':id', to: '/events/:id' }, { title: "Modifier l'événement" }] } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
