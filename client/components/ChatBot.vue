<template>
  <div class="fixed bottom-4 right-4">
    <button @click="toggleChat" class="bg-blue-500 text-white p-4 rounded-full shadow-lg focus:outline-none">
      <i class="fas fa-comment"></i>
    </button>
    <div v-if="isOpen" class="mt-4 p-4 bg-white rounded-lg shadow-lg w-64">
      <div v-for="message in messages" :key="message.id" class="mb-2">
        <div v-if="message.type === 'user'" class="text-right text-blue-500">
          {{ message.text }}
        </div>
        <div v-else class="text-left text-gray-700">
          {{ message.text }}
        </div>
      </div>
      <div v-for="suggestion in suggestions" :key="suggestion">
        <button @click="askQuestion(suggestion)" class="bg-gray-200 text-gray-700 rounded px-4 py-2 mb-2 mr-2">
          {{ suggestion }}
        </button>
      </div>
      <input v-model="userInput" @keyup.enter="askQuestion" class="mt-2 p-2 w-full rounded border" placeholder="Задайте ваш вопрос...">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
      userInput: '',
      messages: [],
      suggestions: ['Вопрос 1', 'Вопрос 2', 'Вопрос 3'],
      faqs: {
        'Вопрос 1': 'Ответ на вопрос 1',
        'Вопрос 2': 'Ответ на вопрос 2',
        'Вопрос 3': 'Ответ на вопрос 3',
      }
    };
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen;
    },
    askQuestion(question = null) {
      const query = question || this.userInput;
      this.messages.push({ id: Date.now(), type: 'user', text: query });
      const answer = this.faqs[query] || 'Извините, я не могу ответить на этот вопрос.';
      this.messages.push({ id: Date.now() + 1, type: 'bot', text: answer });
      this.userInput = '';
    }
  }
};
</script>

<style scoped>
/* Здесь можно добавить дополнительные стили, если это необходимо */
</style>
