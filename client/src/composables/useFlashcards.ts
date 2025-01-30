import { axiosInstance } from '@/lib/axios'
import { ref, computed } from 'vue'

export interface Flashcard {
  _id: string
  question: string
  answer: string
  deck: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  nextReviewDate: Date
  reviewCount: number
  easeFactor: number
  interval: number
}

export function useFlashcards() {
  const flashcards = ref<Flashcard[]>([])
  const isLoading = ref(false)

  const fetchFlashcards = async (
    params: { deck?: string; difficulty?: string; search?: string } = {},
  ) => {
    isLoading.value = true
    try {
      const response = await axiosInstance.get('/api/flashcards', { params })
      flashcards.value = response.data
    } catch (error) {
      console.error('Error fetching flashcards:', error)
    } finally {
      isLoading.value = false
    }
  }

  const saveFlashcards = async (newFlashcards: Omit<Flashcard, '_id' | 'nextReviewDate'>[]) => {
    isLoading.value = true
    try {
      const response = await axiosInstance.post('/api/flashcards', newFlashcards)
      flashcards.value.push(...response.data)
    } catch (error) {
      console.error('Error saving flashcards:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const reviewFlashcard = async (
    id: string,
    quality: number,
    difficulty: 'Easy' | 'Medium' | 'Hard',
  ) => {
    isLoading.value = true
    try {
      const response = await axiosInstance.post(`/api/flashcards/${id}/review`, {
        quality,
        difficulty,
      })
      const index = flashcards.value.findIndex((f) => f._id === id)
      if (index !== -1) {
        flashcards.value[index] = response.data
      }
    } catch (error) {
      console.error('Error reviewing flashcard:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteFlashcard = async (id: string) => {
    isLoading.value = true
    try {
      await axiosInstance.delete(`/api/flashcards/${id}`)
      flashcards.value = flashcards.value.filter((flashcard) => flashcard._id !== id)
    } catch (error) {
      console.error('Error deleting flashcard:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const decks = computed(() => {
    return [...new Set(flashcards.value.map((f) => f.deck))]
  })

  return {
    flashcards,
    isLoading,
    fetchFlashcards,
    saveFlashcards,
    reviewFlashcard,
    deleteFlashcard,
    decks,
  }
}
