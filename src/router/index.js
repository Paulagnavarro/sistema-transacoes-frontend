import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'

/* Definição das rotas do sistema */
const routes = [
  {
    path: '/',
    redirect: '/login' 
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'), 
    meta: { requiresAuth: true }
  },
  {
    path: '/cliente/:id',
    name: 'ClientePerfil',
    component: () => import('@/views/ClientePerfilView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/AdminPage.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

/* Middleware que bloqueia acesso se não houver token */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router