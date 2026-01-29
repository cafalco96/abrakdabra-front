<script setup lang="ts">
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

type PerCategoryStat = {
  category_id: number
  name: string
  tickets_sold: string
  revenue: string
}

const props = defineProps<{
  items: PerCategoryStat[]
}>()

const labels = computed(() => props.items.map(i => i.name))
const ticketsData = computed(() => props.items.map(i => Number(i.tickets_sold)))
const revenueData = computed(() => props.items.map(i => Number(i.revenue)))

// Paleta de colores vibrantes y claros (soporta hasta 12 categorías)
const colors = [
  { bg: 'rgba(66, 165, 245, 0.8)', border: 'rgb(66, 165, 245)' },      // Azul
  { bg: 'rgba(102, 187, 106, 0.8)', border: 'rgb(102, 187, 106)' },    // Verde
  { bg: 'rgba(255, 167, 38, 0.8)', border: 'rgb(255, 167, 38)' },      // Naranja
  { bg: 'rgba(239, 83, 80, 0.8)', border: 'rgb(239, 83, 80)' },        // Rojo
  { bg: 'rgba(171, 71, 188, 0.8)', border: 'rgb(171, 71, 188)' },      // Púrpura
  { bg: 'rgba(38, 198, 218, 0.8)', border: 'rgb(38, 198, 218)' },      // Cian
  { bg: 'rgba(251, 188, 4, 0.8)', border: 'rgb(251, 188, 4)' },        // Amarillo
  { bg: 'rgba(233, 30, 99, 0.8)', border: 'rgb(233, 30, 99)' },        // Rosa
  { bg: 'rgba(0, 150, 136, 0.8)', border: 'rgb(0, 150, 136)' },        // Teal
  { bg: 'rgba(103, 58, 183, 0.8)', border: 'rgb(103, 58, 183)' },      // Índigo
  { bg: 'rgba(244, 67, 54, 0.8)', border: 'rgb(244, 67, 54)' },        // Rojo fuerte
  { bg: 'rgba(76, 175, 80, 0.8)', border: 'rgb(76, 175, 80)' },        // Verde fuerte
]

const backgroundColors = computed(() => 
  props.items.map((_, i) => colors[i % colors.length].bg)
)

const borderColors = computed(() => 
  props.items.map((_, i) => colors[i % colors.length].border)
)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value)
}

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Entradas vendidas',
      data: ticketsData.value,
      backgroundColor: backgroundColors.value,
      borderColor: borderColors.value,
      borderWidth: 2,
      borderRadius: 6,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold' as const,
      },
      bodyFont: {
        size: 13,
      },
      callbacks: {
        afterLabel: (context: any) => {
          const index = context.dataIndex
          const revenue = revenueData.value[index]
          return `Ingresos: ${formatCurrency(revenue)}`
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
        font: {
          size: 11,
        },
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.06)',
      },
    },
    x: {
      ticks: {
        font: {
          size: 11,
        },
      },
      grid: {
        display: false,
      },
    },
  },
}
</script>

<template>
  <div style="height: 280px;">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
