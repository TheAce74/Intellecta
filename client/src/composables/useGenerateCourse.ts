import { axiosInstance } from '@/lib/axios'
import { ref } from 'vue'

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
      const response = await axiosInstance.post('/api/courses/generate', { subject })
      course.value = response.data
    } catch (error) {
      console.error('Error generating course:', error)
    }
  }

  return {
    course,
    generateCourse,
  }
}
