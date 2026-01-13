import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { cartApi, type CartItem } from '../shared/api/cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const total = computed(() => {
    return items.value.reduce((sum, item) => {
      return sum + item.product.price * item.quantity
    }, 0)
  })

  const itemCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const fetchCart = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await cartApi.getCart()
      items.value = response.items
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch cart'
    } finally {
      loading.value = false
    }
  }

  const addToCart = async (productId: number, quantity: number) => {
    loading.value = true
    error.value = null
    try {
      const item = await cartApi.addToCart(productId, quantity)
      const existingIndex = items.value.findIndex(
        i => i.product_id === productId
      )
      if (existingIndex >= 0) {
        items.value[existingIndex] = item
      } else {
        items.value.push(item)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add to cart'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateQuantity = async (id: number, quantity: number) => {
    loading.value = true
    error.value = null
    try {
      const item = await cartApi.updateCartItem(id, quantity)
      const index = items.value.findIndex(i => i.id === id)
      if (index >= 0) {
        items.value[index] = item
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update cart'
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeFromCart = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await cartApi.removeFromCart(id)
      items.value = items.value.filter(item => item.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to remove from cart'
    } finally {
      loading.value = false
    }
  }

  const clearCart = async () => {
    loading.value = true
    try {
      await cartApi.clearCart()
      items.value = []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to clear cart'
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    error,
    total,
    itemCount,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }
})
