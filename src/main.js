import { createApp } from 'vue'
import App from './App.vue'

// 引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入我们创建的路由
import router from './router'

const app = createApp(App)

app.use(router) // 使用路由
app.use(ElementPlus) // 使用Element Plus

app.mount('#app')