<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>💰 KPI: Ingresos Mensuales</ion-card-title>
      <ion-card-subtitle>Evolución de ingresos por mes | Unidad: Euros (€)</ion-card-subtitle>
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

// Datos de ingresos mensuales con línea de objetivo
const monthlyRevenue = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  datasets: [
    {
      label: 'Ingresos Reales',
      data: [2800000, 2950000, 3100000, 3350000, 3200000, 3450000, 3800000, 3650000, 3750000, 3900000, 3850000, 4200000],
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
      data: [3000000, 3100000, 3200000, 3300000, 3400000, 3500000, 3600000, 3700000, 3800000, 3900000, 4000000, 4100000],
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
    data: monthlyRevenue,
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
              return `${context.dataset.label}: €${(value / 1000000).toFixed(1)}M`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Ingresos (€)',
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
              return '€' + (value / 1000000).toFixed(1) + 'M';
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
