<template>
  <div>
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Course Generator</h2>
    <form @submit.prevent="handleGenerateCourse" class="mb-8">
      <div class="mb-4">
        <label for="subject" class="block text-gray-700 font-bold mb-2">Subject</label>
        <input
          v-model="subject"
          type="text"
          id="subject"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Enter a subject"
          required
        />
      </div>
      <div class="mb-4">
        <label for="difficulty" class="block text-gray-700 font-bold mb-2">Difficulty Level</label>
        <select
          v-model="difficulty"
          id="difficulty"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="length" class="block text-gray-700 font-bold mb-2">Course Length (number of modules)</label>
        <input
          v-model.number="length"
          type="number"
          id="length"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          min="1"
          max="10"
          required
        />
      </div>
      <div class="mb-4">
        <label for="specificTopics" class="block text-gray-700 font-bold mb-2">Specific Topics (comma-separated)</label>
        <input
          v-model="specificTopics"
          type="text"
          id="specificTopics"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Enter specific topics (optional)"
        />
      </div>
      <button
        type="submit"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Generating...' : 'Generate Course' }}
      </button>
    </form>
    <div v-if="course" class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-2xl font-bold mb-4 text-gray-800">{{ course.title }}</h3>
      <ul class="space-y-4">
        <li v-for="(module, index) in course.modules" :key="index" class="border-b pb-4 last:border-b-0">
          <h4 class="text-xl font-semibold mb-2 text-gray-700">{{ module.title }}</h4>
          <p class="text-gray-600 mb-2">{{ module.content }}</p>
          <div v-if="module.quiz" class="mt-4">
            <h5 class="text-lg font-semibold mb-2 text-gray-700">Module Quiz</h5>
            <ul class="space-y-2">
              <li v-for="(question, qIndex) in module.quiz" :key="qIndex">
                <p class="font-medium text-gray-700">{{ question.question }}</p>
                <ul class="ml-4 mt-1">
                  <li v-for="(option, oIndex) in question.options" :key="oIndex" class="text-gray-600">
                    {{ option }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div class="mt-6 flex justify-end">
        <button
          @click="saveCourse"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Save Course
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCourses } from '@/composables/useCourses'
import { useAuth } from '@/composables/useAuth'

const subject = ref('')
const difficulty = ref('beginner')
const length = ref(5)
const specificTopics = ref('')

const { generateCourse, saveCourse: saveUserCourse, isLoading } = useCourses()
const { isLoggedIn } = useAuth()

const course = ref(null)

const handleGenerateCourse = async () => {
  const topics = specificTopics.value.split(',').map(topic => topic.trim()).filter(Boolean)
  course.value = await generateCourse(subject.value, difficulty.value, length.value, topics)
}

const saveCourse = async () => {
  if (isLoggedIn.value && course.value) {
    await saveUserCourse(course.value)
    // Show a success message or redirect to My Courses page
  } else {
    // Show a message to log in or sign up
  }
}
</script>

