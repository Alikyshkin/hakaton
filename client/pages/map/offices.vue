<template>
  <div class="map-container">
    <div class="sidebar">
      <div v-for="point in points" :key="point.id" @click="flyTo(point)">
        <h3>{{ point.title }}</h3>
        <p>{{ point.address }}</p>
        <p>Рейтинг: {{ point.rating }}</p>
      </div>
    </div>
    <div id="map" class="yandex-map"></div>
  </div>
</template>

<script>
export default {
  name: "offices",
  data() {
    return {
      map: null,
      points: [
        { id: 1, title: "Пункт 1", address: "Пулковская улица 8к3", rating: Math.random() * 5, lat: 59.938951, lng: 30.315635 },
        // ...добавьте другие пункты аналогичным образом
      ],
    };
  },
  mounted() {
    // Ensure the Yandex Maps API script is loaded
    if (!window.ymaps) {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=84065b55-5fa3-430c-a4ed-69fb73051b7b&lang=ru_RU';
      script.async = true;
      script.onload = this.initMap;
      document.head.appendChild(script);
    } else {
      this.initMap();
    }
  },
  methods: {
    initMap() {
      window.ymaps.ready(() => {
        this.map = new window.ymaps.Map('map', {
          center: [59.938951, 30.315635],
          zoom: 10,
        });

        this.points.forEach(point => {
          const marker = new window.ymaps.Placemark([point.lat, point.lng], {
            hintContent: point.title,
            balloonContent: point.address,
          });
          this.map.geoObjects.add(marker);
        });
      });
    },
    flyTo(point) {
      this.map.setCenter([point.lat, point.lng], 15, { duration: 500 });
    },
  },
};
</script>

<style scoped>
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
  margin-left: 15px;
  margin-bottom: 15px;
}

.yandex-map {
  width: 100%;
  height: 100vh;
}
</style>
