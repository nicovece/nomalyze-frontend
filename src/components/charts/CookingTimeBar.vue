<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Title)

const props = defineProps<{
  data: { name: string; cooking_time: number }[]
}>()

const brandColors = ['#f37f20', '#6fc3aa', '#a9c57c', '#c0a659', '#d7b25b']

const chartData = computed(() => ({
  labels: props.data.map((d) => d.name),
  datasets: [
    {
      label: 'Cooking Time (min)',
      data: props.data.map((d) => d.cooking_time),
      backgroundColor: props.data.map((_, i) => brandColors[i % brandColors.length]),
      borderRadius: 4,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: { display: true, text: 'Cooking Time per Recipe' },
  },
  scales: {
    y: { beginAtZero: true, title: { display: true, text: 'Minutes' } },
  },
}
</script>

<template>
  <div class="rounded-lg bg-white p-4 shadow-md">
    <div class="h-64">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
