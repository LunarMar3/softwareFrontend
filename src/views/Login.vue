<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <span>运维工单管理系统 - 登录</span>
        </div>
      </template>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" @keyup.enter="submitForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" style="width: 100%;">登 录</el-button>
        </el-form-item>
      </el-form>
      <div class="footer-links">
        <el-link type="primary" @click="goToRegister">没有账号？立即注册</el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { loginAPI } from '../api';
import { ElMessage } from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const router = useRouter();
const loginFormRef = ref(null);

const loginForm = reactive({
  username: '',
  password: '',
});

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});

const submitForm = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const token = await loginAPI(loginForm);
        // 登录成功
        ElMessage.success('登录成功！');
        // 将token存入localStorage，用于后续的身份验证
        localStorage.setItem('token', token);
        // 跳转到主页面
        router.push('/dashboard');
      } catch (error) {
        console.error('登录失败:', error);
        // 错误消息已在api/index.js中统一处理，这里无需重复提示
      }
    }
  });
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
}
.login-card {
  width: 400px;
}
.card-header {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.footer-links {
  text-align: right;
  margin-top: -10px;
}
</style>