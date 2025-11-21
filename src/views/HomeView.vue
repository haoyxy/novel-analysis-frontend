<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const highlights = reactive([
  {
    title: '角色画像',
    description: '聚合人物标签、身份与热度，结合后端 /api/characters 数据展示。',
    metric: '42 份角色卡'
  },
  {
    title: '剧情节奏',
    description: '通过字数、段落和对话占比判断节奏健康度。',
    metric: '87% 节奏稳定'
  },
  {
    title: '世界观一致性',
    description: '比对势力设定、事件年表，提示潜在冲突，数据来自 /api/worlds。',
    metric: '21 条冲突已消解'
  }
])

const roadmap = reactive([
  { phase: '采集', detail: '作品素材上传 / 用户注册登录 / 角色与世界设定', status: 'Ready' },
  { phase: '分析', detail: '文本分析、作品重算、关键词提取', status: 'Live' },
  { phase: '运营', detail: '多维报表与导出，后续规划', status: 'Design' }
])

const navigateTo = (path) => router.push(path)
</script>

<template>
  <div class="home">
    <section class="hero glass-panel">
      <div class="hero-content">
        <p class="eyebrow">NOVEL OPS CENTER · LIVE</p>
        <h1>面向展示周的全栈<br />网文创作分析终端</h1>
        <p class="hero-subtitle">
          前端已改为直连后端接口：注册/登录、作品上传、文本分析、角色与世界设定均写入真实数据库。
        </p>
        <div class="hero-actions">
          <el-button type="primary" size="large" round @click="navigateTo('/analysis')">
            即刻运行分析
          </el-button>
          <el-button text size="large" @click="navigateTo('/works')">
            先上传素材
          </el-button>
        </div>
        <div class="hero-stats">
          <div>
            <p class="stat-number">12+</p>
            <span>预置模版</span>
          </div>
          <div>
            <p class="stat-number">5</p>
            <span>展示必备页面</span>
          </div>
          <div>
            <p class="stat-number">Live</p>
            <span>直连后端</span>
          </div>
        </div>
      </div>
      <div class="hero-chart">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>本周文本热度预测</span>
              <el-tag round type="success">+18%</el-tag>
            </div>
          </template>
          <div class="chart-bars">
            <div v-for="n in 7" :key="n" class="bar">
              <span :style="{ height: `${30 + n * 8}px` }"></span>
            </div>
          </div>
          <p class="chart-hint">数据示意，可替换为真实运营指标。</p>
        </el-card>
      </div>
    </section>

    <section class="feature-grid">
      <el-card
        v-for="item in highlights"
        :key="item.title"
        class="feature-card glass-panel"
        shadow="never"
      >
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
        <span class="metric">{{ item.metric }}</span>
      </el-card>
    </section>

    <section class="roadmap glass-panel">
      <header>
        <div>
          <p class="eyebrow">执行节奏</p>
          <h2>答辩演练流程</h2>
        </div>
        <el-button type="success" text @click="navigateTo('/users')">进入资料中心</el-button>
      </header>
      <el-timeline>
        <el-timeline-item
          v-for="node in roadmap"
          :key="node.phase"
          type="primary"
          :timestamp="node.status"
          size="large"
        >
          <strong>{{ node.phase }}</strong>
          <p>{{ node.detail }}</p>
        </el-timeline-item>
      </el-timeline>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  padding: 32px;
}

.hero-content h1 {
  font-size: 44px;
  margin-bottom: 12px;
  line-height: 1.2;
}

.hero-subtitle {
  color: var(--text-muted);
  margin-bottom: 24px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.hero-stats {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: var(--text-muted);
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 4px;
}

.hero-chart :deep(.el-card__body) {
  padding: 16px 12px 12px;
}

.chart-bars {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  height: 160px;
}

.chart-bars .bar {
  flex: 1;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.chart-bars .bar span {
  width: 60%;
  display: block;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--brand-primary), var(--brand-secondary));
}

.chart-hint {
  font-size: 12px;
  margin-top: 12px;
  color: var(--text-muted);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.feature-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric {
  color: var(--brand-primary);
  font-weight: 700;
}

.roadmap {
  padding: 20px;
}

.roadmap header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
</style>
