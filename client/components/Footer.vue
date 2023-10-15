<template>
  <div>
  <div class="bg p-10 rounded-md shadow-md">
    <div class="container mx-auto pt-4s">
      <div class="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1 gap-4">
        <!-- Левая колонка -->
        <div class="space-y-4">
          <div class="text-xl">1000
            <p class="text-gray-500 font-thin text-xs"> Бесплатно с мобильного </p>
          </div>
          <div class="text-xl">8 (800) 100-24-24
            <p class="text-gray-500 font-thin text-xs"> Бесплатный звонок по России </p>
          </div>
          <div class="text-xl">+7 (495) 785-53-05
            <p class="text-gray-500 font-thin text-xs"> Для звонков за пределами России </p>
          </div>
        </div>

          <!-- Средняя колонка -->
          <div class="space-y-4">
            <div class="font-medium hover:text-blue-600 hover:cursor-pointer">Отделения и банкоматы</div>
            <div class="font-medium hover:text-blue-600 hover:cursor-pointer">Курсы валют</div>
            <div class="font-medium hover:text-blue-600 hover:cursor-pointer">Контакты</div>
          </div>

          <!-- Правая колонка -->
          <div class="space-y-4">
            <div class="hover:cursor-pointer">О банке</div>
            <div class="hover:cursor-pointer">О группе</div>
            <div class="hover:cursor-pointer">Реквизиты</div>
          </div>
        </div>
      </div>
    </div>
    <ChatBot></ChatBot>
  </div>
</template>

<script>
import ChatBot from '../components/ChatBot.vue';

export default {
  name: "Footer",
  components: {ChatBot},
}
</script>

<style scoped>

</style>
