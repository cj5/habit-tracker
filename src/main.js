import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHashHistory } from 'vue-router';
import HabitTracker from './pages/HabitTracker.vue';
import MealTracker from './pages/MealTracker.vue';
import App from './App.vue';

const routes = [
  { path: '/', component: HabitTracker },
  { path: '/meal-tracker', component: MealTracker },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount('#app');
