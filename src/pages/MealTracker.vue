<template>
  <div id="meal-tracker">
    <div class="container">
      <h2 class="heading mb-3">Meal Tracker</h2>
      <div class="flex">
        <div class="mr-5">
          <h3 class="subheading">Foods list:</h3>

          <table class="food-options">
            <TableHeading />

            <tr v-for="(food, index) in foods" :key="index">
              <td class="select">
                <a class="flex-jcsb-aic" @click="toggleSelect($event)" :data-index="index">
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
          <h3 class="subheading">Foods selected:</h3>

          <table class="food-selected">
            <TableHeading servings />

            <tr v-for="(food, index) in selectedFoods" :key="index">
              <td class="flex-jcsb-aic">
                <span style="margin-right: 10px">{{ food.name }}</span>
                <div class="flex-jcsb-aic">
                  <span style="margin-right: 4px">x</span>
                  <input @input="portionCalc($event, index)" type="text" value="1" class="portion" />
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

const store = useStore();

const foods = computed(() => store.foods);

const selectedFoods = computed(() => store.selectedFoods);

// const BODY_WEIGHT = 215;
// const PROTEIN_P = 0.8;
// const CARBS_P = 0.8;
// const FAT_P = 0.2;

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
}

function portionCalc(e, i) {
  store.selectedFoods[i].multiplier = e.target.value;
  // totalProtein * e.target.value;
}

function round(num) {
  return Math.round(num);
}

function calculateTotals(value) {
  let total = 0;
  store.selectedFoods.map((food) => {
    console.log('food.multiplier', food[value], food.multiplier);
    total += food[value] * food.multiplier;
  });
  return round(total);
}

const totalProtein = computed(() => calculateTotals('protein'));

const totalCarbs = computed(() => calculateTotals('carbs'));

const totalFat = computed(() => calculateTotals('fat'));

const totalCalories = computed(() => calculateTotals('calories'));
</script>
