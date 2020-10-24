import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import './assets/main.css';

import DashboardLayout from './components/DashboardLayout.vue';
import EmptyLayout from './components/EmptyLayout.vue';

const app = createApp(App);

app.component('default-layout', DashboardLayout);
app.component('empty-layout', EmptyLayout);

const toastOptions: PluginOptions = {
    timeout: 4000
    // You can set your default options here
};

app.use(Toast, toastOptions);

app.use(router);
app.mount('#app');
