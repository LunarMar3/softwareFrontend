<template>
  <el-dialog
    :model-value="visible"
    :title="dialogTitle"
    width="500px"
    @update:model-value="emit('update:visible', false)"
    @close="resetForm"
  >
    <el-form :model="form" ref="formRef" label-width="80px">
      <el-form-item v-if="actionType === 'complete'" label="解决方案" prop="solution">
        <el-input v-model="form.solution" type="textarea" placeholder="请输入解决方案" />
      </el-form-item>
      
      <el-form-item label="备注" prop="comment">
        <el-input v-model="form.comment" type="textarea" placeholder="请输入备注信息" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submitAction">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { completeWorkOrderAPI, approveWorkOrderAPI, rejectWorkOrderAPI } from '../api';
import { ElMessage } from 'element-plus';

const props = defineProps({
  visible: Boolean,
  actionType: String, // 'complete', 'approve', 'reject'
  workOrderId: Number,
});
const emit = defineEmits(['update:visible', 'action-success']);

const formRef = ref(null);
const form = reactive({
  solution: '',
  comment: '',
});

// 根据操作类型，动态计算弹窗标题
const dialogTitle = computed(() => {
  const titles = {
    complete: '完成工单预案',
    approve: '审批通过',
    reject: '审批拒绝',
  };
  return titles[props.actionType] || '执行操作';
});

const submitAction = async () => {
  try {
    const payload = {
      id: props.workOrderId,
      comment: form.comment,
    };

    switch (props.actionType) {
      case 'complete':
        payload.solution = form.solution;
        await completeWorkOrderAPI(payload);
        break;
      case 'approve':
        await approveWorkOrderAPI(payload);
        break;
      case 'reject':
        await rejectWorkOrderAPI(payload);
        break;
      default:
        throw new Error('未知的操作类型');
    }
    
    ElMessage.success('操作成功！');
    emit('action-success'); // 通知父组件操作成功
    emit('update:visible', false); // 关闭弹窗
  } catch (error) {
    console.error('操作失败:', error);
  }
};

const resetForm = () => {
  form.solution = '';
  form.comment = '';
};
</script>