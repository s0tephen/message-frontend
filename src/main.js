import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import router from './router'
import 'element-plus/dist/index.css'
import App from './App.vue'
import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css'

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.use(Bootstrap)
app.mount('#app')

