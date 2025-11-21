<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

// --- 响应式状态 ---
const characters = ref([]);
const dialogVisible = ref(false);
const isEditMode = ref(false);
const form = ref({
  id: null,
  name: '',
  description: ''
});

const API_URL = 'http://localhost:8081/api/characters';

// --- 真实API调用函数 ---
const fetchCharacters = async () => {
  try {
    const response = await axios.get(API_URL);
    characters.value = response.data;
  } catch (error) {
    ElMessage.error('Failed to load characters. Is backend running?');
    console.error(error);
  }
};

const handleSave = async () => {
  try {
    if (isEditMode.value) {
      await axios.put(`${API_URL}/${form.value.id}`, form.value);
      ElMessage.success('Character updated successfully!');
    } else {
      await axios.post(API_URL, form.value);
      ElMessage.success('Character created successfully!');
    }
    dialogVisible.value = false;
    fetchCharacters();
  } catch (error) {
    ElMessage.error('Failed to save character.');
    console.error(error);
  }
};

const handleDelete = (id) => {
  ElMessageBox.confirm(
    'Are you sure you want to delete this character?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      ElMessage.success('Character deleted successfully!');
      fetchCharacters();
    } catch (error) {
      ElMessage.error('Failed to delete character.');
      console.error(error);
    }
  });
};

// --- UI 辅助函数 ---
const openAddDialog = () => {
  isEditMode.value = false;
  form.value = { id: null, name: '', description: '' };
  dialogVisible.value = true;
};

const openEditDialog = (character) => {
  isEditMode.value = true;
  form.value = { ...character }; // 浅拷贝一份数据到表单
  dialogVisible.value = true;
};

// --- 生命周期函数 ---
onMounted(() => {
  fetchCharacters();
});
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>角色设定管理</span>
      </div>
    </template>
    
    <el-button type="primary" @click="openAddDialog" style="margin-bottom: 20px;">
      新增角色
    </el-button>

    <el-table :data="characters" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="openEditDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog
    v-model="dialogVisible"
    :title="isEditMode ? '编辑角色' : '新增角色'"
    width="500"
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.card-header {
  font-weight: bold;
}
</style>