<template>
  <div class="bg-white h-1/2 w-1/4 p-4 overflow-x-hidden overflow-y-auto sidebar-map ">
    <!-- Buttons to toggle view -->
    <div class="mb-4">
      <button @click="activeView = 'all'" class="mr-2 px-4 py-2 border rounded">Все</button>
      <button @click="activeView = 'offices'" class="mr-2 px-4 py-2 border rounded">Офисы</button>
      <button @click="activeView = 'atms'" class="px-4 py-2 border rounded">Банкоматы</button>
    </div>

    <!-- Offices -->
    <div v-if="activeView === 'all' || activeView === 'offices'" v-for="office in offices" :key="office.salePointName" @click="flyTo(office)" class="hover:cursor-pointer hover:bg-gray-100">
      <h3 class="text-xl font-bold mb-2">{{ office.salePointName }}</h3>
      <p class="mb-1">{{ office.address }}</p>
      <p class="mb-4">Тип офиса: {{ office.officeType }}</p>
    </div>

    <!-- ATMs -->
    <div v-if="activeView === 'all' || activeView === 'atms'" v-for="atm in bankomats" :key="atm.address" @click="flyTo(atm)" class="hover:cursor-pointer hover:bg-gray-100">
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
</template>

<script>
export default {
  props: {
    offices: Array,
    bankomats: Array,
    flyTo: Function
  },
  data() {
    return {
      activeView: 'all'  // Initially show all
    };
  }
};
</script>

<style scoped>
.sidebar-map {
  position: absolute;
  top: 90px;
  left: 15px;
  height: 80vh;
  z-index: 1;
}
</style>
