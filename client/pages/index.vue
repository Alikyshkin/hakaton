<template>
  <div class="bg-gray-50 p-10 rounded-md shadow-md">
    <h1 class="text-xl font-semibold mb-2">Отделения и банкоматы</h1>
    <p class="text-gray-600 mb-4">Находите отделения и банкоматы рядом с вами, используя единую карту</p>
    <div class="relative mb-4">
      <img src="https://www.vtb.ru/media-files/vtb.ru/shared/images/hero/Gruppa_H_MapATM_1x.webp" alt="3D Map" class="  object-cover rounded-md px-44">
      <!-- You can replace the pins with SVG or any other icons -->
      <div class="absolute top-1/4 left-1/3">
        <span class="bg-blue-500 text-white p-2 rounded-full">
          <!-- Add your pin icon here -->
        </span>
      </div>
      <div class="absolute top-1/2 left-2/3">
        <span class="bg-blue-500 text-white p-2 rounded-full">
          <!-- Add your pin icon here -->
        </span>
      </div>
    </div>
    <nuxt-link to="/map/offices">
      <button class="bg-blue-600 text-white p-2 w-full rounded-md hover:bg-blue-700">Смотреть на карте</button>
    </nuxt-link>
    <ChatBot></ChatBot>
  </div>
</template>

<script>
import ChatBot from '../components/ChatBot.vue';
export default {
  name: "index.vue",
  components: {ChatBot},
}
</script>

<style scoped>

</style>
