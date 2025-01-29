<template>
  <div>
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Flashcard Review</h2>
    <div v-if="currentFlashcard" class="bg-white p-6 rounded-lg shadow-md">
      <div class="mb-4">
        <p class="text-xl font-semibold mb-2">Question:</p>
        <p class="text-gray-700">{{ currentFlashcard.question }}</p>
      </div>
      <div v-if="showAnswer" class="mb-4">
        <p class="text-xl font-semibold mb-2">Answer:</p>
        <p class="text-gray-700">{{ currentFlashcard.answer }}</p>
      </div>
      <div class="flex justify-between items-center">
        <button
          v-if="!showAnswer"
          @click="showAnswer = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Show Answer
        </button>
        <div v-else class="space-x-2">
          <button
            v-for="quality in [0, 1, 2, 3, 4, 5]"
            :key="quality"
            @click="handleReview(quality)"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ quality }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <p class="text-xl font-semibold text-gray-600">No flashcards to review at the moment.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFlashcards } from '@/composables/useFlashcards'

const { flashcards, fetchFlashcards, reviewFlashcard } = useFlashcards()
const currentFlashcard = ref(null)
const showAnswer = ref(false)

onMounted(async () => {
  await fetchFlashcards()
  nextFlashcard()
})

const nextFlashcard = () => {
  currentFlashcard.value = flashcards.value.shift() || null
  showAnswer.value = false
}

const handleReview = async (quality: number) => {
  if (currentFlashcard.value) {
    await reviewFlashcard(currentFlashcard.value.id, quality, currentFlashcard.value.difficulty)
    nextFlashcard()
  }
}
</script>

