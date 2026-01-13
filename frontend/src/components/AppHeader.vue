<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const cartItemCount = computed(() => cartStore.itemCount);

const handleLogout = async () => {
  await authStore.logout();
  router.push('/');
};
</script>

<template>
  <header class="header">
    <div class="header-content">
      <router-link to="/" class="logo">
        <h1>IStore</h1>
      </router-link>
      <nav class="nav">
        <router-link to="/products">Products</router-link>
        <router-link v-if="authStore.isAuthenticated" to="/cart" class="cart-link">
          Cart
          <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
        </router-link>
        <router-link v-if="authStore.isAuthenticated" to="/orders">Orders</router-link>
        <router-link v-if="authStore.isAdmin" to="/admin">Admin</router-link>
        <router-link v-if="!authStore.isAuthenticated" to="/login">Login</router-link>
        <router-link v-if="!authStore.isAuthenticated" to="/register">Register</router-link>
        <button v-if="authStore.isAuthenticated" @click="handleLogout" class="logout-btn">
          Logout
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  color: white;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
}

.nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav a {
  color: white;
  text-decoration: none;
  transition: opacity 0.2s;
}

.nav a:hover {
  opacity: 0.8;
}

.cart-link {
  position: relative;
}

.cart-badge {
  background: #e74c3c;
  border-radius: 50%;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  margin-left: 0.5rem;
}

.logout-btn {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
