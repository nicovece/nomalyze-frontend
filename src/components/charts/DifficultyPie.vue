<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import type { Recipe } from '@/types/recipe'
import { difficultyHex, difficultyHexFallback } from '@/utils/difficulty'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

const props = defineProps<{
  data: Record<string, number>
}>()

const chartData = computed(() => {
  const labels = Object.keys(props.data)
  return {
    labels,
    datasets: [
      {
        data: Object.values(props.data),
        backgroundColor: labels.map(
          (l) => difficultyHex[l as Recipe['difficulty']] ?? difficultyHexFallback,
        ),
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
