<template>
  <div>
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Flashcard Creator</h2>
    <form @submit.prevent="handleCreateFlashcards" class="mb-8">
      <div class="mb-4">
        <label for="file" class="block text-gray-700 font-bold mb-2"
          >Upload File (PDF, DOCX, or TXT)</label
        >
        <input
          type="file"
          id="file"
          @change="handleFileUpload"
          accept=".pdf,.docx,.txt"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>
      <div class="mb-4">
        <label for="deck" class="block text-gray-700 font-bold mb-2">Deck Name</label>
        <input
          v-model="deckName"
          type="text"
          id="deck"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Enter a deck name"
          required
        />
      </div>
      <button
        type="submit"
        class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Creating...' : 'Create Flashcards' }}
      </button>
    </form>
    <div v-if="flashcards.length > 0" class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-2xl font-bold mb-4 text-gray-800">Generated Flashcards</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(flashcard, index) in flashcards"
          :key="index"
          class="bg-gray-100 p-4 rounded-lg"
        >
          <p class="font-bold text-gray-800 mb-2">Question: {{ flashcard.question }}</p>
          <p class="text-gray-600">Answer: {{ flashcard.answer }}</p>
          <div class="mt-2">
            <label class="block text-gray-700 font-bold mb-1">Difficulty:</label>
            <select
              v-model="flashcard.difficulty"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>
      <div class="mt-6 flex justify-end">
        <button
          @click="saveFlashcards"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Flashcards
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCreateFlashcards } from '@/composables/useCreateFlashcards'
import { useFlashcards } from '@/composables/useFlashcards'
import { useAuth } from '@/composables/useAuth'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'

const router = useRouter()
const file = ref<File | null>(null)
const deckName = ref('')
const { flashcards, createFlashcards, isLoading } = useCreateFlashcards()
const { isLoggedIn } = useAuth()
const { saveFlashcards: saveUserFlashcards } = useFlashcards()

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    file.value = target.files[0]
  }
}

const handleCreateFlashcards = async () => {
  if (file.value) {
    await createFlashcards(file.value)
  }
}

const saveFlashcards = async () => {
  if (isLoggedIn.value && flashcards.value.length > 0) {
    const flashcardsToSave = flashcards.value.map((f) => ({
      ...f,
      deck: deckName.value,
    }))
    await saveUserFlashcards(flashcardsToSave)
    router.push({ name: 'FlashcardList' })
    toast.success('Saved flashcards successfully')
  } else {
    toast.error('Error saving flashcard, try again')
  }
}
</script>
