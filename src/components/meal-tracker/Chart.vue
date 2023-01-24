<template>
  <div class="chart mt-8">
    <h3 class="subheading">Data Logging</h3>
    <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from '../../store';
import dayjs from 'dayjs';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const store = useStore();

const days = ref(store.foods_eaten_by_day);

console.log(days.value.length);

const foodOneProtein = [];

days.value.map((day) => {
  foodOneProtein.push(day.data[0].protein);
});

let daysTotalProtein = [];
let daysTotalCalories = [];
store.foods_eaten_by_day.forEach(() => {
  daysTotalProtein.push(0);
  daysTotalCalories.push(0);
});

days.value.forEach((day, i) => {
  day.data.map((item) => {
    daysTotalProtein[i] += Math.round(item.protein * item.multiplier);
    daysTotalCalories[i] += Math.round(item.calories * item.multiplier);
  });
});

console.log(daysTotalProtein);
console.log(daysTotalCalories);

const chartData = computed(() => {
  return {
    labels: days.value.map((day) => dayjs(day.date).format('ddd, MMM D')),
    datasets: [
      {
        // label: 'Total protein',
        label: 'Total calories',
        // backgroundColor: '#324ca8',
        backgroundColor: [],
        // data: daysTotalProtein,
        data: daysTotalCalories,
      },
    ],
  };
});
const chartOptions = {
  responsive: true,
  scales: {
    y: {
      min: 0,
    },
  },
  plugins: {
    legend: {
      labels: {
        boxWidth: 0,
      },
    },
  },
};

daysTotalCalories.forEach((calories) => {
  if (calories > 1800) {
    chartData.value.datasets[0].backgroundColor.push('#ff0000');
  } else {
    chartData.value.datasets[0].backgroundColor.push('#324ca8');
  }
});
</script>
