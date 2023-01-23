<template>
  <div id="meal-tracker">
    <div class="container">
      <div class="flex aifs mb-5">
        <h2 class="heading">Meal Tracker</h2>
        <div class="day-display flex fdc ml-12">
          <div class="flex aic">
            <p class="fz-18 bold no-wrap m-0">{{ dayHighlighted }}</p>
            <p v-if="store.dayHighlighted === store.today" class="flag ml-2 m-0">Today</p>
            <p v-if="store.dayHighlighted === dayjs(store.today).subtract(1, 'day').format(store.dateFormat)" class="flag ml-2 m-0">Yesterday</p>
          </div>
          <div class="mt-1">
            <button @click="navDay('prev')" @keydown.enter="navDay('prev')" class="btn-2 sm mr-1">❮</button>
            <button @click="navDay('next')" @keydown.enter="navDay('next')" class="btn-2 sm" :disabled="store.today === store.dayHighlighted ? true : false">❯</button>
          </div>
        </div>
      </div>

      <div class="flex">
        <div class="mr-5">
          <h3 class="subheading">Foods list:</h3>

          <table class="food-options">
            <TableHeading />

            <tr v-for="(food, index) in foods" :key="index">
              <td :class="`select ${food.selected ? 'selected' : ''}`">
                <a class="flex jcsb aic" @click="toggleSelect($event)" @keydown.enter="toggleSelect($event)" :data-index="index">
                  <span>{{ food.name }}</span>
                  <span class="gray italic fz-12 ml-3">({{ food.portion }})</span>
                </a>
              </td>
              <td>{{ food.protein }}</td>
              <td>{{ food.carbs }}</td>
              <td>{{ food.fat }}</td>
              <td>{{ food.calories }}</td>
            </tr>
          </table>
        </div>

        <div>
          <div class="p-rel">
            <h3 class="subheading">Foods selected:</h3>

            <div class="action-btns ml-3">
              <button class="btn-2 svg mr-1" @click="onRefresh" @keydown.enter="onRefresh" :disabled="store.hasUpdatedMealTracker ? false : true">
                <ArrowPathIcon />
              </button>
              <button class="btn-2 mr-1" @click="onClear" @keydown.enter="onClear" :disabled="store.selectedFoods.length > 0 ? false : true">Clear</button>
              <button class="btn submit" @click="onSubmit" @keydown.enter="onSubmit" :disabled="store.hasUpdatedMealTracker ? false : true">Submit</button>
            </div>
          </div>

          <table class="food-selected">
            <TableHeading servings />

            <tr v-for="(food, index) in selectedFoods" :key="index">
              <td class="flex jcsb aic">
                <span style="margin-right: 10px">{{ food.name }}</span>
                <div class="flex jcsb aic">
                  <span style="margin-right: 4px">x</span>
                  <input type="text" :value="food.multiplier" @input="portionCalc($event, index)" class="portion" />
                </div>
              </td>
              <td>{{ round(food.protein * food.multiplier) }}</td>
              <td>{{ round(food.carbs * food.multiplier) }}</td>
              <td>{{ round(food.fat * food.multiplier) }}</td>
              <td>{{ round(food.calories * food.multiplier) }}</td>
            </tr>
            <tr id="totals">
              <td>Totals:</td>
              <td>{{ totalProtein }}</td>
              <td>{{ totalCarbs }}</td>
              <td>{{ totalFat }}</td>
              <td>{{ totalCalories }}</td>
            </tr>
          </table>

          <p class="mt-3"><i>Macro goals:</i>&nbsp;&nbsp; P ~ 140g – 175g &nbsp;/&nbsp; C ~ 220g &nbsp;/&nbsp; F ~ 50g</p>
          <p class="gray">1 lb = 453.6 g</p>
        </div>
      </div>
    </div>
    <!-- .container  -->
  </div>
</template>

<script setup>
import { computed } from 'vue';
import TableHeading from '../components/meal-tracker/TableHeading.vue';
import { useStore } from '../store';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

dayjs.extend(relativeTime);

const store = useStore();

const foods = computed(() => store.foods);

const selectedFoods = computed(() => store.selectedFoods);

const dayHighlighted = computed(() => dayjs(store.dayHighlighted).format('dddd, MMMM D, YYYY'));

// const BODY_WEIGHT = 215;
// const PROTEIN_P = 0.8;
// const CARBS_P = 0.8;
// const FAT_P = 0.2;

const alertText = {
  submitted: 'Foods were submitted for the current day',
  deleted: 'Data for this day has been deleted',
  reset: 'Data reset from database',
  unsubmitted: 'You have unsubmitted changes',
};

function toggleSelect(e) {
  const targetEl = e.target;
  const targetIndex = e.target.dataset.index;

  if (this.foods[targetIndex].selected) {
    this.foods[targetIndex].selected = false;
    targetEl.closest('td').classList.remove('selected');
    const updatedArray = store.selectedFoods.filter((obj) => {
      return obj.name !== this.foods[targetIndex].name;
    });
    store.selectedFoods = updatedArray;
  } else {
    this.foods[targetIndex].selected = true;
    targetEl.closest('td').classList.add('selected');
    store.selectedFoods.push(this.foods[targetIndex]);
  }

  store.hasUpdatedMealTracker = true;
}

function onSubmit() {
  const toPush = {
    date: store.dayHighlighted,
    data: store.selectedFoods,
  };
  if (store.selectedFoods.length) {
    store.pushData('eaten_by_day', toPush, alertText.submitted);
  } else {
    store.deleteData('eaten_by_day', store.dayHighlighted, alertText.deleted);
  }
  store.hasUpdatedMealTracker = false;
}

function onClear() {
  store.selectedFoods = [];
  for (const food of store.foods) {
    food.selected = false;
  }
  store.hasUpdatedMealTracker = true;
}

function onRefresh() {
  store.fetchData('eaten_by_day', alertText.reset);
  store.hasUpdatedMealTracker = false;
}

function navDay(direction) {
  if (store.hasUpdatedMealTracker) {
    store.postAlertMessage(alertText.unsubmitted);
  } else {
    store.fetchData('eaten_by_day');
    if (direction === 'prev') {
      store.dayHighlighted = dayjs(store.dayHighlighted).subtract(1, 'day').format(store.dateFormat);
    } else if (direction === 'next') {
      store.dayHighlighted = dayjs(store.dayHighlighted).add(1, 'day').format(store.dateFormat);
    }
  }
}

function portionCalc(e, i) {
  store.selectedFoods[i].multiplier = e.target.value;
  store.hasUpdatedMealTracker = true;
}

function round(num) {
  return Math.round(num);
}

function calculateTotals(value) {
  let total = 0;
  store.selectedFoods.map((food) => {
    // console.log('food.multiplier', food[value], food.multiplier);
    total += food[value] * food.multiplier;
  });
  return round(total);
}

const totalProtein = computed(() => calculateTotals('protein'));

const totalCarbs = computed(() => calculateTotals('carbs'));

const totalFat = computed(() => calculateTotals('fat'));

const totalCalories = computed(() => calculateTotals('calories'));
</script>
