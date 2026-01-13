import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authApi, type User } from '../shared/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const setAuth = (userData: User, authToken: string) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('auth_token', authToken)
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  const register = async (data: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.register(data)
      setAuth(response.user, response.token)
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (data: { email: string; password: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.login(data)
      setAuth(response.user, response.token)
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await authApi.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      clearAuth()
      loading.value = false
    }
  }

  const fetchUser = async () => {
    if (!token.value) return
    loading.value = true
    try {
      const userData = await authApi.getUser()
      user.value = userData
    } catch (err) {
      clearAuth()
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    register,
    login,
    logout,
    fetchUser,
  }
})
