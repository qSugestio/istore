<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Button from '../../components/Button.vue'
import ErrorMessage from '../../components/ErrorMessage.vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { adminApi } from '../../shared/api/admin'
import type { Order } from '../../shared/api/orders'

const orders = ref<Order[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const updatingStatus = ref<number | null>(null)

const loadOrders = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await adminApi.getOrders()
    orders.value = response.data || []
  } catch (err: any) {
    console.error('Failed to load orders:', err)
    error.value = err.response?.data?.message || 'Failed to load orders'
    orders.value = []
  } finally {
    loading.value = false
  }
}

const updateStatus = async (orderId: number, status: string) => {
  updatingStatus.value = orderId
  try {
    await adminApi.updateOrderStatus(orderId, status)
    await loadOrders()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to update order status'
  } finally {
    updatingStatus.value = null
  }
}

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

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div class="admin-orders-page">
    <h1>Manage Orders</h1>

    <div v-if="loading">
      <LoadingSpinner message="Loading orders..." />
    </div>
    <div v-else-if="error">
      <ErrorMessage :message="error" />
      <Button @click="loadOrders()" style="margin-top: 1rem">Retry</Button>
    </div>

    <div v-else-if="orders.length === 0" class="no-orders">
      <p>No orders found.</p>
    </div>
    <div v-else class="orders-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>User #{{ order.user_id }}</td>
            <td>${{ Number(order.total).toFixed(2) }}</td>
            <td>
              <span class="status-badge" :style="{ backgroundColor: getStatusColor(order.status) }">
                {{ order.status }}
              </span>
            </td>
            <td>{{ new Date(order.created_at).toLocaleDateString() }}</td>
            <td>
              <select :value="order.status" @change="updateStatus(order.id, ($event.target as HTMLSelectElement).value)"
                :disabled="updatingStatus === order.id" class="status-select">
                <option v-for="status in statuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.admin-orders-page h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.orders-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;

  color: #2c3e50;
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  text-transform: capitalize;
}

.status-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.status-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.no-orders {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  background: white;
  border-radius: 8px;
}
</style>
