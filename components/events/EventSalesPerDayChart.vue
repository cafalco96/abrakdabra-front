<script setup lang="ts">
import {
  Chart as ChartJS,
  LineController,
  BarController,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Chart } from 'vue-chartjs'

ChartJS.register(
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
)

type PerDayStat = {
  date: string
  tickets_sold: string
  revenue: string
}

const props = defineProps<{
  items: PerDayStat[]
}>()

const labels = computed(() => props.items.map(i => i.date))
const ticketsData = computed(() => props.items.map(i => Number(i.tickets_sold)))
const revenueData = computed(() => props.items.map(i => Number(i.revenue)))

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
      type: 'bar' as const,
      label: 'Entradas vendidas',
      data: ticketsData.value,
      backgroundColor: 'rgba(66, 165, 245, 0.8)',
      borderColor: 'rgb(66, 165, 245)',
      borderWidth: 2,
      borderRadius: 6,
      yAxisID: 'y',
    },
    {
      type: 'line' as const,
      label: 'Ingresos',
      data: revenueData.value,
      borderColor: 'rgb(102, 187, 106)',
      backgroundColor: 'rgba(102, 187, 106, 0.2)',
      borderWidth: 3,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: 'rgb(102, 187, 106)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      tension: 0.3,
      fill: true,
      yAxisID: 'y1',
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        padding: 15,
        font: {
          size: 12,
          weight: '500' as const,
        },
        usePointStyle: true,
        pointStyle: 'circle',
      },
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
      bodySpacing: 8,
      callbacks: {
        label: (context: any) => {
          const label = context.dataset.label || ''
          const value = context.parsed.y
          if (context.datasetIndex === 0) {
            return `${label}: ${value} entradas`
          }
          return `${label}: ${formatCurrency(value)}`
        },
      },
    },
  },
  scales: {
    y: {
      position: 'left' as const,
      beginAtZero: true,
      title: { 
        display: true, 
        text: 'Entradas',
        font: {
          size: 12,
          weight: '600' as const,
        },
      },
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
    y1: {
      position: 'right' as const,
      beginAtZero: true,
      grid: { 
        drawOnChartArea: false,
      },
      title: { 
        display: true, 
        text: 'Ingresos (USD)',
        font: {
          size: 12,
          weight: '600' as const,
        },
      },
      ticks: {
        callback: (value: any) => {
          return formatCurrency(value)
        },
        font: {
          size: 11,
        },
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
  <div style="height: 300px;">
    <Chart type="bar" :data="chartData" :options="chartOptions" />
  </div>
</template>
