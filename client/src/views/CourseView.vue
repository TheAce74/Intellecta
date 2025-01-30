<template>
  <div v-if="course" class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-4 text-gray-800">{{ course.title }}</h1>
    <div class="mb-6">
      <span
        class="inline-block bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded"
      >
        {{ course.difficulty }}
      </span>
    </div>
    <div class="space-y-8">
      <div
        v-for="(module, index) in course.modules"
        :key="index"
        class="bg-white shadow-md rounded-lg p-6"
      >
        <h2 class="text-2xl font-semibold mb-4 text-gray-700">{{ module.title }}</h2>
        <p class="text-gray-600 mb-6">{{ module.content }}</p>
        <div v-if="module.quiz" class="mt-6">
          <h3 class="text-xl font-semibold mb-4 text-gray-700">Module Quiz</h3>
          <div v-for="(question, qIndex) in module.quiz" :key="qIndex" class="mb-6">
            <Disclosure v-slot="{ open }">
              <DisclosureButton
                class="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
              >
                <span>{{ question.question }}</span>
                <ChevronUpIcon
                  :class="open ? 'transform rotate-180' : ''"
                  class="w-5 h-5 text-blue-500"
                />
              </DisclosureButton>
              <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-gray-500">
                <ul class="list-disc list-inside space-y-2">
                  <li v-for="(option, oIndex) in question.options" :key="oIndex">
                    {{ option }}
                  </li>
                </ul>
                <div class="mt-4">
                  <button
                    @click="showAnswer(index, qIndex)"
                    v-if="!question.showAnswer"
                    class="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Show Answer
                  </button>
                  <p v-else class="font-medium text-green-600">
                    Correct Answer: {{ question.correctAnswer }}
                  </p>
                </div>
              </DisclosurePanel>
            </Disclosure>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex justify-center items-center h-64">
    <p class="text-xl text-gray-600">Loading course...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronUpIcon } from '@heroicons/vue/solid'
import { useCourses } from '@/composables/useCourses'

interface Module {
  title: string
  content: string
  completed: boolean
  quiz: {
    question: string
    options: string[]
    correctAnswer: string
    showAnswer: boolean
  }[]
}

interface Course {
  _id: string
  title: string
  modules: Module[]
  progress: number
  difficulty: string
}

const route = useRoute()
const { getCourseById } = useCourses()
const course = ref<Course | null>(null)

onMounted(async () => {
  const courseId = route.params.id as string
  const response = await getCourseById(courseId)
  course.value = !response
    ? null
    : {
        ...response,
        modules: response.modules.map((module) => ({
          ...module,
          quiz: module.quiz.map((q) => ({ ...q, showAnswer: false })),
        })),
      }
})

const showAnswer = (moduleIndex: number, questionIndex: number) => {
  if (course.value && course.value.modules) {
    course.value.modules[moduleIndex].quiz[questionIndex].showAnswer = true
  }
}
</script>
