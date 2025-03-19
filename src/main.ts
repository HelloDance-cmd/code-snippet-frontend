import { createApp } from 'vue'
import App from './App.vue'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import router from './route';


createApp(App)
    .use(Antd)
    .use(router)
    .use(PrimeVue, { theme: { preset: Aura } })
    .mount('#app')
