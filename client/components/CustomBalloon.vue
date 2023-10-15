<template>
  <div class="w-50 h-50">
    <button @click="updateValue">Вы здесь!</button>
  </div>
</template>

<script>

export default {
  name: "CustomBalloon",
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  methods: {
    updateValue() {
      this.$emit('update:modelValue', 'Awesome');
    }
  }
}
</script>

<style>
.custom-balloon-content {
  width: 400px;
  height: 400px;
  overflow-y: auto;
}
</style>
