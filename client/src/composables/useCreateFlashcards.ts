import { ref } from "vue"
import axios from "axios"

interface Flashcard {
  question: string
  answer: string
}

export function useCreateFlashcards() {
  const flashcards = ref<Flashcard[]>([])

  const createFlashcards = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await axios.post("/api/create-flashcards", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      flashcards.value = response.data
    } catch (error) {
      console.error("Error creating flashcards:", error)
    }
  }

  return {
    flashcards,
    createFlashcards,
  }
}

