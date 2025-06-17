<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <div class="card-header">
          <span>注册新用户</span>
        </div>
      </template>
      <el-form :model="registerForm" :rules="rules" ref="registerFormRef">
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="密码" prefix-icon="Lock" show-password />
        </el-form-item>
         <el-form-item prop="realName">
          <el-input v-model="registerForm.realName" placeholder="真实姓名" prefix-icon="Postcard" />
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="registerForm.phone" placeholder="手机号" prefix-icon="Iphone" />
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="registerForm.email" placeholder="邮箱" prefix-icon="Message" />
        </el-form-item>
        <el-form-item prop="code">
           <el-input v-model="registerForm.code" placeholder="邮箱验证码" style="width: 60%; margin-right: 10px;" />
           <el-button @click="sendCode" :disabled="isSending">{{ countdown > 0 ? `${countdown}s后重试` : '发送验证码' }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" style="width: 100%;">注 册</el-button>
        </el-form-item>
      </el-form>
       <div class="footer-links">
        <el-link type="primary" @click="goToLogin">已有账号？返回登录</el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { registerAPI, sendSmsAPI } from '../api';
import { ElMessage } from 'element-plus';

const router = useRouter();
const registerFormRef = ref(null);

const registerForm = reactive({
  username: '',
  password: '',
  code: '',
  realName: '',
  phone: '',
  email: ''
});

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
});

const isSending = ref(false);
const countdown = ref(0);

const sendCode = async () => {
  if (!registerForm.email) {
    ElMessage.warning('请先输入邮箱地址');
    return;
  }
  isSending.value = true;
  countdown.value = 60;
  
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      isSending.value = false;
    }
  }, 1000);

  try {
    await sendSmsAPI({ email: registerForm.email });
    ElMessage.success('验证码发送成功，请注意查收！');
  } catch (error) {
     // 出错时，也需要恢复按钮状态
     clearInterval(timer);
     countdown.value = 0;
     isSending.value = false;
  }
};

const submitForm = () => {
  registerFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await registerAPI(registerForm);
        ElMessage.success('注册成功！');
        router.push('/login');
      } catch (error) {
        console.error('注册失败:', error);
      }
    }
  });
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
/* 样式与登录页类似，保持风格统一 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px 0;
  background-color: #f0f2f5;
   background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
}
.register-card {
  width: 450px;
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