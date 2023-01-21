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
              <td>TOTALS:</td>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import TableHeading from '../components/meal-tracker/TableHeading.vue';
import { foods } from '../data/foods';

const BODY_WEIGHT = 215;
const PROTEIN_P = 0.8;
const CARBS_P = 0.8;
const FAT_P = 0.2;

const selectedFoods = ref([]);

function round(num) {
  return Math.round(num);
}

function calculateTotals(value) {
  let total = 0;
  selectedFoods.value.map((food) => {
    console.log('food.multiplier', food[value], food.multiplier);
    total += food[value] * food.multiplier;
  });
  // return total;
  return round(total);
}

const totalProtein = computed(() => calculateTotals('protein'));

const totalCarbs = computed(() => calculateTotals('carbs'));

const totalFat = computed(() => calculateTotals('fat'));

const totalCalories = computed(() => calculateTotals('calories'));

function toggleSelect(e) {
  const targetEl = e.target;
  const targetIndex = e.target.dataset.index;

  if (foods[targetIndex].selected) {
    foods[targetIndex].selected = false;
    targetEl.closest('td').classList.remove('selected');
    const updatedArray = selectedFoods.value.filter((obj) => {
      return obj.name !== foods[targetIndex].name;
    });
    selectedFoods.value = updatedArray;
  } else {
    foods[targetIndex].selected = true;
    targetEl.closest('td').classList.add('selected');
    selectedFoods.value.push(foods[targetIndex]);
  }
}

function portionCalc(e, i) {
  console.log(e, i);
  // console.log(JSON.stringify(selectedFoods.value, null, 2));
  // console.log('value:', e.target.value);

  let value = 0;

  console.log('i', i);
  selectedFoods.value[i].multiplier = e.target.value;

  totalProtein * e.target.value;
}
</script>
