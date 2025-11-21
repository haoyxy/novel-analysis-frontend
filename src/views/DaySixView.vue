<script setup>
import { ref } from 'vue'

const message = ref('Welcome to Day Six!')
</script>

<template>
  <div class="day-six-view">
    <h1>{{ message }}</h1>
    <p>This is the content for Day Six.</p>
  </div>
</template>

<style scoped>
.day-six-view {
  padding: 20px;
}
</style>