import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import CourseGenerator from '@/views/CourseGenerator.vue'
import FlashcardCreator from '@/views/FlashcardCreator.vue'
import MyCourses from '@/views/MyCourses.vue'
import CourseView from '@/views/CourseView.vue'
import FlashcardReview from '@/views/FlashcardReview.vue'
import Recommendations from '@/views/Recommendations.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import { useAuth } from '@/composables/useAuth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/course-generator',
    name: 'CourseGenerator',
    component: CourseGenerator,
    meta: { requiresAuth: true },
  },
  {
    path: '/flashcard-creator',
    name: 'FlashcardCreator',
    component: FlashcardCreator,
    meta: { requiresAuth: true },
  },
  {
    path: '/my-courses',
    name: 'MyCourses',
    component: MyCourses,
    meta: { requiresAuth: true },
  },
  {
    path: '/course/:id',
    name: 'CourseView',
    component: CourseView,
    meta: { requiresAuth: true },
  },
  {
    path: '/flashcard-review',
    name: 'FlashcardReview',
    component: FlashcardReview,
    meta: { requiresAuth: true },
  },
  {
    path: '/recommendations',
    name: 'Recommendations',
    component: Recommendations,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const { isLoggedIn } = useAuth()

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    next('/login')
  } else {
    next()
  }
})

export default router
