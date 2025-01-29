<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="p-6">
      <h3 class="text-xl font-semibold mb-2 text-gray-800">{{ course.title }}</h3>
      <p class="text-gray-600 mb-4">{{ course.modules.length }} modules</p>
      <div class="mb-4">
        <div class="flex justify-between items-center mb-1">
          <span class="text-sm font-medium text-gray-700">Progress</span>
          <span class="text-sm font-medium text-gray-700">{{ Math.round(course.progress) }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: `${course.progress}%` }"></div>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <router-link
          :to="`/course/${course.id}`"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Course
        </router-link>
        <button
          @click="handleDelete"
          class="text-red-600 hover:text-red-800"
        >
          <TrashIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
    <div class="bg-gray-50 px-6 py-4">
      <h4 class="text-sm font-medium text-gray-700 mb-2">Modules</h4>
      <ul class="space-y-2">
        <li v-for="(module, index) in course.modules" :key="index" class="flex items-center">
          <input
            :id="`module-${course.id}-${index}`"
            type="checkbox"
            :checked="module.completed"
            @change="updateProgress(index, $event.target.checked)"
            class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          >
          <label :for="`module-${course.id}-${index}`" class="ml-2 text-sm text-gray-700">{{ module.title }}</label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon } from 'lucide-vue-next'

interface Module {
  title: string
  content: string
  completed: boolean
}

interface Course {
  id: string
  title: string
  modules: Module[]
  progress: number
}

const props = defineProps<{
  course: Course
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'update-progress', courseId: string, moduleIndex: number, completed: boolean): void
}>()

const handleDelete = () => {
  emit('delete', props.course.id)
}

const updateProgress = (moduleIndex: number, completed: boolean) => {
  emit('update-progress', props.course.id, moduleIndex, completed)
}
</script>

