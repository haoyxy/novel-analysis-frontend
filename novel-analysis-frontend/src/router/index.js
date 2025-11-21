import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/analysis' // 重定向到分析页面
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: () => import('../views/AnalysisView.vue')
    },
    {
      path: '/characters',
      name: 'characters',
      component: () => import('../views/CharacterView.vue')
    }
  ]
})

export default router