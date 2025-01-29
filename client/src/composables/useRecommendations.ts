import { ref } from "vue"
import axios from "axios"

interface RecommendationItem {
  type: "course" | "flashcard"
  id: string
  title: string
  similarity: number
}

export function useRecommendations() {
  const recommendations = ref<RecommendationItem[]>([])
  const isLoading = ref(false)

  const fetchRecommendations = async () => {
    isLoading.value = true
    try {
      const response = await axios.get("/api/recommendations")
      recommendations.value = response.data
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    recommendations,
    isLoading,
    fetchRecommendations,
  }
}

