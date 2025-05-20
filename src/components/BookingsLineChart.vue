<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Evolución Diaria de Reservas</ion-card-title>
      <ion-card-subtitle>Último mes</ion-card-subtitle>
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
let resizeObserver = null;

// Generar datos simulados para el último mes
const generateDailyBookingsData = () => {
  const dates = [];
  const bookings = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }));
    
    // Generar datos con tendencia creciente y algunas fluctuaciones
    const baseValue = 150 + i * 3;
    const randomFactor = Math.random() * 50 - 25;
    bookings.push(Math.max(50, Math.round(baseValue + randomFactor)));
  }
  
  return { dates, bookings };
};

onMounted(() => {
  const { dates, bookings } = generateDailyBookingsData();
  
  const ctx = chartCanvas.value.getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Número de Reservas',
        data: bookings,
        borderColor: '#ffcc00',
        backgroundColor: 'rgba(255, 204, 0, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#ffcc00',
        pointRadius: 3,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return `Reservas: ${context.parsed.y}`;
            }
          },
          backgroundColor: 'rgba(51, 51, 51, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#ffcc00',
          borderWidth: 1
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Número de Reservas',
            color: '#666'
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.2)'
          },
          ticks: {
            color: '#666'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Fecha',
            color: '#666'
          },
          grid: {
            display: false
          },
          ticks: {
            color: '#666',
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
  
  // Usar ResizeObserver para manejar cambios de tamaño
  resizeObserver = new ResizeObserver(() => {
    if (chart) {
      chart.resize();
    }
  });
  
  resizeObserver.observe(chartCanvas.value.parentNode);
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
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
