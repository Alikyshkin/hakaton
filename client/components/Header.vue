<template>
  <nav>
    <div class="container flex flex-wrap items-center justify-between mx-auto pb-4 pt-4">
      <div class="flex items-center">
        <nuxt-link to="/" class="flex items-center">
          <img src="../public/Logo/VTB_logo_ru.png" class="h-12 mr-3" alt="VTB Logo" />
        </nuxt-link>
        <div class="ml-4">
          <CitySelector></CitySelector>
        </div>
      </div>
      <button @click="toggleMenu" type="button" class="burger-toggle inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" :aria-expanded="isMenuOpen ? 'true' : 'false'">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
      </button>
      <div v-bind:class="{ hidden: !isMenuOpen, 'block md:flex': isMenuOpen }" class="w-full md:block md:w-auto" id="navbar-default">
        <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white mobile-menu">
          <li>
            <a href="https://online.vtb.ru/" target="_blank" class="block py-2 pl-3 pr-4 rounded md:bg-transparent text-gray-900 md:p-0" aria-current="page">ВТБ ОНЛАЙН</a>
          </li>
          <li>
            <nuxt-link to="/offices" class="block py-2 pl-3 pr-4 text-gray-900 md:p-0">Карта</nuxt-link>
          </li>
          <li v-if="!isAuthenticated">
            <nuxt-link to="/authorization" class="block py-2 pl-3 pr-4 text-gray-900 md:p-0">Войти</nuxt-link>
          </li>
          <li v-if="!isAuthenticated">
            <nuxt-link to="/registration" class="block py-2 pl-3 pr-4 text-gray-900 md:p-0">Зарегистрироваться</nuxt-link>
          </li>
          <li v-if="isAuthenticated">
            <a href="#" @click="logout" class="block py-2 pl-3 pr-4 text-gray-900 md:p-0">Выйти</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import CitySelector from "./CitySelector"

export default {
  name: "Header",
  data() {
    return {
      isMenuOpen: false,
      isAuthenticated: process.client ? this.checkAuthStatus() : false,
      isDarkMode: false
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    checkAuthStatus() {
      if (process.client) {
        return localStorage.getItem('auth') === 'true';
      }
      return false;
    },
    logout() {
      if (process.client) {
        localStorage.setItem('auth', 'false');
      }
      this.isAuthenticated = false;
    },
  },
}
</script>

<style scoped>

.mobile-menu {
  z-index: 2;
}
</style>
