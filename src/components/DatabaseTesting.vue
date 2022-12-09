<template>
  <div class="mb-8">

    <div class="flex-fdc">
      <div class="input-wrap flex-fdc mb-2">
        <label for="test-input" class="mb-1">Add a record:</label>
        <input
          id="test-input"
          type="text"
          name=""
          v-model="inputValue"
        >
      </div>

      <button
        class="btn"
        @click="onSubmit"
        @keydown.enter="onSubmit"
      >Submit</button>
    </div>

    <div class="flex-fdc">
      <button
        class="btn my-2"
        @click="onGet"
        @keydown.enter="onGet"
      >Get Data</button>
      <p>{{ getValue }}</p>
    </div>


  </div>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { createClient } from '@supabase/supabase-js'
const {
  VITE_SUPABASE_URL,
  VITE_SUPABASE_KEY,
} = import.meta.env;

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);

console.clear()

const inputValue = ref('')
const getValue = ref(null)

const nowFormatted = dayjs().format('YYYY-M-D')

async function onSubmit() {
  console.log('onSubmit()', inputValue.value)
  try {
    const { data: days, error } = await supabase
      .from('days')
      .insert({
        date: nowFormatted,
        test: inputValue.value,
        habits: [
          {
            title: 'Follow diet',
            amountPerWeek: 6,
            checked: false,
          },
          {
            title: 'Work out',
            amountPerWeek: 4,
            checked: false,
          }
        ],
      })
      console.log(JSON.stringify(days, null, 2));
      if (error) throw error
  } catch (error) {
    console.log('error:', error)
  }
}

async function onGet() {
  try {
    let { data: days, error } = await supabase
      .from('days')
      .select('*')
    console.log(JSON.stringify(days , null, 2))
    getValue.value = days
  } catch (error) {
    console.log('error:', error)
  }
}
</script>
