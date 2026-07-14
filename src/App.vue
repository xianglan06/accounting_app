<template>
  <div class="app">
    <header class="app-header">
      <h1>🐴 黑马记账</h1>
    </header>

    <!-- 标签导航 -->
    <nav class="tab-nav">
      <button
        :class="['tab-btn', { active: activeTab === 'record' }]"
        @click="activeTab = 'record'"
      >
        📝 记账
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'stats' }]"
        @click="activeTab = 'stats'"
      >
        📊 统计
      </button>
    </nav>

    <!-- 页面内容 -->
    <main class="app-main">
      <HomeView v-if="activeTab === 'record'" />
      <StatsView v-if="activeTab === 'stats'" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HomeView from './views/HomeView.vue'
import StatsView from './views/StatsView.vue'

const activeTab = ref('record')
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f6fa;
}

.app-header {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 16px 24px;
  text-align: center;
  -webkit-app-region: drag;
}

.app-header h1 {
  margin: 0;
  font-size: 22px;
  letter-spacing: 2px;
}

.tab-nav {
  display: flex;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.tab-btn {
  flex: 1;
  padding: 14px;
  border: none;
  background: none;
  font-size: 16px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  color: #3498db;
  background: #f0f7ff;
}

.tab-btn.active {
  color: #3498db;
  border-bottom-color: #3498db;
  font-weight: bold;
}

.app-main {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}
</style>
