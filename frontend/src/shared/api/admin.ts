import apiClient from './client';
import type { Product, ProductsResponse } from './products';
import type { Order, OrdersResponse } from './orders';

export interface CreateProductData {
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  category_id: number;
  image?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export const adminApi = {
  getProducts: async (): Promise<ProductsResponse> => {
    const response = await apiClient.get('/admin/products');
    return response.data;
  },

  createProduct: async (data: CreateProductData): Promise<Product> => {
    const response = await apiClient.post('/admin/products', data);
    return response.data;
  },

  updateProduct: async (id: number, data: UpdateProductData): Promise<Product> => {
    const response = await apiClient.put(`/admin/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/products/${id}`);
  },

  getOrders: async (): Promise<OrdersResponse> => {
    const response = await apiClient.get('/admin/orders');
    return response.data;
  },

  getOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.get(`/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string): Promise<Order> => {
    const response = await apiClient.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },
};
