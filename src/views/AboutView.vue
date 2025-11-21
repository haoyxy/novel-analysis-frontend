<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const backendResponse = ref('')
const error = ref('')

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8081/')
    backendResponse.value = response.data
  } catch (err) {
    error.value = '无法连接到后端服务: ' + err.message
  }
})
</script>

<template>
  <div class="about">
    <h1>前后端连通性测试</h1>
    <div v-if="backendResponse" class="success">
      <h2>成功连接到后端!</h2>
      <p>后端返回消息: {{ backendResponse }}</p>
    </div>
    <div v-if="error" class="error">
      <h2>连接错误</h2>
      <p>{{ error }}</p>
    </div>
    <div v-if="!backendResponse && !error">
      <p>正在连接到后端服务...</p>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .success {
    color: green;
  }
  
  .error {
    color: red;
  }
}
</style>