<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { productsApi } from '../shared/api/products';
import type { Product } from '../shared/api/products';
import { useCartStore } from '../stores/cart';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ErrorMessage from '../components/ErrorMessage.vue';
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const product = ref<Product | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const quantity = ref(1);
const addingToCart = ref(false);

onMounted(async () => {
  try {
    product.value = await productsApi.getProduct(Number(route.params.id));
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load product';
  } finally {
    loading.value = false;
  }
});

const handleAddToCart = async () => {
  if (!product.value) return;
  addingToCart.value = true;
  try {
    await cartStore.addToCart(product.value.id, quantity.value);
    router.push('/cart');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to add to cart';
  } finally {
    addingToCart.value = false;
  }
};
</script>

<template>
  <div class="product-page">
    <LoadingSpinner v-if="loading" message="Loading product..." />
    <ErrorMessage v-else-if="error" :message="error" />

    <div v-else-if="product" class="product-details">
      <div class="product-image-section">
        <div v-if="product.image" class="product-image">
          <img :src="product.image" :alt="product.name" />
        </div>
        <div v-else class="placeholder-image">No Image Available</div>
      </div>

      <div class="product-info-section">
        <h1>{{ product.name }}</h1>
        <p class="category">Category: {{ product.category?.name }}</p>
        <p class="price">${{ Number(product.price).toFixed(2) }}</p>
        <p class="stock" :class="{ 'low-stock': product.stock < 10 }">
          {{ product.stock }} in stock
        </p>

        <div v-if="product.description" class="description">
          <h3>Description</h3>
          <p>{{ product.description }}</p>
        </div>

        <div v-if="product.stock > 0" class="add-to-cart-section">
          <Input
            v-model.number="quantity"
            type="number"
            label="Quantity"
            :id="'quantity'"
            :min="1"
            :max="product.stock"
          />
          <Button
            :loading="addingToCart"
            @click="handleAddToCart"
          >
            Add to Cart
          </Button>
        </div>
        <div v-else class="out-of-stock">
          <p>This product is currently out of stock.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-page {
  max-width: 1000px;
  margin: 0 auto;
}

.product-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.product-image-section {
  width: 100%;
}

.product-image {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: auto;
}

.placeholder-image {
  width: 100%;
  aspect-ratio: 1;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #999;
}

.product-info-section h1 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.category {
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #27ae60;
  margin: 1rem 0;
}

.stock {
  margin: 1rem 0;
  color: #7f8c8d;
}

.low-stock {
  color: #e74c3c;
}

.description {
  margin: 2rem 0;
}

.description h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.add-to-cart-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.out-of-stock {
  margin-top: 2rem;
  padding: 1rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c33;
}

@media (max-width: 768px) {
  .product-details {
    grid-template-columns: 1fr;
  }
}
</style>
