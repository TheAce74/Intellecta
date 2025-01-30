import type { Flashcard } from '@/composables/useFlashcards'
import { axiosInstance } from '@/lib/axios'
import { ref } from 'vue'

export function useCreateFlashcards() {
  const flashcards = ref<Flashcard[]>([])
  const isLoading = ref(false)

  const createFlashcards = async (file: File) => {
    isLoading.value = true
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axiosInstance.post('/api/flashcards/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      flashcards.value = response.data
    } catch (error) {
      console.error('Error creating flashcards:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    flashcards,
    createFlashcards,
    isLoading,
  }
}
