<template>
  <router-link
    :to="link"
    class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center text-center"
  >
    <component :is="iconComponent" class="w-12 h-12 text-blue-600 mb-4" />
    <h3 class="text-xl font-semibold mb-2 text-gray-800">{{ title }}</h3>
    <p class="text-gray-600">{{ description }}</p>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps<{
  title: string
  description: string
  icon: string
  link: string
}>()

const iconComponent = computed(() => {
  return (LucideIcons as any)[props.icon]
})
</script>

