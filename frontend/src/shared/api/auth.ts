import apiClient from './client'

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface LoginData {
  email: string
  password: string
}

export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface AuthResponse {
  user: User
  token: string
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/register', data)
    return response.data
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/login', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/logout')
  },

  getUser: async (): Promise<User> => {
    const response = await apiClient.get('/user')
    return response.data
  },
}
