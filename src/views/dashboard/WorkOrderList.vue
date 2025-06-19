<template>
  <div>
    <h1>{{ pageTitle }}</h1>
    <el-table 
      :data="workOrderList" 
      stripe 
      v-loading="loading"
      @row-click="handleRowClick"
      style="cursor: pointer;"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" width="180" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="100" />
      
      <el-table-column label="操作" width="200px" align="center">
        <template #default="scope">
          <el-button
            v-if="route.meta.status === 0"
            type="primary"
            size="small"
            @click.stop="handleAction(scope.row, 'complete')"
          >
            完成预案
          </el-button>

          <div v-if="route.meta.status === 2">
            <el-button
              type="success"
              size="small"
              @click.stop="handleAction(scope.row, 'approve')"
            >
              通过
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click.stop="handleAction(scope.row, 'reject')"
            >
              拒绝
            </el-button>
          </div>
          <el-button
            v-if="route.meta.status === 5"
            type="warning"
            size="small"
            @click.stop="handleAssign(scope.row)"
          >
            指派
          </el-button>

          <el-button v-if="route.meta.status === 7" type="success" size="small" @click.stop="handleFinish(scope.row)">完成工单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
       </div>

    <work-order-detail-dialog
       />

    <action-dialog
      v-if="actionDialogVisible"
      v-model:visible="actionDialogVisible"
      :action-type="currentActionType"
      :work-order-id="selectedWorkOrderId"
      @action-success="handleActionSuccess"
    />
    <assign-dialog
      v-if="assignDialogVisible"
      v-model:visible="assignDialogVisible"
      :work-order-id="selectedWorkOrderId"
      @assign-success="handleActionSuccess"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getWorkOrdersByStatusAPI, getAllWorkOrdersAPI,finishWorkOrderAPI } from '../../api';
import { ElMessage, ElMessageBox } from 'element-plus';
import WorkOrderDetailDialog from '../../components/WorkOrderDetailDialog.vue';
import ActionDialog from '../../components/ActionDialog.vue';
import AssignDialog from '../../components/AssignDialog.vue';

const route = useRoute();
const workOrderList = ref([]);
const pageTitle = ref('');
const loading = ref(false);
const currentPage = ref(1);
const total = ref(1000); 
let hasMore = true;
const assignDialogVisible = ref(false);

const detailDialogVisible = ref(false);
const selectedWorkOrderId = ref(null);

const actionDialogVisible = ref(false);
const currentActionType = ref('');

const handleRowClick = (row) => {
  selectedWorkOrderId.value = row.id;
  detailDialogVisible.value = true;
};
const handleAssign = (row) => {
  selectedWorkOrderId.value = row.id;
  assignDialogVisible.value = true;
};
const handleFinish = async (row) => {
  try {
    await ElMessageBox.confirm(
      '您确定要将此工单标记为完成吗？',
      '完成确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    // 用户点击“确定”后，才会执行下面的代码
    await finishWorkOrderAPI({ id: row.id });
    ElMessage.success('工单已成功完成！');
    // 调用通用的成功回调，刷新列表
    handleActionSuccess();
  } catch (error) {
    // 如果用户点击“取消”，会进入catch块
    if (error !== 'cancel') {
      console.error('完成工单失败:', error);
    } else {
      ElMessage.info('操作已取消');
    }
  }
};
const handleAction = (row, actionType) => {
  selectedWorkOrderId.value = row.id;
  currentActionType.value = actionType;
  actionDialogVisible.value = true;
};

const handleActionSuccess = () => {
  ElMessage.info('列表即将刷新...');
  // 重新加载当前页的数据
  fetchData(currentPage.value);
};
const fetchData = async (page) => {
  if (!hasMore && page > currentPage.value) {
    ElMessage.info('已经是最后一页了');
    return;
  }
  
  loading.value = true;
  pageTitle.value = route.meta.title;

  try {
    let data;
    if (route.meta.fetchAll) {
      data = await getAllWorkOrdersAPI(page);
    } else {
      const status = route.meta.status;
      data = await getWorkOrdersByStatusAPI(status, page);
    }
    
    if (!data || data.length === 0) {
      if (page > 1) {
        ElMessage.info('已经是最后一页了');
        hasMore = false;
      } else {
         workOrderList.value = [];
         hasMore = false;
      }
    } else {
      workOrderList.value = data;
      currentPage.value = page;
      hasMore = data.length === 10;
    }
  } catch (error) {
    console.error(`获取工单列表(page=${page})失败:`, error);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (newPage) => {
  fetchData(newPage);
};

watch(() => route.path, () => {
  currentPage.value = 1;
  hasMore = true;
  fetchData(1);
}, { immediate: true });

</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>