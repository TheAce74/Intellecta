<template>
  <div>
    <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">Welcome to Intellecta</h1>
    <p class="text-xl mb-12 text-center text-gray-600">
      Your personalized learning assistant powered by AI
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <FeatureCard
        title="Course Generator"
        description="Create personalized courses on any subject with our AI-powered course generator."
        icon="BookOpen"
        link="/course-generator"
      />
      <FeatureCard
        title="Flashcard Creator"
        description="Generate flashcards from your study materials to enhance your learning experience."
        icon="Layers"
        link="/flashcard-creator"
      />
      <FeatureCard
        title="Adaptive Learning"
        description="Experience tailored learning paths that adapt to your progress and preferences."
        icon="TrendingUp"
        link="/my-courses"
      />
      <FeatureCard
        title="Smart Recommendations"
        description="Discover new courses and flashcards tailored to your interests and learning history."
        icon="Lightbulb"
        link="/recommendations"
      />
    </div>
    <div class="text-center mt-16">
      <h2 class="text-3xl font-bold mb-4 text-gray-800">Ready to Supercharge Your Learning?</h2>
      <p class="text-xl mb-8 text-gray-600">
        Join Intellecta today and unlock your full potential!
      </p>
      <router-link
        to="/register"
        class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Get Started
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import FeatureCard from '@/components/FeatureCard.vue'
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style>
