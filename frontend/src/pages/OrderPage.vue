<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ErrorMessage from '../components/ErrorMessage.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import type { Order } from '../shared/api/orders'
import { ordersApi } from '../shared/api/orders'

const route = useRoute()

const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const orderId = Number(route.params.id)
    if (!orderId || isNaN(orderId)) {
      throw new Error('Invalid order ID')
    }
    order.value = await ordersApi.getOrder(orderId)
  } catch (err: any) {
    console.error('Failed to load order:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load order'
    order.value = null
  } finally {
    loading.value = false
  }
})

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: '#f39c12',
    processing: '#3498db',
    shipped: '#9b59b6',
    delivered: '#27ae60',
    cancelled: '#e74c3c',
  }
  return colors[status] || '#7f8c8d'
}
</script>

<template>
  <div class="order-page">
    <LoadingSpinner v-if="loading" message="Loading order..." />
    <ErrorMessage v-else-if="error" :message="error" />

    <div v-else-if="order" class="order-details">
      <div class="order-header">
        <h1>Order #{{ order.id }}</h1>
        <span class="order-status" :style="{ backgroundColor: getStatusColor(order.status) }">
          {{ order.status }}
        </span>
      </div>

      <div class="order-info">
        <div class="info-section">
          <h3>Order Information</h3>
          <p><strong>Date:</strong> {{ new Date(order.created_at).toLocaleString() }}</p>
          <p><strong>Total:</strong> ${{ Number(order.total).toFixed(2) }}</p>
        </div>

        <div class="info-section">
          <h3>Shipping Information</h3>
          <p><strong>Address:</strong> {{ order.address }}</p>
          <p><strong>Phone:</strong> {{ order.phone }}</p>
        </div>
      </div>

      <div class="order-items">
        <h3>Order Items</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="item.id">
              <td>{{ item.product.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>${{ Number(item.price).toFixed(2) }}</td>
              <td>${{ (Number(item.price) * item.quantity).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-page {
  max-width: 1000px;
  margin: 0 auto;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.order-header h1 {
  margin: 0;
  color: #2c3e50;
}

.order-status {
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  text-transform: capitalize;
}

.order-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.info-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.info-section h3 {
  margin-top: 0;
  color: #2c3e50;
}

.info-section p {
  margin: 0.5rem 0;
  color: #555;
}

.order-items {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.order-items h3 {
  margin-top: 0;
  color: #2c3e50;
}

.items-table {
  width: 100%;
  color: #2c3e50;
  border-collapse: collapse;
}

.items-table th,
.items-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.items-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .order-info {
    grid-template-columns: 1fr;
  }
}
</style>
