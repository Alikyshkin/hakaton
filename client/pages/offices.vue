<template>
  <div class="flex position-relative">
    <div class="position-absolute">
      <div class="bg-white fixed w-full md:absolute md:w-1/4 p-4 overflow-x-hidden overflow-y-auto sidebar-map ">
        <!-- Иконка крестика -->
        <div v-if="selectedPoint" class="absolute top-2 right-2 cursor-pointer" @click="resetSelectedPoint">
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
            <button  v-if="searchQuery" @click="resetSearch" class="px-4 py-2 border rounded-full mt-2 w-full">
              Сбросить поиск
            </button>
          </div>
        </div>

        <!-- Детальный просмотр -->
        <div v-if="selectedPoint" class="detail-view">
          <h2 class="font-bold mb-2 mt-4 mr-2">{{ selectedPoint.salePointName || selectedPoint.address }}</h2>
          <button
              @click="openYandexMapsRoute(selectedPoint)"
              class="bg-blue-500 text-white px-2 py-2 rounded-full mb-2 w-full"
          >
            Проложить маршрут ({{ getRouteDistance(selectedPoint) }} км)
          </button>
          <button @click="openModal" class="bg-gray-200 text-blue-600 px-2 py-2 rounded-full mb-2 w-full hover:bg-gray-300">
            Запись онлайн
          </button>

          <!-- Details for office -->
          <p v-if="selectedPoint.status" class="mb-2"><span class="font-bold">Статус: </span>{{ selectedPoint.status }}
          </p>
          <p v-if="typeof selectedPoint.rko !== 'undefined'" class="mb-2"><span
              class="font-bold">РКО: </span>{{ selectedPoint.rko ? 'Да' : 'Нет' }}</p>
          <p v-if="selectedPoint.officeType" class="mb-2"><span
              class="font-bold">Тип офиса: </span>{{ selectedPoint.officeType }}</p>
          <p v-if="selectedPoint.salePointFormat" class="mb-2"><span
              class="font-bold">Формат отделения: </span>{{ selectedPoint.salePointFormat }}</p>
          <p v-if="typeof selectedPoint.suoAvailability !== 'undefined'" class="mb-2"><span class="font-bold">Наличие СУО: </span>{{
              selectedPoint.suoAvailability ? 'Да' : 'Нет'
            }}</p>
          <p v-if="typeof selectedPoint.hasRamp !== 'undefined'" class="mb-2"><span
              class="font-bold">Наличие рампы: </span>{{ selectedPoint.hasRamp ? 'Да' : 'Нет' }}</p>
          <p v-if="selectedPoint.metroStation" class="mb-2"><span
              class="font-bold">Станция метро: <br></span>{{ selectedPoint.metroStation }}</p>
          <p v-if="typeof selectedPoint.kep !== 'undefined'" class="mb-2"><span
              class="font-bold">КЕП: </span>{{ selectedPoint.kep ? 'Да' : 'Нет' }}</p>
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
          <!-- Модальное окно -->
          <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <!-- Задний фон -->
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <!-- Модальное окно -->
              <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div v-if="isSuccess" class="w-full text-center mt-10">
                  <h2 class="text-xl font-bold mb-5">Спасибо!</h2>
                  <p>Ваша заявка успешно отправлена.</p>
                </div>

                <div v-else class="sm:flex sm:items-start">
                  <div class="w-full">
                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Запись онлайн</h3>
                    <div class="mt-2">
                      <div class="flex items-center mb-2">
                        <label for="name" class="mr-2 w-1/3 text-right">Ваше имя:</label>
                        <input id="name" type="text" v-model="name" placeholder="Введите имя" class="w-2/3 p-2 border rounded">
                      </div>
                      <div class="flex items-center mb-2">
                        <label for="email" class="mr-2 w-1/3 text-right">Адрес почты:</label>
                        <input id="email" type="email" v-model="email" placeholder="Введите адрес" class="w-2/3 p-2 border rounded">
                      </div>
                      <div class="flex items-center">
                        <label for="service" class="mr-2 w-1/3 text-right">Услуга:</label>
                        <select id="service" v-model="selectedService" class="w-2/3 p-2 border rounded">
                          <option value="service1">Потребительские кредиты</option>
                          <option value="service2">Ипотека</option>
                          <option value="service3">Дебетовые и кредитные карты</option>
                          <option value="service4">Вклады</option>
                          <option value="service5">Инвестиции</option>
                          <option value="service6">Платежи и переводы</option>
                          <option value="service7">Страхование</option>
                          <option value="service8">Мобильное приложение и интернет-банк</option>
                          <option value="service9">РКО</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button @click="submitForm" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                    Записаться
                  </button>
                  <button @click="closeModal" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Details for ATM -->
          <p v-if="typeof selectedPoint.allDay !== 'undefined'" class="mb-2"><span
              class="font-bold">Круглосуточно: </span>{{ selectedPoint.allDay ? 'Да' : 'Нет' }}</p>
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
        </div>

        <div v-else>
          <!-- Offices -->
          <div v-if="activeView === 'all' || activeView === 'offices'" v-for="point in filteredPoints" :key="point.id"
               @click="selectPoint(point)"
               class="cursor-pointer transition duration-300 hover:bg-gray-100 p-2 border-b border-gray-300 pt-4 pb-4 items-center">
            <div class="flex items-center">
              <!-- Обновленная строка ниже -->
              <div :class="[circleColorClass(point), 'w-4 h-4 rounded-full mr-2 border-b border-gray-300']"></div>
              <p class="mb-1">{{ point.address }}</p>
            </div>
            <button
                @click="openYandexMapsRoute(point)"
                class="bg-blue-500 text-white px-1 py-2 rounded-full w-full hover:bg-blue-600"
            >
              Проложить маршрут ({{ getRouteDistance(point) }} км)
            </button>
          </div>

          <!-- ATMs -->
          <div v-if="activeView === 'all' || activeView === 'atms'" v-for="atm in filteredAtms" :key="atm.id"
               @click="selectPoint(atm)"
               class="transition duration-300 hover:bg-gray-100 p-2 border-b border-gray-300 pt-4 pb-4 items-center">
            <div class="flex items-center">
              <div class="bg-green-500 w-4 h-4 rounded-full mr-2 border-b border-gray-300"></div>
              <p class="mb-1">{{ atm.address }}</p>
            </div>
            <button
                @click.stop="openYandexMapsRoute(atm)"
                class="bg-blue-500 text-white px-2 py-2 rounded-full w-full hover:bg-blue-600"
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
      <YandexMarker
          :coordinates="myCoordinates"
          :marker-id="12345"
          :options="{ preset: 'islands#darkGreenDotIcon'}"
      >
        <template #component class="w-50 h-50">
          <CustomBalloon v-model="name" class="w-50 h-50"/>
        </template>
      </YandexMarker>
      <div v-for="point in points" :key="point.id" @click="flyTo(point)"
           v-if="activeView === 'all' || activeView === 'offices'">
        <YandexMarker :coordinates="[point.latitude, point.longitude]" :marker-id="point.address"
                      :options="{ preset: 'islands#nightLeisureIcon'}">
          <template #component class="w-50 h-50">
            <CustomBalloon v-model="name" class="w-50 h-50"/>
          </template>
        </YandexMarker>
      </div>
      <YandexMarker v-if="activeView === 'offices-one' && CurrentChoice.salePointName"
                    :coordinates="[CurrentChoice.latitude, CurrentChoice.longitude]" :marker-id="CurrentChoice.address"
                    :options="{ preset: 'islands#nightLeisureIcon'}">
        <template #component class="w-50 h-50">
          <CustomBalloon v-model="name" class="w-50 h-50"/>
        </template>
      </YandexMarker>

      <div v-for="atm in atms" :key="atm.address" @click="flyTo(atm)"
           v-if="activeView === 'all' || activeView === 'atms'">
        <YandexMarker :coordinates="[atm.latitude, atm.longitude]" :marker-id="atm.address"
                      :options="{ preset: 'islands#blueMoneyIcon'}">
          <template #component class="w-50 h-50">
            <CustomBalloon v-model="name" class="w-50 h-50"/>
          </template>
        </YandexMarker>
      </div>
      <YandexMarker v-if="activeView === 'atms-one' && !CurrentChoice.salePointName"
                    :coordinates="[CurrentChoice.latitude, CurrentChoice.longitude]" :marker-id="CurrentChoice.address"
                    :options="{ preset: 'islands#blueMoneyIcon'}">
        <template #component class="w-50 h-50">
          <CustomBalloon v-model="name" class="w-50 h-50"/>
        </template>
      </YandexMarker>

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
      myCoordinates: [55.771875, 37.626667],
      zoom: 15,
      points: null,
      atms: null,
      isSuccess: false,
      selectedType: 'all',
      activeView: 'all',
      selectedPoint: null,
      selectedTypes: [],
      searchQuery: '',
      routeDistance: null,
      CurrentChoice: null,
      PreviousView: null,
      showModal: false,

    };
  },
  async mounted() {
    await Promise.all([this.fetchOffices(), this.fetchATM()]);
    // this.fetchOffices();
    // this.fetchATM();
    // this.fetchUserLocation();
  },
  methods: {
    async performSearch() {
      if (!this.searchQuery) return;  // проверка на пустой запрос

      try {
        const response = await axios.get(`http://77.91.86.52:3000/search?pattern=${this.searchQuery}`);
        this.points = response.data.salePoints;  // обновление данных на странице
        this.atms = response.data.atms;  // обновление данных на странице
      } catch (error) {
        console.error('Ошибка при поиске:', error);
      }
    },
    async resetSearch() {
      this.searchQuery = '';
      try {
        const response = await axios.get('http://77.91.86.52:3000/sale-point');
        this.points = response.data;
      } catch (error) {
        console.error('Ошибка при сбросе поиска:', error);
      }
    },
    openModal() {
      const isAuth = localStorage.getItem('auth') === 'true';
      if (isAuth) {
        this.showModal = true;
      } else {
        alert('Пожалуйста, войдите, чтобы продолжить');
      }
    },
    closeModal() {
      this.showModal = false;
      this.isSuccess = false;
    },
    submitForm() {
      const ticketNumber = Math.floor(Math.random() * (30000 - 3000 + 1)) + 3000;
      // Проверьте и обработайте ваши данные здесь, например:
      const formData = {
        ticketNumber: ticketNumber,
        ticketOwnerName: this.name,
        ticketOwnerEmail: this.email,
        salePointId: this.selectedPoint.id // предполагаемое имя модели для выпадающего списка
      };

      axios.post("http://77.91.86.52:3000/ticket", formData)
          .then(response => {
            this.isSuccess = true; // Устанавливаем isSuccess в true после успешного выполнения
          })
          .catch(error => {
            console.error('Ошибка при получении данных офисов:', error);
          });
    },
    translateSupport(value) {
      switch (value) {
        case 'SUPPORTED':
          return 'Поддерживается';
        case 'UNSUPPORTED':
          return 'Не поддерживается';
        default:
          return 'Неизвестно';
      }
    },
    translateAvailability(value) {
      switch (value) {
        case 'AVAILABLE':
          return 'Доступно';
        case 'UNAVAILABLE':
          return 'Недоступно';
        default:
          return 'Неизвестно';
      }
    },
    resetSelectedPoint() {
      this.selectedPoint = null;
      this.CurrentChoice = null;
      this.setActiveView(this.PreviousView);
      // this.setActiveView('all');
    },
    getRouteDistance(point) {
      const {latitude, longitude} = point;
      const myLat = Reflect.get(this.myCoordinates, 0);
      const myLong = Reflect.get(this.myCoordinates, 1);
      const distance = calculateDistance(latitude, longitude, myLat, myLong);
      return parseFloat(distance.toFixed(1));
    },
    openYandexMapsRoute(point) {
      event.stopPropagation();
      const {latitude, longitude} = point;
      const myLat = Reflect.get(this.myCoordinates, 0);
      const myLong = Reflect.get(this.myCoordinates, 1);

      const yandexMapsUrl = `https://yandex.ru/maps/?ll=${myLong}%2C${myLat}&mode=routes&rtext=${myLat}%2C${myLong}~${latitude}%2C${longitude}&rtt=auto&ruri=~&z=6.79`;
      window.open(yandexMapsUrl, '_blank');
    },
    setActiveView(view) {
      this.PreviousView = this.activeView;
      this.activeView = view;
      this.$emit('update:modelValue', view);
    },
    async fetchOffices() {
      try {
        const response = await axios.get('http://77.91.86.52:3000/sale-point');
        this.points = response.data;
      } catch (error) {
        console.error('Ошибка при получении данных офисов:', error);
      }
    },
    async fetchATM() {
      try {
        const response = await axios.get('http://77.91.86.52:3000/atms');
        this.atms = response.data;
      } catch (error) {
        console.error('Ошибка при получении данных банкоматов:', error);
      }
    },
    async calculateRouteDistance(point) {
      const zeroKmCoords = [55.755826, 37.6173];
      const pointCoords = [point.latitude, point.longitude];
      try {
        const response = await axios.get(`https://api.routing.yandex.net/v1.0/distances?waypoints=${zeroKmCoords.join()},${pointCoords.join()}&mode=car&apikey=ВАШ_АПИ_КЛЮЧ`);
        const distance = response.data.features[0].properties.distances.distance;
        this.routeDistance = (distance / 1000).toFixed(2);
      } catch (error) {
        console.error('Ошибка при расчете расстояния:', error);
      }
    },
    selectPoint(point) {
      this.selectedPoint = point;
      this.CurrentChoice = point;
      if (point.salePointName) {
        this.setActiveView('offices-one');
      } else {
        this.setActiveView('atms-one');
      }
      this.calculateRouteDistance(point);
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
    },
    circleColorClass(point) {
      const ticketCount = point.ticket && Array.isArray(point.ticket) ? point.ticket.length : 0;
      if (ticketCount <= 5) {
        return 'bg-green-500';
      } else if (ticketCount <= 10) {
        return 'bg-yellow-500';
      } else {
        return 'bg-red-500';
      }
    },
    ticketCount(point) {
      if (point && point.ticket) {
        return point.ticket.length;
      }
      return 0;
    },
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
    },
    routeDistance() {
      return this.filteredPoints.map(point => this.getRouteDistance(point));
    }
  },
};
</script>

<style scoped>
.yandex-container {
  height: 800px;
}

.sidebar-map {
  position: absolute;
  height: 80vh;
  z-index: 1;
  border-radius: 7px;
}

.yandex-balloon {
  height: 400px;
  width: 400px;
  overflow-y: auto;
}

.custom-balloon-content {
  width: 400px;
  height: 400px;
  overflow-y: auto;
}

.ymaps-2-1-79-balloon__layout {
  min-width: 100px;
  height: 140%;
  min-height: 50px;
}

.detail-view p {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .sidebar-map {
    height: 40%;
    position: absolute;
    bottom: 0;
  }
}
</style>
