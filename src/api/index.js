import axios from 'axios';
import { ElMessage } from 'element-plus';

const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
});

// ⭐ 新增：请求拦截器
api.interceptors.request.use(
    config => {
        // 从localStorage获取token
        const token = localStorage.getItem('token');
        if (token) {
            // 如果token存在，则将其添加到请求头中
            config.headers['token'] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


// 响应拦截器 (保持不变)
api.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.code !== 200) {
            ElMessage({
                message: res.msg || res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            });
            // 如果是token失效或未认证(可以和后端约定一个特定的code)，跳转到登录页
            if (res.code === 401 || res.code === 403) {
                 // 清除已失效的token
                 localStorage.removeItem('token');
                 // 跳转到登录页，可以优化为router.push
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

/* --- 账户相关API --- */
export const loginAPI = (data) => api.post('/account/login', data);
export const sendSmsAPI = (data) => api.post('/account/sms', data);
export const registerAPI = (data) => api.post('/account/register', data);
// 注意：现在logoutAPI不再需要手动加token了，拦截器会自动处理
export const logoutAPI = () => api.post('/account/logout');


/* --- ⭐ 新增：数据和工单相关API --- */

// 数据模块
export const getTodayProcessWorkOrderAPI = () => api.get('/data/getTodayProcessWorkOrder');
export const getDeadlineWorkOrderAPI = () => api.get('/data/getDeadlineWorkOrder');

// 工单模块
export const getWorkOrdersByStatusAPI = (status, index = 1) => api.get(`/workOrder/getAllByStatus?status=${status}&index=${index}`);

// 日志模块
export const getApprovalLogsAPI = (index = 1) => api.get(`/approvalLog/getAll?index=${index}`);
export const getWorkOrderLogsAPI = (index = 1) => api.get(`/workOrderLog/getAll?index=${index}`);