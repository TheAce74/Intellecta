import { axiosInstance } from '@/lib/axios'
import { ref } from 'vue'

interface StudyTimeData {
  date: string
  minutes: number
}

export function useStudyTime() {
  const studyTimeData = ref<StudyTimeData[]>([])
  const isLoading = ref(false)

  const fetchStudyTimeData = async () => {
    isLoading.value = true
    try {
      const response = await axiosInstance.get('/api/study-time')
      studyTimeData.value = response.data
    } catch (error) {
      console.error('Error fetching study time data:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addStudyTime = async (minutes: number) => {
    isLoading.value = true
    try {
      const response = await axiosInstance.post('/api/study-time', { minutes })
      studyTimeData.value.push(response.data)
    } catch (error) {
      console.error('Error adding study time:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    studyTimeData,
    isLoading,
    fetchStudyTimeData,
    addStudyTime,
  }
}
