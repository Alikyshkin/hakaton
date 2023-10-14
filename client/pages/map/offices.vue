<template>
  <div class="map-container ">
    <div class="position-absolute ">
      <div class="bg-white h-1/2 w-1/4 p-4 overflow-x-hidden overflow-y-auto sidebar-map ">
        <!-- Иконка крестика -->
        <div v-if="selectedPoint" class="absolute top-2 right-2 cursor-pointer" @click="selectedPoint = null">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 90 90" fill="none">
            <path
                d="M50.475 45L71.25 65.775V71.25H65.775L45 50.475L24.225 71.25H18.75V65.775L39.525 45L18.75 24.225V18.75H24.225L45 39.525L65.775 18.75H71.25V24.225L50.475 45Z"
                fill="black"/>
          </svg>
        </div>

        <div v-if="!selectedPoint">
          <!-- Buttons to toggle view -->
          <div class="flex flex-row flex-wrap gap-2 mb-2">
            <button
                @click="setActiveView('all')"
                class="px-4 py-2 border rounded-full"
                :class="{ 'bg-blue-500 text-white': activeView === 'all' }"
            >
              Все
            </button>
            <button
                @click="setActiveView('offices')"
                class="px-4 py-2 border rounded-full"
                :class="{ 'bg-blue-500 text-white': activeView === 'offices' }"
            >
              Офисы
            </button>
            <button
                @click="setActiveView('atms')"
                class="px-4 py-2 border rounded-full"
                :class="{ 'bg-blue-500 text-white': activeView === 'atms' }"
            >
              Банкоматы
            </button>
          </div>

          <div class="mb-2 flex flex-row flex-wrap items-center justify-center">
            <div>
              <input type="checkbox" id="individual" value="individual" v-model="selectedTypes" class="mr-1"/>
              <label for="individual" class="mr-2">Физ. лицо</label>
            </div>

            <div>
              <input type="checkbox" id="corporate" value="corporate" v-model="selectedTypes" class="mr-1"/>
              <label for="corporate">Юр. лицо</label>
            </div>
          </div>

          <div class="mb-4">
            <form @submit.prevent="performSearch" class="flex">
              <input type="text" v-model="searchQuery" placeholder="Поиск по отделениям"
                     class="w-full p-2 border rounded-l"/>
              <button type="submit" class="px-4 py-2 border rounded-r flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 50 50">
                  <path
                      d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>

        <!-- Детальный просмотр -->
        <div v-if="selectedPoint" class="detail-view">
          <h2 class="font-bold mb-2">{{ selectedPoint.salePointName || selectedPoint.address }}</h2>

          <!-- Details for office -->
          <p v-if="selectedPoint.status" class="mb-2"><span class="font-bold">Статус: </span>{{ selectedPoint.status }}</p>
          <p v-if="typeof selectedPoint.rko !== 'undefined'" class="mb-2"><span class="font-bold">РКО: </span>{{ selectedPoint.rko ? 'Да' : 'Нет' }}</p>
          <p v-if="selectedPoint.officeType" class="mb-2"><span class="font-bold">Тип офиса: </span>{{ selectedPoint.officeType }}</p>
          <p v-if="selectedPoint.salePointFormat" class="mb-2"><span class="font-bold">Формат отделения: </span>{{ selectedPoint.salePointFormat }}</p>
          <p v-if="typeof selectedPoint.suoAvailability !== 'undefined'" class="mb-2"><span class="font-bold">Наличие СУО: </span>{{ selectedPoint.suoAvailability ? 'Да' : 'Нет' }}</p>
          <p v-if="typeof selectedPoint.hasRamp !== 'undefined'" class="mb-2"><span class="font-bold">Наличие рампы: </span>{{ selectedPoint.hasRamp ? 'Да' : 'Нет' }}</p>
          <p v-if="selectedPoint.metroStation" class="mb-2"><span class="font-bold">Станция метро: </span>{{ selectedPoint.metroStation }}</p>
          <p v-if="typeof selectedPoint.kep !== 'undefined'" class="mb-2"><span class="font-bold">КЕП: </span>{{ selectedPoint.kep ? 'Да' : 'Нет' }}</p>
          <div v-if="selectedPoint.openHours" class="mb-2">
            <span class="font-bold">Часы работы: </span>
            <div v-for="hour in selectedPoint.openHours" :key="hour.id" class="mb-1">
              {{ hour.days }}: {{ hour.hours }}
            </div>
          </div>
          <div v-if="selectedPoint.openHoursIndividual" class="mb-2">
            <span class="font-bold">Часы работы для физических лиц: </span>
            <div v-for="hour in selectedPoint.openHoursIndividual" :key="hour.id" class="mb-1">
              {{ hour.days }}: {{ hour.hours }}
            </div>
          </div>

          <!-- Details for ATM -->
          <p v-if="typeof selectedPoint.allDay !== 'undefined'" class="mb-2"><span class="font-bold">Круглосуточно: </span>{{ selectedPoint.allDay ? 'Да' : 'Нет' }}</p>
          <div v-if="selectedPoint.serviceCapability" class="mb-2">
            <span class="font-bold">Возможность оказания услуги: </span>
            <p>Поддержка RUB: {{ translateSupport(selectedPoint.serviceCapability.supportsRub) }}</p>
            <p>Поддержка EUR: {{ translateSupport(selectedPoint.serviceCapability.supportsEur) }}</p>
            <p>Поддержка USD: {{ translateSupport(selectedPoint.serviceCapability.supportsUsd) }}</p>
            <p>Поддержка внесения RUB: {{ translateSupport(selectedPoint.serviceCapability.supportsChargeRub) }}</p>
            <p>Адаптация для слепых: {{ translateSupport(selectedPoint.serviceCapability.blind) }}</p>
            <p>Бесконтактный модуль: {{ translateSupport(selectedPoint.serviceCapability.nfcForBankCards) }}</p>
            <p>Сканер QR: {{ translateSupport(selectedPoint.serviceCapability.qrRead) }}</p>
            <p>Адаптация для людей с ОВЗ: {{ translateSupport(selectedPoint.serviceCapability.wheelchair) }}</p>
          </div>
          <div v-if="selectedPoint.serviceActivity" class="mb-2">
            <span class="font-bold">Доступность услуги на данный момент: </span>
            <p>Поддержка RUB: {{ translateAvailability(selectedPoint.serviceActivity.supportsRub) }}</p>
            <p>Поддержка EUR: {{ translateAvailability(selectedPoint.serviceActivity.supportsEur) }}</p>
            <p>Поддержка USD: {{ translateAvailability(selectedPoint.serviceActivity.supportsUsd) }}</p>
            <p>Поддержка внесения RUB: {{ translateAvailability(selectedPoint.serviceActivity.supportsChargeRub) }}</p>
            <p>Адаптация для слепых: {{ translateAvailability(selectedPoint.serviceActivity.blind) }}</p>
            <p>Бесконтактный модуль: {{ translateAvailability(selectedPoint.serviceActivity.nfcForBankCards) }}</p>
            <p>Сканер QR: {{ translateAvailability(selectedPoint.serviceActivity.qrRead) }}</p>
            <p>Адаптация для людей с ОВЗ: {{ translateAvailability(selectedPoint.serviceActivity.wheelchair) }}</p>
          </div>

          <button
              @click="openYandexMapsRoute(selectedPoint)"
              class="bg-blue-500 text-white px-4 py-2 rounded-full mb-2"
          >
            Проложить маршрут ({{ getRouteDistance(selectedPoint) }} км)
          </button>
        </div>

        <div v-else>
          <!-- Offices -->
          <div v-if="activeView === 'all' || activeView === 'offices'" v-for="point in filteredPoints" :key="point.id"
               @click="selectPoint(point)" class="hover:cursor-pointer hover:bg-gray-100 mb-4 p-2">
            <h5 class="text-md font-bold mb-2">{{ point.salePointName }}</h5>
            <p class="mb-1">{{ point.address }}</p>
            <p class="mb-4">Тип офиса: {{ point.officeType }}</p>
            <button
                @click="openYandexMapsRoute(point)"
                class="bg-blue-500 text-white px-4 py-2 rounded mb-2"
            >
              Проложить маршрут ({{ getRouteDistance(point) }} км)
            </button>
          </div>

          <!-- ATMs -->
          <div v-if="activeView === 'all' || activeView === 'atms'" v-for="atm in filteredAtms" :key="atm.id"
               @click="selectPoint(atm)" class="hover:cursor-pointer hover:bg-gray-100">
            <h5 class="text-md font-bold mb-2">{{ atm.address }}</h5>
            <p class="mb-1">Круглосуточно: {{ atm.allDay ? 'Да' : 'Нет' }}</p>
            <button
                @click.stop="openYandexMapsRoute(atm)"
                class="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Проложить маршрут ({{ getRouteDistance(atm) }} км)
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <YandexMap
      :coordinates="myCoordinates"
      :zoom="zoom"
  >
    <YandexClusterer :options="{ preset: 'islands#nightClusterIcons' }">
      <YandexMarker :coordinates="myCoordinates" :marker-id="12345">
        <template #component class="w-50 h-50">
          <CustomBalloon v-model="name" class="w-50 h-50"/>
        </template>
      </YandexMarker>
      <div v-for="point in points" :key="point.id" @click="flyTo(point)"
           v-if="activeView === 'all' || activeView === 'offices'">
        <YandexMarker :coordinates="[point.latitude, point.longitude]" :marker-id="point.address"
                      :options="{ preset: 'islands#greenIcon'}">
          <template #component class="w-50 h-50">
            <CustomBalloon v-model="name" class="w-50 h-50"/>
          </template>
        </YandexMarker>
      </div>
      <div v-for="atm in atms" :key="atm.address" @click="flyTo(atm)"
           v-if="activeView === 'all' || activeView === 'atms'">
        <YandexMarker :coordinates="[atm.latitude, atm.longitude]" :marker-id="atm.address"
                      :options="{ preset: 'islands#redIcon'}">
          <template #component class="w-50 h-50">
            <CustomBalloon v-model="name" class="w-50 h-50"/>
          </template>
        </YandexMarker>
      </div>
    </YandexClusterer>

  </YandexMap>
