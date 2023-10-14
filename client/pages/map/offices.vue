<template>
  <div class="map-container ">
    <div class="position-absolute ">
      <div class="bg-white h-1/2 w-1/4 p-4 overflow-x-hidden overflow-y-auto sidebar-map ">
        <!-- Buttons to toggle view -->
        <div class="mb-4">
          <button
              @click="setActiveView('all')"
              class="mr-2 px-4 py-2 border rounded"
              :class="{ 'bg-blue-500 text-white': activeView === 'all' }"
          >
            Все
          </button>
          <button
              @click="setActiveView('offices')"
              class="mr-2 px-4 py-2 border rounded"
              :class="{ 'bg-blue-500 text-white': activeView === 'offices' }"
          >
            Офисы
          </button>
          <button
              @click="setActiveView('atms')"
              class="px-4 py-2 border rounded"
              :class="{ 'bg-blue-500 text-white': activeView === 'atms' }"
          >
            Банкоматы
          </button>
        </div>

        <div class="mb4">
          <div class="ml-4 inline-flex">
            <input type="checkbox" id="individual" value="individual" v-model="selectedTypes" class="mr-1"/>
            <label for="individual" class="mr-2">Физ. лицо</label>
            <input type="checkbox" id="corporate" value="corporate" v-model="selectedTypes" class="mr-1"/>
            <label for="corporate">Юр. лицо</label>
          </div>
        </div>

        <div class="mb-4">
          <input type="text" v-model="searchQuery" placeholder="Поиск по отделениям" class="w-full p-2 mb-2 border rounded"/>
          <!-- ... остальные кнопки и чекбоксы ... -->
        </div>

        <!-- Offices -->
        <div v-if="activeView === 'all' || activeView === 'offices'" v-for="point in filteredPoints" :key="point.salePointName" @click="flyTo(point)" class="hover:cursor-pointer hover:bg-gray-100">
          <h3 class="text-xl font-bold mb-2">{{ point.salePointName }}</h3>
          <p class="mb-1">{{ point.address }}</p>
          <p class="mb-4">Тип офиса: {{ point.officeType }}</p>
        </div>

        <!-- ATMs -->
        <div v-if="activeView === 'all' || activeView === 'atms'" v-for="atm in filteredAtms" :key="atm.address" @click="flyTo(atm)" class="hover:cursor-pointer hover:bg-gray-100">
          <h3 class="text-xl font-bold mb-2">{{ atm.address }}</h3>
          <p class="mb-1">Круглосуточно: {{ atm.allDay ? 'Да' : 'Нет' }}</p>
          <p class="mb-1">Поддержка для инвалидов: {{ atm.services.wheelchair.serviceCapability }}</p>
          <p class="mb-1">Поддержка для слепых: {{ atm.services.blind.serviceCapability }}</p>
          <p class="mb-1">NFC для банковских карт: {{ atm.services.nfcForBankCards.serviceCapability }}</p>
          <p class="mb-1">Чтение QR: {{ atm.services.qrRead.serviceCapability }}</p>
          <p class="mb-1">Поддержка USD: {{ atm.services.supportsUsd.serviceCapability }}</p>
          <p class="mb-1">Поддержка пополнения RUB: {{ atm.services.supportsChargeRub.serviceCapability }}</p>
          <p class="mb-1">Поддержка EUR: {{ atm.services.supportsEur.serviceCapability }}</p>
          <p class="mb-1">Поддержка RUB: {{ atm.services.supportsRub.serviceCapability }}</p>
        </div>
      </div>
    </div>
  </div>
  <YandexMap
      :coordinates="[55.755573, 37.617296]"
      :zoom="zoom"

  >
    <YandexClusterer :options="{ preset: 'islands#nightClusterIcons' }">
    <YandexMarker :coordinates="myCoordinates" :marker-id="12345">
      <template #component class="w-50 h-50">
        <CustomBalloon v-model="name" class="w-50 h-50"/>
      </template>
    </YandexMarker>
      <div v-for="point in points" :key="point.id" @click="flyTo(point)" v-if="activeView === 'all' || activeView === 'offices'">
        <YandexMarker :coordinates="[point.latitude, point.longitude]" :marker-id="point.address" :options="{ preset: 'islands#greenIcon'}" >
          <template #component class="w-50 h-50">
            <CustomBalloon v-model="name" class="w-50 h-50"/>
          </template>
        </YandexMarker>
      </div>
      <div v-for="atm in atms" :key="atm.address" @click="flyTo(atm)" v-if="activeView === 'all' || activeView === 'atms'">
        <YandexMarker :coordinates="[atm.latitude, atm.longitude]" :marker-id="atm.address" :options="{ preset: 'islands#redIcon'}">
          <template #component class="w-50 h-50">
            <CustomBalloon v-model="name" class="w-50 h-50"/>
          </template>
        </YandexMarker>
      </div>
    </YandexClusterer>

  </YandexMap>
