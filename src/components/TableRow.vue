<template>
  <tr>
    <td>{{ props.heading }}</td>
    <template v-for="(date, i) in store.displayedDates" :key="i">
      <td :data-date-id="date.id" :data-habit-id="props.habitId" :class="setActiveDayClass(date.id, store.todayId)">
        <div class="flex">
          <input
            id=""
            type="checkbox"
            name=""
            @input="onInput($event)"
          >
          <span class="id">{{ date.id }}</span>
        </div>
      </td>
    </template>
    <td :class="weekTotalsClass">
      <span class="bold">{{ weekTotals }}</span> <span class="color-gray fz-12">({{ habitAmountPerWeek }})</span>
    </td>
  </tr>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../store'
import { habits } from '../data/habits'
import { setActiveDayClass } from '../utilities'

const store = useStore()

const props = defineProps({
  heading: String,
  habitId: Number,
})

const weekCount = ref(0)

function onInput(e) {
  const dateId = Number(e.target.closest('td').dataset.dateId)
  const habitId = Number(e.target.closest('td').dataset.habitId)
  for (const date of store.displayedDates) {
    if (date.id === dateId) {
      if (date.habits[habitId].checked) {
        date.habits[habitId].checked = false
      } else {
        date.habits[habitId].checked = true
      }
    }
  }
}

const weekTotals = computed(() => {
  weekCount.value = 0
  for (const date of store.displayedDates) {
    if (date.habits[props.habitId].checked) {
      weekCount.value++
    }
  }
  return weekCount.value
})

const weekTotalsClass = computed(() => {
  if (weekCount.value >= habits[props.habitId].amountPerWeek) {
    return 'success'
  } else {
    return 'fail'
  }
})

const habitAmountPerWeek = computed(() => {
  if (store.displayedDates[0]) {
    return store.displayedDates[0].habits[props.habitId].amountPerWeek
  }
})
</script>
