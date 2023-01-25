<template>
  <Header />

  <Suspense>
    <div v-if="store.fetchedMealTrackerData" class="pt-4 pb-8">
      <router-view />
    </div>
  </Suspense>

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
import Header from './components/shared/AppHeader.vue';
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