</template>

<script>
import {ref} from 'vue';
import {yandexMap, yandexMarker, yandexClusterer} from 'vue-yandex-maps';
import CustomBalloon from '../../components/CustomBalloon.vue';
import officesData from '../../data/offices.json';
import atmData from '../../data/atms.json';
import axios from 'axios';

function toRad(value) {
  return value * Math.PI / 180;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // радиус Земли в километрах
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

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
      myCoordinates: [55.747072, 37.536403],
      zoom: 14,
      points: null,
      atms: null,
      selectedType: 'all',
      activeView: 'all',  // Initially show all
      name: 'Custom', // Добавим новое свойство name
      selectedPoint: null,  // Добавлено новое свойство
      selectedTypes: [],
      searchQuery: '',
      routeDistance: null,  // Добавьте это свойство для хранения расстояния
    };
  },
  mounted() {
    this.fetchOffices();
    this.fetchATM();
    // this.fetchUserLocation();
  },
  methods: {
    translateSupport(value) {
      switch (value) {
        case 'SUPPORTED': return 'Поддерживается';
        case 'UNSUPPORTED': return 'Не поддерживается';
        default: return 'Неизвестно';
      }
    },
    translateAvailability(value) {
      switch (value) {
        case 'AVAILABLE': return 'Доступно';
        case 'UNAVAILABLE': return 'Недоступно';
        default: return 'Неизвестно';
      }
    },
    getRouteDistance(point) {
      const { latitude, longitude } = point;
      const myLat = Reflect.get(this.myCoordinates, 0);
      const myLong = Reflect.get(this.myCoordinates, 1);
      const distance = calculateDistance(latitude, longitude, myLat, myLong);
      return parseFloat(distance.toFixed(1));
    },
    openYandexMapsRoute(point) {
      event.stopPropagation();
      const { latitude, longitude } = point;
      const myLat = Reflect.get(this.myCoordinates, 0);
      const myLong = Reflect.get(this.myCoordinates, 1);

      const yandexMapsUrl = `https://yandex.ru/maps/?ll=${myLong}%2C${myLat}&mode=routes&rtext=${myLat}%2C${myLong}~${latitude}%2C${longitude}&rtt=auto&ruri=~&z=6.79`;
      window.open(yandexMapsUrl, '_blank');
    },
    setActiveView(view) {
      this.activeView = view;
      this.$emit('update:modelValue', view);
    },
    fetchOffices() {
      axios.get('http://77.91.86.52:3000/sale-point')
          .then(response => {
            this.points = response.data;
          })
          .catch(error => {
            console.error('Ошибка при получении данных офисов:', error);
          });
    },
    fetchATM() {
      axios.get('http://77.91.86.52:3000/atms')
          .then(response => {
            this.atms = response.data;
          })
          .catch(error => {
            console.error('Ошибка при получении данных банкоматов:', error);
          });
    },
    async calculateRouteDistance(point) {
      const zeroKmCoords = [55.755826, 37.6173];  // Координаты нулевого километра в Москве
      const pointCoords = [point.latitude, point.longitude];
      try {
        const response = await axios.get(`https://api.routing.yandex.net/v1.0/distances?waypoints=${zeroKmCoords.join()},${pointCoords.join()}&mode=car&apikey=ВАШ_АПИ_КЛЮЧ`);
        const distance = response.data.features[0].properties.distances.distance;
        this.routeDistance = (distance / 1000).toFixed(2);  // Конвертируем метры в километры и округляем до 2 знаков после запятой
      } catch (error) {
        console.error('Ошибка при расчете расстояния:', error);
      }
    },
    selectPoint(point) {
      this.selectedPoint = point;
      this.calculateRouteDistance(point);  // Вызовите этот метод при выборе точки
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
      return this.points.sort((a, b) => {
            return this.getRouteDistance(a) - this.getRouteDistance(b);
      });
    },
    filteredAtms() {
      if (!this.atms) return [];
      return this.atms.sort((a, b) => {
        return this.getRouteDistance(a) - this.getRouteDistance(b);
      });
    }
  },
  routeDistance() {
    return this.filteredPoints.map(point => this.getRouteDistance(point));
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
  border-radius: 7px;
}

.yandex-balloon {
  height: 400px;
  width: 400px;
  overflow-y: auto; /* Allow vertical scrolling if content exceeds */

}

.custom-balloon-content {
  width: 400px; /* Adjust width as per requirement */
  height: 400px; /* Adjust height as per requirement */
  overflow-y: auto; /* Allow vertical scrolling if content exceeds */
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

.detail-view p {
  margin-bottom: 8px; /* Расстояние между пунктами */
}
</style>
