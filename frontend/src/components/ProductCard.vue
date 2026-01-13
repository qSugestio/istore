<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Product } from '../shared/api/products'

interface Props {
  product: Product
}

defineProps<Props>()

const router = useRouter()

const goToProduct = (id: number) => {
  router.push(`/products/${id}`)
}
</script>

<template>
  <div class="product-card" @click="goToProduct(product.id)">
    <div class="product-image">
      <img v-if="product.image" :src="product.image" :alt="product.name" />
      <div v-else class="placeholder-image">No Image</div>
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-category">{{ product.category?.name }}</p>
      <p class="product-description">{{ product.description }}</p>
      <div class="product-footer">
        <span class="product-price">${{ Number(product.price).toFixed(2) }}</span>
        <span class="product-stock" :class="{ 'low-stock': product.stock < 10 }">
          {{ product.stock }} in stock
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  color: #999;
  font-size: 0.9rem;
}

.product-info {
  padding: 1rem;
}

.product-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.product-category {
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.product-description {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #555;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #27ae60;
}

.product-stock {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.low-stock {
  color: #e74c3c;
}
</style>
