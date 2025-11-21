<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';

// --- 响应式状态 ---
const analysisResult = ref(null);
const isLoading = ref(false);

// --- 真实API调用逻辑 ---
const handleFileUpload = async (options) => {
  const file = options.file;
  if (file.type !== 'text/plain') {
    ElMessage.error('Only .txt files are allowed!');
    return;
  }
  
  isLoading.value = true;
  analysisResult.value = null;

  // 1. 创建 FormData 来包裹文件
  const formData = new FormData();
  formData.append('file', file);

  // 2. 发送真实的 POST 请求
  try {
    const response = await axios.post('http://localhost:8081/api/analyze/text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    analysisResult.value = response.data;
    ElMessage.success('Analysis complete!');
  } catch (error) {
    ElMessage.error('Analysis failed. Please ensure the backend service is running.');
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="analysis-view">
    <el-row :gutter="20">
      <!-- 左侧：文件上传 -->
      <el-col :span="8">
        <el-card>
          <template #header>
            <div><strong>1. 上传文本文件</strong></div>
          </template>
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :http-request="handleFileUpload"
            :show-file-list="false"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将 .txt 文件拖到此处 或 <em>点击上传</em>
            </div>
          </el-upload>
        </el-card>
      </el-col>

      <!-- 右侧：分析结果 -->
      <el-col :span="16">
        <el-card>
           <template #header>
            <div><strong>2. 分析结果</strong></div>
          </template>
          <div v-loading="isLoading" class="result-content">
            <div v-if="analysisResult" class="result-display">
              <h3>基础统计</h3>
              <p><strong>总字数:</strong> {{ analysisResult.wordCount }}</p>
              <p><strong>总段落数:</strong> {{ analysisResult.paragraphCount }}</p>
              
              <el-divider />
              
              <h3 style="margin-top: 20px;">核心关键词</h3>
              <el-table :data="Object.entries(analysisResult.keywords)" border size="small">
                <el-table-column prop="0" label="关键词" />
                <el-table-column prop="1" label="词频" />
              </el-table>
            </div>
            <div v-else class="placeholder">
              <el-text type="info">上传文件后，此处将显示分析结果。</el-text>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.analysis-view, .el-row, .el-col, .el-card {
  height: 100%;
}

.el-card {
  display: flex;
  flex-direction: column;
}

:deep(.el-card__body) {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.upload-demo, :deep(.el-upload), :deep(.el-upload-dragger) {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.result-content {
  flex-grow: 1;
}

.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
