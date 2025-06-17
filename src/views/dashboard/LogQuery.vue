<template>
  <div>
    <h1>日志查询</h1>
    
    <el-card style="margin-top: 20px;">
        <template #header>
            <div class="card-header">
                <span>审批日志</span>
            </div>
        </template>
        <el-table :data="approvalLogs" stripe v-loading="loading1">
            <el-table-column prop="id" label="日志ID" width="80" />
            <el-table-column prop="workOrderId" label="工单ID" />
            <el-table-column prop="approverId" label="审批人ID" />
            <el-table-column prop="status" label="审批状态" />
            <el-table-column prop="comments" label="备注" />
            <el-table-column prop="createdAt" label="审批时间" />
        </el-table>
    </el-card>

    <el-card style="margin-top: 20px;">
        <template #header>
            <div class="card-header">
                <span>工单操作日志</span>
            </div>
        </template>
        <el-table :data="workOrderLogs" stripe v-loading="loading2">
            <el-table-column prop="id" label="日志ID" width="80" />
            <el-table-column prop="workOrderId" label="工单ID" />
            <el-table-column prop="operatorId" label="操作人ID" />
            <el-table-column prop="action" label="操作" />
            <el-table-column prop="details" label="详情" />
            <el-table-column prop="createdAt" label="操作时间" />
        </el-table>
    </el-card>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getApprovalLogsAPI, getWorkOrderLogsAPI } from '../../api';

const approvalLogs = ref([]);
const workOrderLogs = ref([]);
const loading1 = ref(false);
const loading2 = ref(false);

onMounted(async () => {
    loading1.value = true;
    loading2.value = true;
    try {
        approvalLogs.value = await getApprovalLogsAPI();
    } catch (error) {
        console.error("获取审批日志失败:", error);
    } finally {
        loading1.value = false;
    }
    
    try {
        workOrderLogs.value = await getWorkOrderLogsAPI();
    } catch (error) {
        console.error("获取工单日志失败:", error);
    } finally {
        loading2.value = false;
    }
});
</script>

<style scoped>
.card-header {
    font-weight: bold;
}
</style>