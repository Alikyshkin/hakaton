import { defineNuxtPlugin } from 'nuxt/app'
import YmapPlugin from 'vue-yandex-maps'


const settings = {
    apiKey: '84065b55-5fa3-430c-a4ed-69fb73051b7b', // Индивидуальный ключ API
    lang: 'ru_RU', // Используемый язык
    coordorder: 'latlong', // Порядок задания географических координат
    debug: false, // Режим отладки
    version: '2.1' // Версия Я.Карт
}
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(YmapPlugin, settings)
});
