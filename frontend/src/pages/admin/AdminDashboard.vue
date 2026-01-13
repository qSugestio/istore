<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <div v-if="!authStore.isAdmin" class="error-message">
      <p>You do not have admin access. Current role: {{ authStore.user?.role || 'unknown' }}</p>
    </div>
    <div class="admin-menu">
      <router-link to="/admin/products" class="admin-card">
        <h2>Products</h2>
        <p>Manage products and categories</p>
      </router-link>
      <router-link to="/admin/orders" class="admin-card">
        <h2>Orders</h2>
        <p>View and manage orders</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.admin-menu {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.admin-card {
  display: block;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  pointer-events: auto;
  user-select: none;
}

.admin-card:active {
  transform: translateY(-2px);
}

.admin-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

.admin-card.router-link-active {
  border-color: #3498db;
  border-width: 2px;
}

.admin-card h2 {
  margin-top: 0;
  color: #2c3e50;
}

.admin-card p {
  color: #7f8c8d;
  margin: 0;
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 2rem;
  color: #c33;
}
</style>
