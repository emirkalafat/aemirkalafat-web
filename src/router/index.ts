import { createRouter, createWebHistory } from 'vue-router'
import MediaView from '@/views/MediaView.vue'
import HomeView from '@/views/HomeView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import BlogView from '@/views/BlogView.vue'
import StatusView from '@/views/StatusView.vue'

const routes = [
  {
    path: '/',
    component: HomeView,
  },
  {
    path: '/media',
    component: MediaView,
  },
  {
    path: '/projects',
    component: ProjectsView,
  },
  {
    path: '/blog',
    component: BlogView,
  },
  {
    path: '/status',
    component: StatusView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
