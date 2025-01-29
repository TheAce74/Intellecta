import { ref } from "vue"
import axios from "axios"

interface Module {
  title: string
  content: string
}

interface Course {
  title: string
  modules: Module[]
}

export function useGenerateCourse() {
  const course = ref<Course | null>(null)

  const generateCourse = async (subject: string) => {
    try {
      const response = await axios.post("/api/generate-course", { subject })
      course.value = response.data
    } catch (error) {
      console.error("Error generating course:", error)
    }
  }

  return {
    course,
    generateCourse,
  }
}

