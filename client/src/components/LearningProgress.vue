<template>
  <div class="bg-white p-6 rounded-lg shadow-md mt-12">
    <h3 class="text-2xl font-bold mb-4 text-gray-800">Learning Progress</h3>
    <div class="mb-6">
      <h4 class="text-lg font-semibold mb-2 text-gray-700">Course Completion</h4>
      <div class="relative pt-1">
        <div class="flex mb-2 items-center justify-between">
          <div>
            <span
              class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200"
            >
              {{ Math.round(courseCompletion) }}% Complete
            </span>
          </div>
        </div>
        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div
            :style="{ width: `${courseCompletion}%` }"
            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
          ></div>
        </div>
      </div>
    </div>
    <div class="mb-6">
      <h4 class="text-lg font-semibold mb-2 text-gray-700">Flashcard Mastery</h4>
      <div class="flex justify-between">
        <div class="text-center">
          <p class="text-3xl font-bold text-green-600">
            {{ flashcardsMastered }}
          </p>
          <p class="text-sm text-gray-600">Mastered</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-yellow-600">
            {{ flashcardsLearning }}
          </p>
          <p class="text-sm text-gray-600">Learning</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-red-600">{{ flashcardsNew }}</p>
          <p class="text-sm text-gray-600">New</p>
        </div>
      </div>
    </div>
    <div>
      <h4 class="text-lg font-semibold mb-2 text-gray-700">Study Time</h4>
      <VueApexCharts
        type="area"
        height="350"
        :options="chartOptions"
        :series="chartSeries"
      ></VueApexCharts>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps<{
  courseCompletion: number
  flashcardsMastered: number
  flashcardsLearning: number
  flashcardsNew: number
  studyTimeData: { date: string; minutes: number }[]
}>()

const chartOptions = ref<any>({
  chart: {
    id: 'study-time-chart',
    type: 'area',
    height: 350,
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
  },
  title: {
    text: 'Study Time Trend',
    align: 'left',
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    title: {
      text: 'Minutes',
    },
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy',
    },
  },
})

const chartSeries = ref<
  Array<{
    name: string
    data: number[][]
  }>
>([
  {
    name: 'Study Time',
    data: [],
  },
])

const updateChartData = () => {
  chartSeries.value = [
    {
      name: 'Study Time',
      data: props.studyTimeData.map((item) => [new Date(item.date).getTime(), item.minutes]),
    },
  ]
}

watch(
  () => props.studyTimeData,
  () => {
    updateChartData()
  },
  { deep: true, immediate: true },
)

onMounted(() => {
  updateChartData()
})
</script>
