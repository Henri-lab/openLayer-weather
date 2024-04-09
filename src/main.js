

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueECharts from 'vue-echarts';
import * as echarts from 'echarts';
// import { use } from 'echarts/core';
// import { CanvasRenderer } from 'echarts/renderers';


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.component('v-chart', VueECharts);

app.use(createPinia())
app.use(router)
app.use(echarts)

app.mount('#app')
