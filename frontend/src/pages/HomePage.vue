<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ErrorMessage from '../components/ErrorMessage.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ProductCard from '../components/ProductCard.vue'
import type { Product } from '../shared/api/products'
import { productsApi } from '../shared/api/products'

const products = ref<Product[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await productsApi.getProducts({ per_page: 6 })
    products.value = response.data
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load products'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="home-page">
    <h1>Welcome to IStore</h1>
    <p class="subtitle">Discover our amazing products</p>

    <LoadingSpinner v-if="loading" message="Loading products..." />
    <ErrorMessage v-else-if="error" :message="error" />

    <div v-else class="products-grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>

    <div class="cta-section">
      <router-link to="/products" class="cta-button">View All Products</router-link>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  text-align: center;
}

.home-page h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.cta-section {
  margin-top: 3rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1.1rem;
  transition: background 0.2s;
}

.cta-button:hover {
  background: #2980b9;
}
</style>
