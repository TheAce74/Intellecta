<template>
  <footer class="bg-gray-800 text-white py-8">
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap justify-between">
        <div class="w-full md:w-1/3 mb-6 md:mb-0">
          <h3 class="text-xl font-semibold mb-2">Intellecta</h3>
          <p class="text-gray-400">Your personalized learning assistant</p>
        </div>
        <div class="w-full md:w-1/3 mb-6 md:mb-0">
          <h4 class="text-lg font-semibold mb-2">Quick Links</h4>
          <ul>
            <li><router-link to="/" class="text-gray-400 hover:text-white">Home</router-link></li>
            <li><router-link to="/course-generator" class="text-gray-400 hover:text-white">Course Generator</router-link></li>
            <li><router-link to="/flashcard-creator" class="text-gray-400 hover:text-white">Flashcard Creator</router-link></li>
            <li><router-link to="/my-courses" class="text-gray-400 hover:text-white">My Courses</router-link></li>
          </ul>
        </div>
        <div class="w-full md:w-1/3">
          <h4 class="text-lg font-semibold mb-2">Contact Us</h4>
          <p class="text-gray-400">Email: support@intellecta.com</p>
          <p class="text-gray-400">Phone: +1 (123) 456-7890</p>
        </div>
      </div>
      <div class="mt-8 text-center text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} Intellecta. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