</template>

<script>
import { ref } from 'vue';
import { yandexMap, yandexMarker, yandexClusterer } from 'vue-yandex-maps';
import CustomBalloon from '../../components/CustomBalloon.vue';  // Assuming Sidebar is in the same folder
import officesData from '../../data/offices.json';  // Adjust path accordingly
import atmData from '../../data/atms.json';  // Adjust path accordingly

export default {
  name: "offices",

  components: {
    YandexMap: yandexMap,
    YandexMarker: yandexMarker,
    YandexClusterer: yandexClusterer,
    CustomBalloon
  },
  data() {
    return {
      coordinates: null,
      myCoordinates: null,
      zoom: 10,
      points: null,
      atms: null,
      selectedType: 'all',
      activeView: 'all',  // Initially show all
      name: 'Custom', // Добавим новое свойство name

      selectedTypes: [],
      searchQuery: '',
    };
  },
  mounted() {
    this.fetchOffices();
    this.fetchATM();
    this.fetchUserLocation();
  },
  methods: {
    setActiveView(view) {
      this.activeView = view;
      this.$emit('update:modelValue', view);  // Emit the update event
    },
    fetchOffices() {
      this.points = officesData;
    },
    fetchATM() {
      this.atms = atmData.atms;
    },
    getCoordinates() {
      return [55 + Math.random(), 33 + Math.random()];
    },
    fetchUserLocation() {
      this.getUserLocation(
          (latitude, longitude) => {
            this.myCoordinates = [latitude, longitude];
          },
          errorMessage => {
            console.error(errorMessage);
          }
      );
    },
    getUserLocation(successCallback, errorCallback) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
              successCallback(position.coords.latitude, position.coords.longitude);
            },
            error => {
              if (errorCallback) {
                errorCallback(error.message);
              }
            }
        );
      } else {
        if (errorCallback) {
          errorCallback("Геолокация не поддерживается этим браузером.");
        }
      }
    }
  },
  computed: {
    filteredPoints() {
      if (!this.points) return [];
      return this.points
    },
    filteredAtms() {
      if (!this.atms) return [];
      return this.atms
    }
  }
};
</script>

<style scoped>
.yandex-container {
  height: 800px;
}
.map-container {
  display: flex;
}


.sidebar {
  position: absolute;
  width: 20%;
  background-color: white;
  height: 100vh;
  overflow-y: auto;
  z-index: 1;
  margin-top: 15px;
  margin-left: 30px;
  margin-bottom: 15px;
}
.sidebar-map {
  position: absolute;
  top: 90px;
  left: 15px;
  height: 80vh;
  z-index: 1;
}
.yandex-balloon {
  height: 400px;
  width: 400px;
  overflow-y: auto;  /* Allow vertical scrolling if content exceeds */

}
.custom-balloon-content {
  width: 400px;      /* Adjust width as per requirement */
  height: 400px;     /* Adjust height as per requirement */
  overflow-y: auto;  /* Allow vertical scrolling if content exceeds */
}

.ymaps-2-1-79-balloon__layout {
  min-width: 100px;
  height: 140%;
  min-height: 50px;
}

.button-active {
  background-color: #3490dc; /* blue */
  color: white;
}
</style>
