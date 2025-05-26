<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>📊 KPI: Reservas Mensuales</ion-card-title>
      <ion-card-subtitle>Evolución de reservas por mes | Unidad: Número de reservas</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <canvas ref="chartCanvas"></canvas>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';
import Chart from 'chart.js/auto';

const chartCanvas = ref(null);
let chart = null;

// Datos de reservas mensuales
const monthlyData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  datasets: [
    {
      label: 'Reservas Reales',
      data: [18500, 19200, 22100, 24800, 23400, 26700, 31200, 29800, 25600, 27300, 24900, 28400],
      borderColor: '#ffcc00',
      backgroundColor: 'rgba(255, 204, 0, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#ffcc00',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8
    },
    {
      label: 'Objetivo',
      data: [20000, 21000, 22000, 23000, 24000, 25000, 26000, 27000, 28000, 29000, 30000, 30000],
      borderColor: '#ff4757',
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: [10, 5],
      tension: 0,
      fill: false,
      pointRadius: 0,
      pointHoverRadius: 0
    }
  ]
};

onMounted(() => {
  const ctx = chartCanvas.value.getContext('2d');
  
  chart = new Chart(ctx, {
    type: 'line',
    data: monthlyData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#666',
          borderColor: '#ffcc00',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              const value = context.parsed.y;
              return `${context.dataset.label}: ${value.toLocaleString('es-ES')}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Número de Reservas',
            color: '#666',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.2)'
          },
          ticks: {
            color: '#666',
            callback: function(value) {
              return value.toLocaleString('es-ES');
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Mes',
            color: '#666',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            display: false
          },
          ticks: {
            color: '#666'
          }
        }
      }
    }
  });
});

onUnmounted(() => {
  if (chart) {
    chart.destroy();
  }
});
</script>

<style scoped>
.chart-card {
  height: 100%;
  border-top: 3px solid #ffcc00;
}

ion-card-content {
  height: 300px;
}
</style>
