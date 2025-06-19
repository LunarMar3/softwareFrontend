import { createRouter, createWebHistory } from 'vue-router';

// 懒加载导入所有页面组件
const Login = () => import('../views/Login.vue');
const Register = () => import('../views/Register.vue');
const MainLayout = () => import('../layout/MainLayout.vue');
const DailyData = () => import('../views/dashboard/DailyData.vue');
const WorkOrderList = () => import('../views/dashboard/WorkOrderList.vue');
const LogQuery = () => import('../views/dashboard/LogQuery.vue');

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    {
        path: '/dashboard',
        component: MainLayout, // 使用主布局
        redirect: '/dashboard/daily-data', // 默认显示每日数据页
        beforeEnter: (to, from, next) => {
          // 路由守卫：如果未登录，则不允许访问
          if (localStorage.getItem('token')) {
            next();
          } else {
            next('/login');
          }
        },
        // 定义子路由
        children: [
            {
                path: 'daily-data',
                component: DailyData,
                meta: { title: '每日数据' }
            },
            {
                path: 'all-related',
                component: WorkOrderList, 
                meta: { title: '全部相关工单', fetchAll: true } 
            },
            {
                path: 'unprocessed',
                component: WorkOrderList,
                meta: { title: '未处理工单', status: 0 }
            },
            {
                path: 'pending-approval',
                component: WorkOrderList,
                meta: { title: '待审批工单', status: 2 } // API: 审批中
            },
            {
                path: 'approved',
                component: WorkOrderList,
                meta: { title: '已审批工单', status: 5 } // API: 已审批
            },
            {
                path: 'to-complete',
                component: WorkOrderList,
                meta: { title: '待完成工单', status: 7 } // API: 已指派
            },
            {
                path: 'completed',
                component: WorkOrderList,
                meta: { title: '已完成工单', status: 6 } // API: 已完成
            },
            {
                path: 'logs',
                component: LogQuery,
                meta: { title: '日志查询' }
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;