<template>
  <el-dialog
    :model-value="visible"
    title="新建工单"
    width="600px"
    @update:model-value="closeDialog"
    @close="resetForm"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入工单标题" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" placeholder="请详细描述问题或需求" />
      </el-form-item>
      <el-form-item label="工单类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择工单类型">
          <el-option label="技术问题" value="技术问题" />
          <el-option label="需求申请" value="需求申请" />
          <el-option label="故障报修" value="故障报修" />
        </el-select>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-radio-group v-model="form.priority">
          <el-radio :value="1">高</el-radio>
          <el-radio :value="2">中</el-radio>
          <el-radio :value="3">低</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="处理部门" prop="departmentId">
        <el-select v-model="form.departmentId" placeholder="请选择部门" @change="handleDepartmentChange">
          <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="指派给" prop="assigneeId">
        <el-select v-model="form.assigneeId" placeholder="请先选择部门" :disabled="!form.departmentId">
           <el-option v-for="user in users" :key="user.id" :label="user.realName" :value="user.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="截止日期" prop="deadline">
        <el-date-picker
          v-model="form.deadline"
          type="datetime"
          placeholder="选择日期和时间"
          value-format="YYYY-MM-DDTHH:mm:ss"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'; // 1. 引入 onMounted
import { getAllDepartmentsAPI, getUsersByDepartmentIdAPI, createNewWorkOrderAPI } from '../api';
import { ElMessage } from 'element-plus';

// 接收父组件传递的v-model:visible
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:visible', 'submit-success']);

const formRef = ref(null);
const departments = ref([]);
const users = ref([]);

const initialForm = {
  title: '',
  description: '',
  type: '技术问题',
  priority: 2,
  departmentId: null,
  assigneeId: null,
  deadline: '',
};

const form = reactive({ ...initialForm });

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  assigneeId: [{ required: true, message: '请选择指派人', trigger: 'change' }],
  deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
};

// 2. 使用 onMounted 来获取初始数据
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

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await createNewWorkOrderAPI(form);
        ElMessage.success('工单创建成功！');
        emit('submit-success');
        closeDialog();
      } catch (error) {
        console.error("创建工单失败:", error);
      }
    }
  });
};

const closeDialog = () => {
  emit('update:visible', false);
};

const resetForm = () => {
  Object.assign(form, initialForm);
  users.value = [];
  formRef.value?.resetFields();
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
