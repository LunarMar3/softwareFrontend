<template>
  <el-container class="main-layout">
    <el-aside width="200px">
      <div class="sidebar-logo">
        <h3>工单管理系统</h3>
      </div>
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/dashboard/daily-data">
          <el-icon><DataAnalysis /></el-icon>
          <span>每日数据</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/unprocessed">
          <el-icon><Warning /></el-icon>
          <span>未处理</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/pending-approval">
          <el-icon><EditPen /></el-icon>
          <span>待审批</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/to-complete">
          <el-icon><List /></el-icon>
          <span>待完成</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/completed">
          <el-icon><CircleCheck /></el-icon>
          <span>已完成</span>
        </el-menu-item>
         <el-menu-item index="/dashboard/logs">
          <el-icon><Document /></el-icon>
          <span>日志查询</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header class="header">
        <div class="header-title">欢迎使用</div>
        <el-dropdown>
          <span class="el-dropdown-link">
            操作员<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { logoutAPI } from '../api';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  DataAnalysis,
  Warning,
  EditPen,
  List,
  CircleCheck,
  Document,
  ArrowDown
} from '@element-plus/icons-vue'

const router = useRouter();

const handleLogout = () => {
  ElMessageBox.confirm('您确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await logoutAPI();
      localStorage.removeItem('token');
      router.push('/login');
      ElMessage.success('已成功退出');
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  }).catch(() => {
    // 用户点击取消
  });
};
</script>

<style scoped>
.main-layout, .el-container {
  height: 100vh;
}
.el-aside {
  background-color: #304156;
  color: #fff;
}
.sidebar-logo {
  text-align: center;
  padding: 20px 0;
  color: #fff;
  border-bottom: 1px solid #4a5d73;
}
.el-menu {
  border-right: none;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
}
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.el-main {
  background-color: #f0f2f5;
}
</style>