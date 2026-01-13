<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ordersApi } from '../shared/api/orders';
import type { Order } from '../shared/api/orders';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ErrorMessage from '../components/ErrorMessage.vue';

const router = useRouter();

const orders = ref<Order[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await ordersApi.getOrders();
    orders.value = response.data || [];
  } catch (err: any) {
    console.error('Failed to load orders:', err);
    error.value = err.response?.data?.message || 'Failed to load orders';
    orders.value = [];
  } finally {
    loading.value = false;
  }
});

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: '#f39c12',
    processing: '#3498db',
    shipped: '#9b59b6',
    delivered: '#27ae60',
    cancelled: '#e74c3c',
  };
  return colors[status] || '#7f8c8d';
};
</script>

<template>
  <div class="orders-page">
    <h1>My Orders</h1>

    <LoadingSpinner v-if="loading" message="Loading orders..." />
    <ErrorMessage v-else-if="error" :message="error" />

    <div v-else-if="orders.length === 0" class="no-orders">
      <p>You have no orders yet.</p>
      <router-link to="/products" class="shop-link">Start Shopping</router-link>
    </div>

    <div v-else class="orders-list">
      <div
        v-for="order in orders"
        :key="order.id"
        class="order-card"
        @click="router.push(`/orders/${order.id}`)"
      >
        <div class="order-header">
          <div>
            <h3>Order #{{ order.id }}</h3>
            <p class="order-date">{{ new Date(order.created_at).toLocaleDateString() }}</p>
          </div>
          <span
            class="order-status"
            :style="{ backgroundColor: getStatusColor(order.status) }"
          >
            {{ order.status }}
          </span>
        </div>
        <div class="order-details">
          <p><strong>Total:</strong> ${{ Number(order.total).toFixed(2) }}</p>
          <p><strong>Items:</strong> {{ order.items?.length || 0 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-page h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.no-orders {
  text-align: center;
  padding: 3rem;
}

.shop-link {
  display: inline-block;
  margin-top: 1rem;
  color: #3498db;
  text-decoration: none;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.order-header h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.order-date {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.order-status {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  text-transform: capitalize;
}

.order-details {
  display: flex;
  gap: 2rem;
}

.order-details p {
  margin: 0;
  color: #555;
}
</style>
