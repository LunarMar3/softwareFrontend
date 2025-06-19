<template>
  <el-dialog
    :model-value="visible"
    title="工单详情"
    width="700px"
    @update:model-value="emit('update:visible', false)"
  >
    <div v-loading="loading">
      <el-descriptions v-if="workOrderDetail" :column="2" border>
        <el-descriptions-item label="工单ID">{{ workOrderDetail.id }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag size="small">{{ workOrderDetail.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="标题" :span="2">{{ workOrderDetail.title }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ workOrderDetail.type }}</el-descriptions-item>
        <el-descriptions-item label="优先级">
          {{ priorityMap[workOrderDetail.priority] || '未知' }}
        </el-descriptions-item>

        <el-descriptions-item label="创建时间">{{ formatTime(workOrderDetail.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ formatTime(workOrderDetail.updatedAt) }}</el-descriptions-item>
        <el-descriptions-item label="截止日期">{{ formatTime(workOrderDetail.deadline) || '未设置' }}</el-descriptions-item>
        <el-descriptions-item label="完成时间">{{ formatTime(workOrderDetail.completedAt) || '未完成' }}</el-descriptions-item>

        <el-descriptions-item label="申请人ID">{{ workOrderDetail.requesterId }}</el-descriptions-item>
        <el-descriptions-item label="指派处理人ID">{{ workOrderDetail.assigneeId }}</el-descriptions-item>
        <el-descriptions-item label="处理部门ID">{{ workOrderDetail.departmentId }}</el-descriptions-item>
        <el-descriptions-item label="处理组ID">{{ workOrderDetail.assigneeGroupId }}</el-descriptions-item>

        <el-descriptions-item label="详细描述" :span="2">{{ workOrderDetail.description }}</el-descriptions-item>
        <el-descriptions-item label="解决方案" :span="2">{{ workOrderDetail.solution || '暂无' }}</el-descriptions-item>
      </el-descriptions>
      <el-empty v-else description="暂无数据" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="emit('update:visible', false)">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getWorkOrderByIdAPI } from '../api';

const props = defineProps({
  visible: Boolean,
  workOrderId: Number,
});

const emit = defineEmits(['update:visible']);

const loading = ref(false);
const workOrderDetail = ref(null);

const priorityMap = {
  1: '高',
  2: '中',
  3: '低',
};

// 格式化时间，如果时间无效则返回指定文本
const formatTime = (timeStr, emptyText = '') => {
  if (!timeStr) return emptyText;
  return new Date(timeStr).toLocaleString();
};

const fetchDetails = async () => {
  if (!props.workOrderId) return;
  loading.value = true;
  workOrderDetail.value = null;
  try {
    const data = await getWorkOrderByIdAPI(props.workOrderId);
    workOrderDetail.value = data;
  } catch (error) {
    console.error('获取工单详情失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDetails();
});

</script>

<style scoped>
</style>
