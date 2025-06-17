<template>
  <div>
    <h1>每日数据看板</h1>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <el-statistic title="今日已处理工单数" :value="todayProcessed" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <el-statistic title="即将过期工单数" :value="deadlineApproaching">
             <template #suffix>
              <el-tooltip
                effect="dark"
                content="距离截止日期不足一天的工单"
                placement="top"
              >
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getTodayProcessWorkOrderAPI, getDeadlineWorkOrderAPI } from '../../api';
import { Warning } from '@element-plus/icons-vue';

const todayProcessed = ref(0);
const deadlineApproaching = ref(0);

onMounted(async () => {
  try {
    todayProcessed.value = await getTodayProcessWorkOrderAPI();
    deadlineApproaching.value = await getDeadlineWorkOrderAPI();
  } catch (error) {
    console.error("获取看板数据失败:", error);
  }
});
</script>

<style scoped>
.el-card {
  text-align: center;
}
</style>