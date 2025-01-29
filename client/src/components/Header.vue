<template>
  <header class="bg-white shadow-sm">
    <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
      <router-link to="/" class="text-2xl font-bold text-blue-600">Intellecta</router-link>
      <div class="flex items-center space-x-4">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="text-gray-600 hover:text-blue-600 transition-colors"
          active-class="text-blue-600 font-semibold"
        >
          {{ item.text }}
        </router-link>
        <button
          v-if="isLoggedIn"
          @click="logout"
          class="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { isLoggedIn, logout: authLogout } = useAuth()

const navItems = computed(() => [
  { to: '/', text: 'Home' },
  { to: '/course-generator', text: 'Course Generator' },
  { to: '/flashcard-creator', text: 'Flashcard Creator' },
  { to: '/my-courses', text: 'My Courses' },
  ...(isLoggedIn.value ? [] : [{ to: '/login', text: 'Login' }, { to: '/register', text: 'Register' }]),
])

const logout = async () => {
  await authLogout()
  router.push('/')
}
</script>

