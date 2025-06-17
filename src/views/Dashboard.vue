<template>
  <div class="dashboard-container">
    <el-card>
      <template #header>
        欢迎使用工单管理系统
      </template>
      <p>登录成功！这里是主页面。</p>
      <p>你的Token是: {{ token }}</p>
      <el-button type="danger" @click="handleLogout">退出登录</el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { logoutAPI } from '../api';
import { ElMessage } from 'element-plus';

const router = useRouter();
const token = ref(localStorage.getItem('token'));

const handleLogout = async () => {
  try {
    await logoutAPI();
    // 清除本地存储的token
    localStorage.removeItem('token');
    ElMessage.success('已成功退出登录');
    // 跳转回登录页
    router.push('/login');
  } catch (error) {
    console.error('退出登录失败:', error);
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 40px;
}
p {
  word-break: break-all;
}
</style>