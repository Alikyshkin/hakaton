<!-- Sidebar.vue -->
<template>
  <div class="bg-white h-1/2 w-1/4 p-4 overflow-x-hidden overflow-y-auto ">
    <div v-for="office in offices" :key="office.salePointName" @click="flyTo(office)">
      <h3 class="text-xl font-bold mb-2">{{ office.salePointName }}</h3>
      <p class="mb-1">{{ office.address }}</p>
      <p class="mb-4">Тип офиса: {{ office.officeType }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    offices: Array,
    flyTo: Function
  }
};
</script>

<style scoped>
/* Here, you can add more styles if needed */
</style>
