<template>
  <header>
    <div class="container h-100">
      <div class="flex-jcsb-aic h-100">
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
</template>

<script setup>
import { useStore } from './store';

const store = useStore();

store.fetchData('foods');
</script>

<style lang="scss">
@import 'styles/app';
</style>
