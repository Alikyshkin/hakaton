<template>
  <div :class="{'collapsed': !chatOpen, 'main-card': true, 'bg-white': true, 'shadow-md': true, 'rounded-lg': true, 'absolute': true }">
    <div v-if="chatOpen" class="main-title bg-blue-600 text-white p-4 font-bold flex items-center">
      <span>Chatbot</span>
    </div>
    <div v-if="chatOpen" class="chat-area overflow-y-auto px-4 py-6 flex flex-col gap-3">
      <!-- Add your chat messages here -->
    </div>
    <div v-if="chatOpen" class="input-div flex items-center gap-3 p-4 chatbot-textfield">
      <input class="input-message flex-grow px-4 py-2 border rounded focus:outline-none" name="message" type="text" placeholder="Type your message ..." />
      <button class="input-send focus:outline-none" @click="send">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6 text-blue-600"><path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"></path></svg>
      </button>
    </div>
    <button @click="toggleChat"
            class="chatbot-toggle p-3.5 bg-blue-600 rounded-full absolute right-0 top-0 focus:outline-none hover:bg-blue-700"
            :class="{ pulse: !chatOpen }">
      <svg v-if="!chatOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6 text-white"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15 4v7H5.17l-.59.59-.58.58V4h11m1-2H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm5 4h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1z"/></svg>
      <svg v-if="chatOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6 text-white"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
    </button>

  </div>
</template>

<script>
export default {
  data() {
    return {
      collapsed: true,
      message: '',
      chatOpen: false

    };
  },
  methods: {
    toggleChat() {
      this.chatOpen = !this.chatOpen;
    },
    send(msg) {
      if (this.running || !msg) return;
      this.running = true;
      this.addMsg(msg);
      setTimeout(() => {
        this.addResponseMsg(msg);
      }, 500);
    },
    addMsg(msg) {
      const div = document.createElement("div");
      div.innerHTML = `<span class="flex-grow"></span><div class='chat-message-sent'>${msg}</div>`;
      div.className = "chat-message-div";
      this.$refs.messageBox.appendChild(div);
      this.message = "";
      this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight;
    },
    addResponseMsg(msg) {
      const response = this.getResponseForMsg(msg);
      const div = document.createElement("div");
      div.innerHTML = `<div class='chat-message-received'>${response}</div>`;
      div.className = "chat-message-div";
      this.$refs.messageBox.appendChild(div);
      this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight;
      this.running = false;
    },
    getResponseForMsg(msg) {
      // This is where you can add your custom logic to respond to messages.
      // For now, I'm returning a simple response:
      return `Response to: ${msg}`;
    }
  }
};
</script>

<style scoped>
.main-card {
  z-index: 1;
  position: fixed;
  bottom: 15px;
  left: 15px;
}

@media (min-width: 450px) {
  .main-card {
    width: 96%;
    max-width: 400px;
    height: calc(100% - 32px);
    max-height: 600px;
    margin: 16px;
  }
}
.collapsed {
  width: 48px;
  height: 48px;
  position: fixed;
  bottom: 15px;
  left: 15px;
  border-radius: 50%;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(30, 144, 255, 0.6); /* DodgerBlue color */
  }
  70% {
    box-shadow: 0 0 0 10px rgba(30, 144, 255, 0); /* DodgerBlue color */
  }
  100% {
    box-shadow: 0 0 0 0 rgba(30, 144, 255, 0); /* DodgerBlue color */
  }
}

.pulse {
  animation: pulse 2s infinite;
}

.chatbot-textfield {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
