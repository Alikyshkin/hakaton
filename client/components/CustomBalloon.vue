<template>
  <div>
    {{ modelValue }} component with props and emits
    <button @click="updateValue">Click!</button>
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

<style scoped>

</style>