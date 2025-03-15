import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useChartStore = defineStore('chart', () => {

  const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (s)'
        },
        grid: {
          color: '#fff',
          drawTicks: true,
          tickColor: '#000',
        },
        ticks: {
          padding: 10,
        },
        border: {
          display: true,
          color: '#000',
        }
      },
      y: {
        min: 50,
        title: {
          display: true,
          text: 'Pitch (Hz)'
        },
        grid: {
          color: '#fff',
          drawTicks: true,
          tickColor: '#000',
        },
        ticks: {
          padding: 15,
        },
        border: {
          display: true,
          color: '#000',
        }
      }
    }
  }
  
  const pitchChartOptions = {
    ...baseChartOptions,
    aspectRatio: 1,
    scales: {
      ...baseChartOptions.scales,
      y: { ...baseChartOptions.scales.y, min: 50 }
    }
  }

  const formantChartOptions = {
    ...baseChartOptions,
    aspectRatio: 2,
    scales: {
      ...baseChartOptions.scales,
      y: { ...baseChartOptions.scales.y, min: 0 }
    }
  }

  return { pitchChartOptions, formantChartOptions }
})
