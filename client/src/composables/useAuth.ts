import { ref, computed } from "vue"
import axios from "axios"

const user = ref(null)
const isLoading = ref(false)

export function useAuth() {
  const isLoggedIn = computed(() => !!user.value)

  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      const response = await axios.post("/api/login", { email, password })
      user.value = response.data.user
      localStorage.setItem("token", response.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async (name: string, email: string, password: string) => {
    isLoading.value = true
    try {
      const response = await axios.post("/api/register", { name, email, password })
      user.value = response.data.user
      localStorage.setItem("token", response.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    try {
      await axios.post("/api/logout")
      user.value = null
      localStorage.removeItem("token")
      delete axios.defaults.headers.common["Authorization"]
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      isLoading.value = false
    }
  }

  const checkAuth = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      try {
        const response = await axios.get("/api/user")
        user.value = response.data
      } catch (error) {
        console.error("Check auth error:", error)
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
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

