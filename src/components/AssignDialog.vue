<template>
  <el-dialog
    :model-value="visible"
    title="指派工单"
    width="500px"
    @update:model-value="emit('update:visible', false)"
  >
    <el-form :model="form" ref="formRef" label-width="100px">
       <el-form-item label="指派部门" prop="departmentId">
        <el-select v-model="form.departmentId" placeholder="请选择部门" @change="handleDepartmentChange" style="width: 100%;">
          <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="指派给" prop="assigneeId">
        <el-select v-model="form.assigneeId" placeholder="请先选择部门" :disabled="!form.departmentId" style="width: 100%;">
           <el-option v-for="user in users" :key="user.id" :label="user.realName" :value="user.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submitForm">确认指派</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getAllDepartmentsAPI, getUsersByDepartmentIdAPI, assignWorkOrderAPI } from '../api';
import { ElMessage } from 'element-plus';

const props = defineProps({
  visible: Boolean,
  workOrderId: Number,
});
const emit = defineEmits(['update:visible', 'assign-success']);

const formRef = ref(null);
const departments = ref([]);
const users = ref([]);

const form = reactive({
  departmentId: null,
  assigneeId: null,
});

onMounted(() => {
  fetchDepartments();
});

const fetchDepartments = async () => {
  try {
    departments.value = await getAllDepartmentsAPI();
  } catch (error) {
    console.error("获取部门列表失败:", error);
  }
};

const handleDepartmentChange = async (deptId) => {
  form.assigneeId = null;
  users.value = [];
  if (!deptId) return;
  try {
    users.value = await getUsersByDepartmentIdAPI(deptId);
  } catch (error) {
    console.error("获取用户列表失败:", error);
  }
};

const submitForm = async () => {
  if (!form.assigneeId) {
    ElMessage.warning('请选择要指派的人员');
    return;
  }

  try {
    const payload = {
      id: props.workOrderId,
      assigneeId: form.assigneeId,
    };
    await assignWorkOrderAPI(payload);
    ElMessage.success('指派成功！');
    emit('assign-success');
    emit('update:visible', false);
  } catch (error) {
    console.error('指派失败:', error);
  }
};
</script>
