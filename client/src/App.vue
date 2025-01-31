<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <nav class="container mx-auto px-4 py-4">
        <ul class="flex justify-between items-center">
          <li>
            <router-link to="/" class="text-2xl font-bold text-blue-600">Intellecta</router-link>
          </li>
          <li>
            <button class="w-max ml-auto lg:hidden pt-1 cursor-pointer" @click="openMenu = true">
              <Menu />
            </button>
            <ul
              class="flex space-x-4 fixed lg:static right-0 flex-col lg:flex-row top-0 bottom-0 w-[60dvw] lg:w-auto bg-white lg:bg-transparent z-50 px-4 space-y-6 py-5 lg:px-0 lg:py-0 lg:space-y-0 transition-transform duration-300 lg:translate-x-0"
              :class="openMenu ? 'translate-x-0' : 'translate-x-full'"
            >
              <button class="w-max ml-auto lg:hidden cursor-pointer" @click="openMenu = false">
                <X />
              </button>
              <li v-for="item in navItems" :key="item.to">
                <router-link
                  :to="item.to"
                  class="text-gray-600 hover:text-blue-600 transition-colors"
                  active-class="text-blue-600 font-semibold"
                  :aria-current="$route.path === item.to ? 'page' : undefined"
                >
                  {{ item.text }}
                </router-link>
              </li>
              <li v-if="isLoggedIn">
                <button @click="logout" class="text-gray-600 hover:text-blue-600 transition-colors">
                  Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
    <main class="flex-grow container mx-auto px-4 py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      <LearningProgress
        v-if="isLoggedIn"
        :course-completion="courseCompletion"
        :flashcards-mastered="flashcardsMastered"
        :flashcards-learning="flashcardsLearning"
        :flashcards-new="flashcardsNew"
        :study-time-data="studyTimeData"
      />
    </main>
    <footer class="bg-gray-800 text-white py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap justify-between">
          <div class="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 class="text-xl font-semibold mb-2">Intellecta</h3>
            <p class="text-gray-400">Your personalized learning assistant</p>
          </div>
          <div class="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 class="text-lg font-semibold mb-2">Quick Links</h4>
            <ul>
              <li><router-link to="/" class="text-gray-400 hover:text-white">Home</router-link></li>
              <li>
                <router-link to="/course-generator" class="text-gray-400 hover:text-white"
                  >Course Generator</router-link
                >
              </li>
              <li>
                <router-link to="/flashcard-creator" class="text-gray-400 hover:text-white"
                  >Flashcard Creator</router-link
                >
              </li>
              <li>
                <router-link to="/my-courses" class="text-gray-400 hover:text-white"
                  >My Courses</router-link
                >
              </li>
            </ul>
          </div>
          <div class="w-full md:w-1/3">
            <h4 class="text-lg font-semibold mb-2">Contact Us</h4>
            <p class="text-gray-400">Email: support@intellecta.com</p>
            <p class="text-gray-400">Phone: +1 (123) 456-7890</p>
          </div>
        </div>
        <div class="mt-8 text-center text-gray-400">
          <p>&copy; {{ new Date().getFullYear() }} Intellecta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeMount, watch, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useCourses } from '@/composables/useCourses'
import { useFlashcards } from '@/composables/useFlashcards'
import { useStudyTime } from '@/composables/useStudyTime'
import LearningProgress from '@/components/LearningProgress.vue'
import { Menu, X } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const route = useRoute()
const { isLoggedIn, logout: authLogout, checkAuth } = useAuth()

const { courses, fetchCourses } = useCourses()
const { flashcards, fetchFlashcards } = useFlashcards()
const { studyTimeData, fetchStudyTimeData } = useStudyTime()

const isLoading = ref(true)
const openMenu = ref(false)

const courseCompletion = computed(() => {
  if (courses.value.length === 0) return 0
  const totalModules = courses.value.reduce((sum, course) => sum + course.modules.length, 0)
  const completedModules = courses.value.reduce(
    (sum, course) => sum + course.modules.filter((module) => module.completed).length,
    0,
  )
  return (completedModules / totalModules) * 100
})

const flashcardsMastered = computed(
  () => flashcards.value.filter((f) => f.easeFactor >= 2.5).length,
)

const flashcardsLearning = computed(
  () => flashcards.value.filter((f) => f.easeFactor >= 1.3 && f.easeFactor < 2.5).length,
)

const flashcardsNew = computed(() => flashcards.value.filter((f) => f.easeFactor < 1.3).length)

const fetchData = async () => {
  if (isLoggedIn.value) {
    await Promise.all([fetchCourses(), fetchFlashcards(), fetchStudyTimeData()])
  }
}

onBeforeMount(async () => {
  await checkAuth()
  await fetchData()
  isLoading.value = false
})

watch(isLoggedIn, (newValue) => {
  if (newValue) {
    fetchData()
  }
})

watch(route, () => {
  openMenu.value = false
})

// Set up an interval to fetch data every 5 minutes
const dataRefreshInterval = setInterval(fetchData, 5 * 60 * 1000)

onUnmounted(() => {
  clearInterval(dataRefreshInterval)
})

const navItems = computed(() => [
  { to: '/', text: 'Home' },
  { to: '/course-generator', text: 'Course Generator' },
  { to: '/flashcard-creator', text: 'Flashcard Creator' },
  { to: '/my-courses', text: 'My Courses' },
  { to: '/flashcards', text: 'My Flashcards' },
  { to: '/flashcard-review', text: 'Flashcard Review' },
  { to: '/recommendations', text: 'Recommendations' },
  ...(isLoggedIn.value
    ? []
    : [
        { to: '/login', text: 'Login' },
        { to: '/register', text: 'Register' },
      ]),
])

const logout = async () => {
  await authLogout()
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Focus styles for keyboard navigation */
a:focus,
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Skip to main content link for keyboard users */
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 0;
  background: #3b82f6;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-to-content:focus {
  top: 0;
}
</style>
