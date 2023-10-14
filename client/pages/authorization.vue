<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Авторизация
        </h2>
      </div>
      <form @submit.prevent="login" class="mt-8 space-y-6">
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Имя пользователя</label>
            <input v-model="username" id="username" name="username" type="text" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Имя пользователя" />
          </div>
          <div>
            <label for="password" class="sr-only">Пароль</label>
            <input v-model="password" id="password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Пароль" />
          </div>
        </div>
        <div>
          <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Войти
          </button>
        </div>
      </form>
      <div class="mt-4 text-center">
        <span class="text-gray-600">Нет аккаунта? </span>
        <nuxt-link to="/registration" class="text-blue-500 hover:underline">Зарегистрироваться</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      const users = JSON.parse(localStorage.getItem('users')) || {};
      if (users[this.username] && users[this.username] === this.password) {
        localStorage.setItem('auth', 'true');
        window.location.href = '/';
      } else {
        alert('Неправильное имя пользователя или пароль');
      }
    }
  }
}
</script>

<style scoped>
/* Ваши стили */
</style>
