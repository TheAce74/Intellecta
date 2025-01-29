<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold mb-4 text-gray-800">Learning Progress</h3>
    <div class="mb-6">
      <h4 class="text-lg font-semibold mb-2 text-gray-700">
        Course Completion
      </h4>
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
      <h4 class="text-lg font-semibold mb-2 text-gray-700">
        Flashcard Mastery
      </h4>
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
      <canvas ref="studyTimeChart"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Chart } from "chart.js";

const props = defineProps<{
  courseCompletion: number;
  flashcardsMastered: number;
  flashcardsLearning: number;
  flashcardsNew: number;
  studyTimeData: { date: string; minutes: number }[];
}>();

const studyTimeChart = ref<Chart | null>(null);
const studyTimeChartRef = ref<HTMLCanvasElement | null>(null);

const createStudyTimeChart = () => {
  if (studyTimeChartRef.value) {
    studyTimeChart.value = new Chart(studyTimeChartRef.value, {
      type: "line",
      data: {
        labels: props.studyTimeData.map((item) => item.date),
        datasets: [
          {
            label: "Study Time (minutes)",
            data: props.studyTimeData.map((item) => item.minutes),
            borderColor: "rgb(59, 130, 246)",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Minutes",
            },
          },
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
        },
      },
    });
  }
};

onMounted(() => {
  createStudyTimeChart();
});

watch(
  () => props.studyTimeData,
  () => {
    if (studyTimeChart.value) {
      studyTimeChart.value.data.labels = props.studyTimeData.map(
        (item) => item.date
      );
      studyTimeChart.value.data.datasets[0].data = props.studyTimeData.map(
        (item) => item.minutes
      );
      studyTimeChart.value.update();
    }
  },
  { deep: true }
);
</script>
