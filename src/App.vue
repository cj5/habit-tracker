<template>
  <header>
    <div class="container h-100">
      <div class="flex jcsb aic h-100">
        <h1 class="title mb-0">
          <router-link to="/" exact>Habit Tracker</router-link>
        </h1>
        <nav>
          <ul class="flex">
            <li>
              <router-link to="/" exact>Home</router-link>
            </li>
            <li>
              <router-link to="/meal-tracker">Meal Tracker</router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>

  <div class="pt-4 pb-8">
    <router-view />
  </div>

  <AlertMessage :text="store.alertMessage" />

  <div v-if="appLoading" class="app-loading">
    <div style="display: flex; flex-direction: column; align-items: center">
      <h1 class="title mb-0" style="font-size: 40px; color: #324ca8">Habit Tracker</h1>
      <p style="font-size: 20px; margin-top: 20px">Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from './store';
import AlertMessage from './components/shared/AlertMessage.vue';

const store = useStore();

const appLoading = ref(true);

store.fetchData('foods');
store.fetchData('foods_eaten_by_day');

setTimeout(() => {
  appLoading.value = false;
}, 500);
</script>

<style lang="scss">
@import 'styles/app';
</style>
