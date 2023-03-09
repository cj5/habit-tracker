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
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);
ChartJS.register(annotationPlugin);

const store = useStore();

const CALORIE_LIMIT = 1800;
const COLOR_SUCCESS = '66, 207, 94';
const COLOR_FAILURE = '255, 77, 61';

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
        borderColor: '#aaa',
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
    annotation: {
      annotations: [
        // SUCCESS
        {
          type: 'box',
          xMin: 0,
          yMin: 0,
          yMax: CALORIE_LIMIT,
          backgroundColor: `rgba(${COLOR_SUCCESS}, 0.075)`,
          borderColor: '#aaa',
        },
        // FAILURE
        {
          type: 'box',
          xMin: 0,
          yMin: CALORIE_LIMIT + 1,
          backgroundColor: `rgba(${COLOR_FAILURE}, 0.075)`,
          borderColor: '#aaa',
        },
      ],
    },
  },
};

function updateDataPointColoring() {
  chartData.value.datasets[0].data.forEach((value) => {
    if (value <= CALORIE_LIMIT) {
      chartData.value.datasets[0].backgroundColor.push(`rgb(${COLOR_SUCCESS})`);
    } else {
      chartData.value.datasets[0].backgroundColor.push(`rgb(${COLOR_FAILURE})`);
    }
  });
}
updateDataPointColoring();

watch(
  () => store.foods_eaten_by_day,
  () => updateDataPointColoring()
);
</script>
