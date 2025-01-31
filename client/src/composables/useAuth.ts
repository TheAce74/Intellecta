import { axiosInstance } from '@/lib/axios'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const user = ref(null)
const isLoading = ref(false)

export function useAuth() {
  const router = useRouter()
  const isLoggedIn = computed(() => !!user.value)

  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      const response = await axiosInstance.post('/api/auth/login', { email, password })
      user.value = response.data.user
      localStorage.setItem('token', response.data.token)
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      toast.success('Logged in successfully')
      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please check your credentials.')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async (name: string, email: string, password: string) => {
    isLoading.value = true
    try {
      const response = await axiosInstance.post('/api/auth/register', { name, email, password })
      user.value = response.data.user
      localStorage.setItem('token', response.data.token)
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      toast.success('Registered successfully')
      router.push('/')
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    try {
      await axiosInstance.post('/api/auth/logout')
      user.value = null
      localStorage.removeItem('token')
      delete axiosInstance.defaults.headers.common['Authorization']
      toast.info('Logged out successfully')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed. Please try again.')
    } finally {
      isLoading.value = false
    }
  }

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
      try {
        const response = await axiosInstance.get('/api/auth/user')
        user.value = response.data
      } catch (error) {
        console.error('Check auth error:', error)
        localStorage.removeItem('token')
        delete axiosInstance.defaults.headers.common['Authorization']
      }
    }
  }

  return {
    user,
    isLoggedIn,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  }
}
