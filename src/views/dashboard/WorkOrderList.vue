<template>
  <div>
    <h1>{{ pageTitle }}</h1>
    <el-table :data="workOrderList" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" width="180" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="priority" label="优先级" width="100" />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column prop="deadline" label="截止时间" width="180" />
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getWorkOrdersByStatusAPI } from '../../api';

const route = useRoute();
const workOrderList = ref([]);
const pageTitle = ref('');
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  // 从路由的meta中获取标题和状态
  const status = route.meta.status;
  pageTitle.value = route.meta.title;

  try {
    const data = await getWorkOrdersByStatusAPI(status);
    workOrderList.value = data;
  } catch (error) {
    console.error(`获取工单列表(status=${status})失败:`, error);
    workOrderList.value = []; // 出错时清空列表
  } finally {
    loading.value = false;
  }
};

// 监听路由变化，以便在"未处理"、"待审批"等页面间切换时重新加载数据
watch(() => route.path, fetchData, { immediate: true });

</script>

<style scoped>
/* 可以在此添加自定义样式 */
</style>