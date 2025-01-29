<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Register</h2>
    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label for="name" class="block text-gray-700 font-bold mb-2">Name</label>
        <input
          v-model="name"
          type="text"
          id="name"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>
      <div>
        <label for="email" class="block text-gray-700 font-bold mb-2">Email</label>
        <input
          v-model="email"
          type="email"
          id="email"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>
      <div>
        <label for="password" class="block text-gray-700 font-bold mb-2">Password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Registering...' : 'Register' }}
      </button>
    </form>
    <p class="mt-4 text-center text-gray-600">
      Already have an account?
      <router-link to="/login" class="text-blue-600 hover:text-blue-800">Login</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register, isLoading } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')

const handleRegister = async () => {
  try {
    await register(name.value, email.value, password.value)
    router.push('/')
  } catch (error) {
    console.error('Registration failed:', error)
    // Show error message to user
  }
}
</script>

