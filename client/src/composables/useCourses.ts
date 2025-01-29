import { ref } from "vue"
import axios from "axios"

interface Module {
  title: string
  content: string
  completed: boolean
  quiz: {
    question: string
    options: string[]
    correctAnswer: string
  }[]
}

interface Course {
  id: string
  title: string
  modules: Module[]
  progress: number
  difficulty: string
}

export function useCourses() {
  const courses = ref<Course[]>([])
  const isLoading = ref(false)

  const fetchCourses = async (params: { search?: string; difficulty?: string } = {}) => {
    isLoading.value = true
    try {
      const response = await axios.get("/api/courses", { params })
      courses.value = response.data
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      isLoading.value = false
    }
  }

  const generateCourse = async (subject: string, difficulty: string, length: number, specificTopics: string[]) => {
    isLoading.value = true
    try {
      const response = await axios.post("/api/courses/generate", { subject, difficulty, length, specificTopics })
      return response.data
    } catch (error) {
      console.error("Error generating course:", error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const saveCourse = async (course: Omit<Course, "id" | "progress">) => {
    isLoading.value = true
    try {
      const response = await axios.post("/api/courses", course)
      courses.value.push(response.data)
    } catch (error) {
      console.error("Error saving course:", error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteCourse = async (id: string) => {
    isLoading.value = true
    try {
      await axios.delete(`/api/courses/${id}`)
      courses.value = courses.value.filter((course) => course.id !== id)
    } catch (error) {
      console.error("Error deleting course:", error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateModuleProgress = async (courseId: string, moduleIndex: number, completed: boolean) => {
    isLoading.value = true
    try {
      const response = await axios.post("/api/courses/progress", { courseId, moduleIndex, completed })
      const updatedCourse = response.data.course
      const index = courses.value.findIndex((c) => c.id === courseId)
      if (index !== -1) {
        courses.value[index] = updatedCourse
      }
    } catch (error) {
      console.error("Error updating progress:", error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    courses,
    isLoading,
    fetchCourses,
    generateCourse,
    saveCourse,
    deleteCourse,
    updateModuleProgress,
  }
}

