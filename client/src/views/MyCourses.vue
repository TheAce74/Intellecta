<template>
  <div>
    <h2 class="text-3xl font-bold mb-6 text-gray-800">My Courses</h2>
    <div class="mb-6">
      <SearchBar :initial-query="searchQuery" @search="handleSearch" />
    </div>
    <div v-if="courses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CourseCard
        v-for="course in courses"
        :key="course._id"
        :course="course"
        @delete="deleteCourse"
        @update-progress="updateModuleProgress"
      />
    </div>
    <div v-else class="text-center py-12">
      <BookOpenIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <p class="text-xl font-semibold text-gray-600">You haven't saved any courses yet.</p>
      <p class="text-gray-500 mt-2">Generate a course to get started!</p>
      <router-link
        to="/course-generator"
        class="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Generate a Course
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { BookOpenIcon } from 'lucide-vue-next'
import { useCourses } from '@/composables/useCourses'
import CourseCard from '@/components/CourseCard.vue'
import SearchBar from '@/components/SearchBar.vue'

const { courses, fetchCourses, deleteCourse, updateModuleProgress } = useCourses()
const searchQuery = ref('')

onMounted(async () => {
  await fetchCourses()
})

const handleSearch = async (query: string) => {
  searchQuery.value = query
  await fetchCourses({ search: query })
}
</script>

