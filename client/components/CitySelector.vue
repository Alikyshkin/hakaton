<template>
  <div class="relative">
    <span class="text-gray-900 cursor-pointer" @click="togglePopup">
      {{ city }}
    </span>
    <div v-if="showPopup" class="absolute left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 popup-city">
      <p v-if="!changingCity" class="mb-1">Ваш город {{ city }}?</p>
      <div v-if="!changingCity" class="flex space-x-4">
        <button @click="confirmCity" class="flex-1 py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
          Все верно
        </button>
        <button @click="initiateChangeCity" class="flex-1 py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
          Сменить город
        </button>
      </div>
      <div v-if="changingCity">
        <select v-model="selectedCity" class="mb-2">
          <option v-for="cityOption in cityList" :key="cityOption" :value="cityOption">
            {{ cityOption }}
          </option>
        </select>
        <button @click="confirmChangeCity" class="py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
          Выбрать
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      city: 'Москва',
      selectedCity: 'Москва',
      showPopup: false,
      changingCity: false,
      cityList: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань']  // ...другие города
    };
  },
  mounted() {
    const savedCity = localStorage.getItem('city');
    if (savedCity) {
      this.city = savedCity;
    } else {
      this.showPopup = true;
    }
  },
  methods: {
    togglePopup() {
      this.showPopup = !this.showPopup;
    },
    confirmCity() {
      localStorage.setItem('city', this.city);
      this.showPopup = false;
    },
    initiateChangeCity() {
      this.changingCity = true;
    },
    confirmChangeCity() {
      this.city = this.selectedCity;
      localStorage.setItem('city', this.selectedCity);
      this.showPopup = false;
      this.changingCity = false;
    }
  }
}
</script>

<style scoped>
.popup-city {
  z-index: 3;
}
</style>
