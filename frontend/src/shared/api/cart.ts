import apiClient from './client'
import { type Product } from './products'

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  product: Product
}

export interface CartResponse {
  items: CartItem[]
  total: number
}

export const cartApi = {
  getCart: async (): Promise<CartResponse> => {
    const response = await apiClient.get('/cart')
    return response.data
  },

  addToCart: async (productId: number, quantity: number): Promise<CartItem> => {
    const response = await apiClient.post('/cart/add', {
      product_id: productId,
      quantity,
    })
    return response.data
  },

  updateCartItem: async (id: number, quantity: number): Promise<CartItem> => {
    const response = await apiClient.put(`/cart/update/${id}`, { quantity })
    return response.data
  },

  removeFromCart: async (id: number): Promise<void> => {
    await apiClient.delete(`/cart/remove/${id}`)
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart/clear')
  },
}
