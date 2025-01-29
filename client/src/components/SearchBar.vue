<template>
  <div class="flex items-center">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search..."
      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      @input="handleSearch"
    />
    <button
      class="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      @click="handleSearch"
    >
      Search
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  initialQuery?: string
}>()

const emit = defineEmits<{
  (e: 'search', query: string): void
}>()

const searchQuery = ref(props.initialQuery || '')

const handleSearch = () => {
  emit('search', searchQuery.value)
}

watch(() => props.initialQuery, (newValue) => {
  if (newValue !== undefined) {
    searchQuery.value = newValue
  }
})
</script>

