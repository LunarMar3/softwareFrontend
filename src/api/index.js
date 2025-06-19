import axios from 'axios';
import { ElMessage } from 'element-plus';

const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
});

api.interceptors.request.use(
    config => {

        const token = localStorage.getItem('token');
        if (token) {
            config.headers['token'] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.code !== 200) {
            ElMessage({
                message: res.msg || res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            });
            if (res.code === 401 || res.code === 403) {
                 localStorage.removeItem('token');
                 window.location.href = '/login';
            }
            return Promise.reject(new Error(res.msg || 'Error'));
        } else {
            return res.data;
        }
    },
    error => {
        console.log('err' + error);
        ElMessage({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);

export const loginAPI = (data) => api.post('/account/login', data);
export const sendSmsAPI = (data) => api.post('/account/sms', data);
export const registerAPI = (data) => api.post('/account/register', data);
export const logoutAPI = () => api.post('/account/logout');



export const getTodayProcessWorkOrderAPI = () => api.get('/data/getTodayProcessWorkOrder');
export const getDeadlineWorkOrderAPI = () => api.get('/data/getDeadlineWorkOrder');

export const getWorkOrdersByStatusAPI = (status, index = 1) => api.get(`/workOrder/getAllByStatus?status=${status}&index=${index}`);

export const getApprovalLogsAPI = (index = 1) => api.get(`/approvalLog/getAll?index=${index}`);
export const getWorkOrderLogsAPI = (index = 1) => api.get(`/workOrderLog/getAll?index=${index}`);

export const getAllDepartmentsAPI = () => api.get('/department/getAll');

export const getUsersByDepartmentIdAPI = (departmentId) => api.get(`/account/getUsersByDepartmentId?departmentId=${departmentId}`);

export const createNewWorkOrderAPI = (data) => api.post('/workOrder/newWorkOrder', data);

export const getAllWorkOrdersAPI = (index = 1) => api.get(`/workOrder/getAll?index=${index}`);

export const getWorkOrderByIdAPI = (workOrderId) => api.get(`/workOrder/getWorkOrderById?workOrderId=${workOrderId}`);

export const completeWorkOrderAPI = (data) => api.post('/workOrder/complete', data);

export const approveWorkOrderAPI = (data) => api.post('/workOrder/approve', data);

export const rejectWorkOrderAPI = (data) => api.post('/workOrder/reject', data);

export const assignWorkOrderAPI = (data) => api.post('/workOrder/assign', data);

export const finishWorkOrderAPI = (data) => api.post('/workOrder/finish', data);
