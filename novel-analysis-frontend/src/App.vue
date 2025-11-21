<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <el-container>
      <el-aside width="200px">
        <el-menu router>
          <el-menu-item index="/analysis">文本分析</el-menu-item>
          <el-menu-item index="/characters">角色设定</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.el-aside {
  background-color: #f9fafc;
}

.el-main {
  background-color: #1a1a1a;
  color: #fff;
  padding: 20px;
}
</style>