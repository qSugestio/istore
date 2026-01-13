<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { productsApi } from '../shared/api/products';
import type { Product, Category } from '../shared/api/products';
import ProductCard from '../components/ProductCard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ErrorMessage from '../components/ErrorMessage.vue';
import Button from '../components/Button.vue';

const route = useRoute();
const router = useRouter();

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref((route.query.search as string) || '');
const selectedCategory = ref<number | null>(
  route.query.category_id ? Number(route.query.category_id) : null
);
const currentPage = ref(1);
const lastPage = ref(1);

const loadProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params: any = {
      page: currentPage.value,
      per_page: 12,
    };
    if (selectedCategory.value) {
      params.category_id = selectedCategory.value;
    }
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }

    const response = await productsApi.getProducts(params);
    products.value = response.data;
    currentPage.value = response.current_page;
    lastPage.value = response.last_page;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load products';
  } finally {
    loading.value = false;
  }
};

const loadCategories = async () => {
  try {
    const { categoriesApi } = await import('../shared/api/products');
    categories.value = await categoriesApi.getCategories();
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  const query: any = {};
  if (searchQuery.value) query.search = searchQuery.value;
  if (selectedCategory.value) query.category_id = selectedCategory.value;
  router.push({ query });
  loadProducts();
};

const handleCategoryChange = (categoryId: number | null) => {
  selectedCategory.value = categoryId;
  currentPage.value = 1;
  const query: any = {};
  if (searchQuery.value) query.search = searchQuery.value;
  if (categoryId) query.category_id = categoryId;
  router.push({ query });
  loadProducts();
};

onMounted(async () => {
  await loadCategories();
  await loadProducts();
});

watch(() => route.query, () => {
  searchQuery.value = (route.query.search as string) || '';
  selectedCategory.value = route.query.category_id
    ? Number(route.query.category_id)
    : null;
  loadProducts();
});
</script>

<template>
  <div class="products-page">
    <h1>Products</h1>

    <div class="filters">
      <div class="search-section">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <Button @click="handleSearch">Search</Button>
      </div>

      <div class="categories-section">
        <Button
          :variant="selectedCategory === null ? 'primary' : 'secondary'"
          @click="handleCategoryChange(null)"
        >
          All Categories
        </Button>
        <Button
          v-for="category in categories"
          :key="category.id"
          :variant="selectedCategory === category.id ? 'primary' : 'secondary'"
          @click="handleCategoryChange(category.id)"
        >
          {{ category.name }}
        </Button>
      </div>
    </div>

    <LoadingSpinner v-if="loading" message="Loading products..." />
    <ErrorMessage v-else-if="error" :message="error" />

    <div v-else>
      <div v-if="products.length === 0" class="no-products">
        <p>No products found.</p>
      </div>
      <div v-else class="products-grid">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>

      <div v-if="lastPage > 1" class="pagination">
        <Button
          :disabled="currentPage === 1"
          @click="currentPage--; loadProducts()"
        >
          Previous
        </Button>
        <span class="page-info">
          Page {{ currentPage }} of {{ lastPage }}
        </span>
        <Button
          :disabled="currentPage === lastPage"
          @click="currentPage++; loadProducts()"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-page h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.filters {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.search-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.categories-section {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.no-products {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-info {
  font-weight: 500;
}
</style>
