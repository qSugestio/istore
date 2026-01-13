import apiClient from './client'
import { type Product } from './products'

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  product: Product
}

export interface Order {
  id: number
  user_id: number
  status: string
  total: number
  address: string
  phone: string
  created_at: string
  items: OrderItem[]
}

export interface OrdersResponse {
  data: Order[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface CreateOrderData {
  address: string
  phone: string
}

export const ordersApi = {
  getOrders: async (): Promise<OrdersResponse> => {
    const response = await apiClient.get('/orders')
    return response.data
  },

  getOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`)
    return response.data
  },

  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await apiClient.post('/orders', data)
    return response.data
  },
}
