<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">My Flashcards</h1>
    <div v-if="cards.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="card in cards"
        :key="card._id"
        class="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
      >
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-semibold text-gray-800">{{ card.deck }}</h2>
          <span
            :class="difficultyClass(card.difficulty)"
            class="px-2 py-1 rounded-full text-xs font-semibold"
          >
            {{ card.difficulty }}
          </span>
        </div>
        <p class="text-gray-600 mb-4">{{ card.question }}</p>
        <div class="mb-4">
          <button
            @click="toggleAnswer(card)"
            class="text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {{ card.showAnswer ? 'Hide Answer' : 'Show Answer' }}
          </button>
          <p v-if="card.showAnswer" class="mt-2 text-gray-800">{{ card.answer }}</p>
        </div>
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span>Next review: {{ formatDate(card.nextReviewDate) }}</span>
          <span>Reviewed: {{ card.reviewCount }} times</span>
        </div>
        <div class="mt-4 flex justify-end">
          <button
            @click="deleteFlashcard(card._id)"
            class="text-red-600 hover:text-red-800 focus:outline-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <p class="text-xl text-gray-600">You haven't created any flashcards yet.</p>
      <router-link
        to="/flashcard-creator"
        class="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Flashcards
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useFlashcards, type Flashcard } from '@/composables/useFlashcards'

const cards = ref<
  (Flashcard & {
    showAnswer: boolean
  })[]
>([])
const { flashcards, fetchFlashcards, deleteFlashcard } = useFlashcards()

onMounted(async () => {
  await fetchFlashcards()
})

watch(
  flashcards,
  (newFlashcards) => {
    cards.value = newFlashcards.map((flashcard) => ({ ...flashcard, showAnswer: false }))
  },
  { deep: true },
)

const toggleAnswer = (
  flashcard: Flashcard & {
    showAnswer: boolean
  },
) => {
  flashcard.showAnswer = !flashcard.showAnswer
}

const difficultyClass = (difficulty: Flashcard['difficulty']) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-green-100 text-green-800'
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'Hard':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString()
}
</script>
