import { axiosInstance } from '@/lib/axios'
import { ref } from 'vue'

interface Flashcard {
  question: string
  answer: string
}

export function useCreateFlashcards() {
  const flashcards = ref<Flashcard[]>([])

  const createFlashcards = async (file: File) => {
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
    }
  }

  return {
    flashcards,
    createFlashcards,
  }
}
