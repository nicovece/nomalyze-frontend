<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

const props = defineProps<{
  data: Record<string, number>
}>()

const difficultyColors: Record<string, string> = {
  Easy: '#c0a659',
  Medium: '#a9c57c',
  Intermediate: '#6fc3aa',
  Hard: '#f37f20',
}

const chartData = computed(() => {
  const labels = Object.keys(props.data)
  return {
    labels,
    datasets: [
      {
        data: Object.values(props.data),
        backgroundColor: labels.map((l) => difficultyColors[l] || '#d7b25b'),
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: { display: true, text: 'Difficulty Distribution' },
    legend: { position: 'bottom' as const },
  },
}
</script>

<template>
  <div class="rounded-lg bg-white p-4 shadow-md">
    <div class="h-64">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
