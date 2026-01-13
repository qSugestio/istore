import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomePage.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../pages/ProductsPage.vue'),
    },
    {
      path: '/products/:id',
      name: 'product',
      component: () => import('../pages/ProductPage.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../pages/CartPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../pages/OrdersPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders/:id',
      name: 'order',
      component: () => import('../pages/OrderPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../pages/RegisterPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../pages/admin/AdminDashboard.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/products',
      name: 'admin-products',
      component: () => import('../pages/admin/AdminProductsPage.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: () => import('../pages/admin/AdminOrdersPage.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Ensure we know the current user (and role) before applying guards
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUser()
    } catch (err) {
      // If token is invalid, fetchUser already cleared auth; fall through to guards
      console.error('Failed to fetch user:', err)
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
    return
  }

  if (to.meta.requiresAdmin) {
    if (!authStore.isAuthenticated) {
      next({ name: 'login' })
      return
    }
    if (!authStore.isAdmin) {
      console.warn('Admin access denied. User role:', authStore.user?.role)
      next({ name: 'home' })
      return
    }
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router
