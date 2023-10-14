<template>
  <div class="map-container">
    <div class="sidebar">
      <div v-for="point in points" :key="point.id" @click="flyTo(point)">
        <h3>{{ point.title }}</h3>
        <p>{{ point.address }}</p>
        <p>Рейтинг: {{ point.rating }}</p>
      </div>
    </div>

  </div>
  <YandexMap
      :coordinates="coordinates"
      :zoom="zoom"
  >
    <YandexMarker :coordinates="coordinates" :marker-id="123" />
  </YandexMap>
</template>

<script>
import { ref } from 'vue';
import { yandexMap, yandexMarker, yandexClusterer } from 'vue-yandex-maps';

export default {
  name: "offices",

  components: {
    YandexMap: yandexMap,
    YandexMarker: yandexMarker,
    YandexClusterer: yandexClusterer
  },
  data() {
    return {
      coordinates: null,
      zoom: 15,
      points: [
        {
          title: "1",
          address: "Пулковская улица 8к3",
          rating: 5
        }
      ]
    };
  },
  mounted() {
    this.fetchUserLocation();
  },
  methods: {
    getCoordinates() {
      return [55 + Math.random(), 33 + Math.random()];
    },
    fetchUserLocation() {
      this.getUserLocation(
          (latitude, longitude) => {
            this.coordinates = [latitude, longitude];
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
</style>
