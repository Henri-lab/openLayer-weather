
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueECharts from 'vue-echarts';
import { echartsPlugin } from './plugin/echarts';



import App from './App.vue'
import router from './router'

export const app = createApp(App)

app.component('v-chart', VueECharts);

app.use(createPinia())
app.use(router)
app.use(echartsPlugin)

app.mount('#app')
