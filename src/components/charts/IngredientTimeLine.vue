<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
} from 'chart.js'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Title)

const props = defineProps<{
  data: { ingredient_count: number; cooking_time: number }[]
}>()

const chartData = computed(() => {
  const sorted = [...props.data].sort((a, b) => a.ingredient_count - b.ingredient_count)
  return {
    labels: sorted.map((d) => String(d.ingredient_count)),
    datasets: [
      {
        label: 'Cooking Time (min)',
        data: sorted.map((d) => d.cooking_time),
        borderColor: '#f37f20',
        backgroundColor: '#6fc3aa',
        pointBackgroundColor: '#6fc3aa',
        pointRadius: 5,
        tension: 0.3,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: { display: true, text: 'Cooking Time vs Ingredient Count' },
  },
  scales: {
    x: { title: { display: true, text: 'Number of Ingredients' } },
    y: { beginAtZero: true, title: { display: true, text: 'Cooking Time (min)' } },
  },
}
</script>

<template>
  <div class="rounded-lg bg-white p-4 shadow-md">
    <div class="h-64">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
