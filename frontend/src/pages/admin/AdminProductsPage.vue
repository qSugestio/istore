<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '../../components/Button.vue'
import ErrorMessage from '../../components/ErrorMessage.vue'
import Input from '../../components/Input.vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { adminApi } from '../../shared/api/admin'
import { categoriesApi, type Category, type Product } from '../../shared/api/products'

const router = useRouter()

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const showForm = ref(false)
const editingProduct = ref<Product | null>(null)
const saving = ref(false)

const formData = ref({
  name: '',
  slug: '',
  description: '',
  price: '',
  stock: '',
  category_id: '',
  image: '',
})

const loadProducts = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await adminApi.getProducts()
    products.value = response.data || []
  } catch (err: any) {
    console.error('Failed to load products:', err)
    error.value = err.response?.data?.message || 'Failed to load products'
    products.value = []
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    categories.value = await categoriesApi.getCategories()
  } catch (err) {
    console.error('Failed to load categories:', err)
  }
}

const openForm = (product?: Product) => {
  if (product) {
    editingProduct.value = product
    formData.value = {
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category_id: product.category_id.toString(),
      image: product.image || '',
    }
  } else {
    editingProduct.value = null
    formData.value = {
      name: '',
      slug: '',
      description: '',
      price: '',
      stock: '',
      category_id: '',
      image: '',
    }
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingProduct.value = null
}

const handleSave = async () => {
  if (!formData.value.name || !formData.value.slug || !formData.value.category_id) {
    error.value = 'Please fill in all required fields'
    return
  }

  if (!formData.value.price || parseFloat(formData.value.price) <= 0) {
    error.value = 'Price must be greater than 0'
    return
  }

  if (!formData.value.stock || parseInt(formData.value.stock) < 0) {
    error.value = 'Stock must be 0 or greater'
    return
  }

  saving.value = true
  error.value = null
  try {
    const data = {
      name: formData.value.name.trim(),
      slug: formData.value.slug.trim(),
      description: formData.value.description.trim(),
      price: parseFloat(formData.value.price),
      stock: parseInt(formData.value.stock),
      category_id: parseInt(formData.value.category_id),
      image: formData.value.image?.trim() || undefined,
    }

    if (editingProduct.value) {
      await adminApi.updateProduct(editingProduct.value.id, data)
    } else {
      await adminApi.createProduct(data)
    }
    await loadProducts()
    closeForm()
  } catch (err: any) {
    console.error('Save product error:', err)
    error.value = err.response?.data?.message || err.response?.data?.errors?.[0] || 'Failed to save product'
  } finally {
    saving.value = false
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('Are you sure you want to delete this product?')) return
  try {
    await adminApi.deleteProduct(id)
    await loadProducts()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to delete product'
  }
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    await Promise.all([loadCategories(), loadProducts()])
  } catch (err: any) {
    console.error('Failed to initialize admin products page:', err)
    error.value = err.message || 'Failed to load page data'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="admin-products-page">
    <div class="page-header">
      <h1>Manage Products</h1>
      <Button @click="openForm()">Add Product</Button>
    </div>

    <div v-if="loading">
      <LoadingSpinner message="Loading products..." />
    </div>
    <div v-else-if="error">
      <ErrorMessage :message="error" />
      <Button @click="loadProducts()" style="margin-top: 1rem">Retry</Button>
    </div>
    <div v-else-if="products.length === 0" class="no-products">
      <p>No products found.</p>
    </div>
    <div v-else class="products-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.category?.name }}</td>
            <td>${{ Number(product.price).toFixed(2) }}</td>
            <td>{{ product.stock }}</td>
            <td>
              <Button variant="secondary" @click="openForm(product)">Edit</Button>
              <Button variant="danger" @click="handleDelete(product.id)">Delete</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="modal-overlay" @click="closeForm">
      <div class="modal-content" @click.stop>
        <h2>{{ editingProduct ? 'Edit Product' : 'Add Product' }}</h2>
        <ErrorMessage v-if="error" :message="error" />
        <form @submit.prevent="handleSave">
          <Input v-model="formData.name" label="Name" id="name" required />
          <Input v-model="formData.slug" label="Slug" id="slug" required />
          <div class="input-group">
            <label for="description" class="input-label">Description</label>
            <textarea id="description" v-model="formData.description" class="input" rows="4"></textarea>
          </div>
          <Input v-model="formData.price" label="Price" id="price" type="number" step="0.01" required />
          <Input v-model="formData.stock" label="Stock" id="stock" type="number" required />
          <div class="input-group">
            <label for="category_id" class="input-label">Category</label>
            <select v-model.number="formData.category_id" id="category_id" class="input" required>
              <option value="">Select category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <Input v-model="formData.image" label="Image URL" id="image" />
          <div class="form-actions">
            <Button type="button" variant="secondary" @click="closeForm">Cancel</Button>
            <Button type="submit" :loading="saving">Save</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  color: #2c3e50;
}

.products-table {
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-top: 0;
  color: #2c3e50;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.form-actions button {
  flex: 1;
}

.no-products {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  background: white;
  border-radius: 8px;
}

.input-group textarea.input {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.input-group select.input {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232c3e50' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}
</style>
