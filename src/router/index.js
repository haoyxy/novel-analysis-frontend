import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UserManagementView.vue')
    },
    {
      path: '/works',
      name: 'works',
      component: () => import('../views/WorkManagementView.vue')
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: () => import('../views/AnalysisView.vue')
    },
    {
      path: '/world',
      name: 'world',
      component: () => import('../views/CharacterView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
