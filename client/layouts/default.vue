<template>
  <div>
    <Header></Header>
    <slot />
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
export default {
  name: "default.vue",
  components: {Header, Footer},
}
</script>

<style scoped>

</style>
