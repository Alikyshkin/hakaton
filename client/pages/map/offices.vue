<template>
  <div class="map-container ">
    <div class="position-absolute ">
      <!--    <div class="sidebar">-->
      <!--      <div v-for="point in points" :key="point.id" @click="flyTo(point)">-->
      <!--        <h3>{{ point.title }}</h3>-->
      <!--        <p>{{ point.address }}</p>-->
      <!--        <p>Рейтинг: {{ point.rating }}</p>-->
      <!--      </div>-->
      <!--    </div>-->
      <Sidebar :offices="points" :bankomats="atm" :flyTo="flyTo" />
    </div>
  </div>
  <YandexMap
      :coordinates="[55.755573, 37.617296]"
      :zoom="zoom"
  >
    <YandexClusterer :options="{ preset: 'islands#nightClusterIcons' }">
    <YandexMarker :coordinates="myCoordinates" :marker-id="123"  />
    <div v-for="point in points" :key="point.id" @click="flyTo(point)">
      <YandexMarker :coordinates="[point.latitude, point.longitude]" :marker-id="point.id" :options="{  preset: 'islands#greenIcon'}" />
    </div>
    <div v-for="a in atm" :key="a.id" @click="flyTo(a)">
      <YandexMarker :coordinates="[a.latitude, a.longitude]" :marker-id="a.id" :options="{  preset: 'islands#redIcon'}" />
    </div>
    </YandexClusterer>

  </YandexMap>
</template>

<script>
import { ref } from 'vue';
import { yandexMap, yandexMarker, yandexClusterer } from 'vue-yandex-maps';
import Sidebar from '../../components/Sidebar.vue';  // Assuming Sidebar is in the same folder
import officesData from '../../data/offices.json';  // Adjust path accordingly
import atmData from '../../data/atms.json';  // Adjust path accordingly

export default {
  name: "offices",

  components: {
    YandexMap: yandexMap,
    YandexMarker: yandexMarker,
    YandexClusterer: yandexClusterer,
    Sidebar
  },
  data() {
    return {
      coordinates: null,
      myCoordinates: null,
      zoom: 10,
      points: null,
      atm: null
    };
  },
  mounted() {
    this.fetchOffices();
    this.fetchATM();
    this.fetchUserLocation();
  },
  methods: {
    fetchOffices() {
      this.points = officesData;
      console.log(this.points[0])
    },
    fetchATM() {
      this.atm = atmData.atms;
      console.log(this.atm[0])
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
