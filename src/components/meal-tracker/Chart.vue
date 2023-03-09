<template>
  <div class="chart mt-8">
    <h3 class="subheading">Data Logging</h3>
    <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useStore } from '../../store';
import dayjs from 'dayjs';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const store = useStore();

const daysTotalCalories = computed(() => {
  let returnVal = [];
  store.foods_eaten_by_day.forEach(() => {
    returnVal.push(0);
  });
  store.foods_eaten_by_day.forEach((day, i) => {
    day.data.map((item) => {
      returnVal[i] += Math.round(item.calories * item.multiplier);
    });
  });
  return returnVal;
});

const chartData = computed(() => {
  return {
    labels: store.foods_eaten_by_day.map((day) => dayjs(day.date).format('ddd, MMM D')),
    datasets: [
      {
        // label: 'Total protein',
        label: 'Total calories',
        // backgroundColor: '#324ca8',
        backgroundColor: [],
        // data: daysTotalProtein,
        data: daysTotalCalories.value,
        borderWidth: 1,
      },
    ],
  };
});

function updateDataPointColoring() {
  chartData.value.datasets[0].data.forEach((value) => {
    if (value > 1800) {
      // if (value < 140) {
      chartData.value.datasets[0].backgroundColor.push('#ff4e3d');
    } else {
      chartData.value.datasets[0].backgroundColor.push('#42cf5e');
    }
  });
}
updateDataPointColoring();

watch(
  () => store.foods_eaten_by_day,
  () => updateDataPointColoring()
);

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
</script>
