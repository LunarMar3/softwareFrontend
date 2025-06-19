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
        <div class="pagination-container">
            <el-pagination
                background
                layout="prev, pager, next"
                :current-page="approvalCurrentPage"
                :page-size="10"
                :total="1000"
                @current-change="handleApprovalPageChange"
            />
        </div>
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
        <div class="pagination-container">
            <el-pagination
                background
                layout="prev, pager, next"
                :current-page="workOrderCurrentPage"
                :page-size="10"
                :total="1000"
                @current-change="handleWorkOrderPageChange"
            />
        </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getApprovalLogsAPI, getWorkOrderLogsAPI } from '../../api';
import { ElMessage } from 'element-plus';

const approvalLogs = ref([]);
const workOrderLogs = ref([]);
const loading1 = ref(false);
const loading2 = ref(false);

const approvalCurrentPage = ref(1);
const workOrderCurrentPage = ref(1);
let hasMoreApprovalLogs = true;
let hasMoreWorkOrderLogs = true;


const fetchApprovalLogs = async (page) => {
    if (!hasMoreApprovalLogs && page > approvalCurrentPage.value) {
        ElMessage.info('审批日志已经是最后一页了');
        return;
    }
    loading1.value = true;
    try {
        const data = await getApprovalLogsAPI(page);
        if (!data || data.length === 0) {
            hasMoreApprovalLogs = false;
            if (page > 1) ElMessage.info('审批日志已经是最后一页了');
            else approvalLogs.value = [];
        } else {
            approvalLogs.value = data;
            approvalCurrentPage.value = page;
            hasMoreApprovalLogs = data.length === 10;
        }
    } catch (error) {
        console.error("获取审批日志失败:", error);
    } finally {
        loading1.value = false;
    }
};
const fetchWorkOrderLogs = async (page) => {
    if (!hasMoreWorkOrderLogs && page > workOrderCurrentPage.value) {
        ElMessage.info('工单日志已经是最后一页了');
        return;
    }
    loading2.value = true;
    try {
        const data = await getWorkOrderLogsAPI(page);
        if (!data || data.length === 0) {
            hasMoreWorkOrderLogs = false;
            if (page > 1) ElMessage.info('工单日志已经是最后一页了');
            else workOrderLogs.value = [];
        } else {
            workOrderLogs.value = data;
            workOrderCurrentPage.value = page;
            hasMoreWorkOrderLogs = data.length === 10;
        }
    } catch (error) {
        console.error("获取工单日志失败:", error);
    } finally {
        loading2.value = false;
    }
};

onMounted(() => {
    fetchApprovalLogs(1);
    fetchWorkOrderLogs(1);
});

const handleApprovalPageChange = (newPage) => {
    fetchApprovalLogs(newPage);
};
const handleWorkOrderPageChange = (newPage) => {
    fetchWorkOrderLogs(newPage);
};

</script>

<style scoped>
.card-header {
    font-weight: bold;
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>