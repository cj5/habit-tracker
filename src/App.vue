<template>
  <div class="container">
    <h1 class="mt-3">Habit Tracker</h1>
    <table>
      <tr class="table-heading">
        <th>Habit</th>
        <template v-for="(date, i) in store.displayedDates" :key="i">
          <th :data-date-id="date.id" :class="setActiveDayClass(date.id, store.todayId)">{{ date.title }}</th>
        </template>
        <th>Totals</th>
      </tr>
      <template v-for="(habit, i) in habits" :key="i">
        <TableRow :heading="habit.title" :habit-id="i"/>
      </template>
      <tr>
        <td>Totals</td>
        <td v-for="(date, i) in store.displayedDates" :key="i">
          <span class="bold">{{ dayTotals(date.id) }}</span> / {{ habitsAmount() }}
        </td>
        <td></td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from './store'
import TableRow from './components/TableRow.vue'
import { habits } from './data/habits'
import { setActiveDayClass } from './utilities'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

const store = useStore()

dayjs.extend(relativeTime)

console.clear()

const now = dayjs()
const START_DATE = dayjs('2022-10-25 00:00')
const DAYS_TO_TRACK = 365
const DAYS_TO_DISPLAY = 7
const DATE_FORMAT = 'ddd M/D'

function initDatesArray() {
  for (let i = 0; i < DAYS_TO_TRACK; i++) {
    store.dates.push({
      id: i,
      day: START_DATE.add(i, 'day').format('ddd'),
      title: START_DATE.add(i, 'day').format(DATE_FORMAT)
    })
  }
}

function initDisplayedDatesArray() {
  for (const i of store.dates) {
    if (i.title === now.format(DATE_FORMAT)) {
      store.todayId = i.id
      // FIND PREVIOUS SUNDAY
      if (i.day === 'Sun') {
        console.log(`Today is ${i.day}`)
        for (let j = 0; j < DAYS_TO_DISPLAY; j++) {
          store.displayedDates.push({
            id: store.dates[i.id + j].id,
            title: store.dates[i.id + j].title,
          })
        }
      } else {
        for (let j = 0; j < DAYS_TO_DISPLAY; j ++) {
          if (store.dates[i.id - j].day === 'Sun') {
            store.mostRecentSunId = i.id - j
            break
          }
        }
        for (let j = 0; j < DAYS_TO_DISPLAY; j++) {
          store.displayedDates.push({
            id: store.dates[store.mostRecentSunId + j].id,
            title: store.dates[store.mostRecentSunId + j].title,
            habits: [],
          })
        }
      }
    }
  }
  for (const habit of habits) {
    for (const date of store.displayedDates) {
      date.habits.push({
        title: habit.title,
        checked: false,
        amountPerWeek: habit.amountPerWeek,
      })
    }
  }
}

function dayTotals(id) {
  let dayCount = 0
  for (const date of store.displayedDates) {
    if (date.id === id) {
      for (const habit of date.habits) {
        if (habit.checked) {
          dayCount++
        }
      }
    }
  }
  return dayCount
}

function habitsAmount() {
  return store.displayedDates[0].habits.length
}

onMounted(() => {
  initDatesArray()
  initDisplayedDatesArray()

  // console.log('dates:', JSON.stringify(store.dates, null, 2))
  // console.log('displayedDates:', JSON.stringify(store.displayedDates, null, 2))
})

</script>

<style lang="scss">
@import 'styles/app';
</style>
