import { createRouter, createWebHistory } from 'vue-router'
import AnalysisView from '../views/AnalysisView.vue'

const routes = [
  {
    path: '/analysis',
    name: 'analysis',
    component: AnalysisView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router