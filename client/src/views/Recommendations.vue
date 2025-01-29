<template>
  <div>
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Recommended for You</h2>
    <div v-if="recommendations.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in recommendations" :key="item.id" class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold mb-2 text-gray-800">{{ item.title }}</h3>
        <p class="text-gray-600 mb-4">{{ item.type === 'course' ? 'Course' : 'Flashcard Deck' }}</p>
        <router-link
          :to="item.type === 'course' ? `/course/${item.id}` : `/flashcards/${item.id}`"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          View {{ item.type === 'course' ? 'Course' : 'Flashcards' }}
        </router-link>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <LightbulbIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <p class="text-xl font-semibold text-gray-600">No recommendations available yet.</p>
      <p class="text-gray-500 mt-2">Start learning and we'll suggest more content for you!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { LightbulbIcon } from 'lucide-vue-next'
import { useRecommendations } from '@/composables/useRecommendations'

const { recommendations, fetchRecommendations, isLoading } = useRecommendations()

onMounted(async () => {
  await fetchRecommendations()
})
</script>

