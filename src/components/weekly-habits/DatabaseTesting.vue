<template>
  <div class="mb-8">
    <div class="flex-fdc-aic">
      <button class="btn" @click="onSubmit" @keydown.enter="onSubmit">Submit</button>
    </div>

    <div class="flex-fdc-aic">
      <button class="btn my-2" @click="onGet" @keydown.enter="onGet">Get Data</button>
      <p>{{ getValue }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from '../../store';
import dayjs from 'dayjs';
import { createClient } from '@supabase/supabase-js';
const { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } = import.meta.env;

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);

console.clear();

const store = useStore();

const getValue = ref(null);

async function onSubmit() {
  try {
    console.log('onSubmit()', store.displayedDates);

    const nowFormatted = dayjs().format('YYYY-M-D');

    const { data: days, error } = await supabase.from('days').insert({
      date: nowFormatted,
      habits: store.displayedDates,
    });
    console.log(JSON.stringify(days, null, 2));
    if (error) throw error;
  } catch (error) {
    console.log('error:', error);
  }
}

async function onGet() {
  try {
    let { data: days, error } = await supabase.from('days').select('*');
    console.log(JSON.stringify(days, null, 2));
    getValue.value = days;
  } catch (error) {
    console.log('error:', error);
  }
}
</script>
