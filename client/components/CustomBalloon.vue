<template>
  <div class="w-50 h-50">
<!--    {{ modelValue }}-->
    <button @click="updateValue">Сюда!</button>
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
  width: 400px;      /* Adjust width as per requirement */
  height: 400px;     /* Adjust height as per requirement */
  overflow-y: auto;  /* Allow vertical scrolling if content exceeds */
}
</style>