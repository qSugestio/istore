import apiClient from './client';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  category_id: number;
  image?: string;
  category?: Category;
}

export interface ProductsResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const productsApi = {
  getProducts: async (params?: {
    category_id?: number;
    search?: string;
    page?: number;
  }): Promise<ProductsResponse> => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
};

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories');
    return response.data;
  },
};
