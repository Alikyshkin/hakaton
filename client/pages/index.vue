<template>
  <div>
    <ChatBot></ChatBot>
    <div class="bg-gray-50 p-10 rounded-md shadow-md">
      <div class="container items-center mx-auto">
        <h1 class="text-xl font-semibold mb-2">Отделения и банкоматы</h1>
        <p class="text-gray-600 mb-4">Находите отделения и банкоматы рядом с вами, используя единую карту</p>
        <div class="relative mb-4 lg:flex lg:flex-col lg:items-center lg:justify-center">
          <img src="https://www.vtb.ru/media-files/vtb.ru/shared/images/hero/Gruppa_H_MapATM_1x.webp" alt="3D Map"
               class="object-cover rounded-md sm:px-44 md:px-44 lg:px-0">

          <!-- Add your pins here if necessary -->

          <nuxt-link to="/offices">
            <button
                class="bg-blue-600 text-white p-2 sm:w-full md:w-full lg:w-full lg:px-72 rounded-md hover:bg-blue-700">
              Смотреть на карте
            </button>
          </nuxt-link>
        </div>

      </div>
    </div>
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
