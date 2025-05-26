<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Satisfacción del Cliente</ion-card-title>
      <ion-card-subtitle>Puntuación promedio: {{ averageScore }}/5</ion-card-subtitle>
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
const averageScore = ref(4.2);
let chart = null;

// Datos de satisfacción por categoría
const satisfactionData = {
  labels: ['Facilidad de Uso', 'Precio', 'Atención Cliente', 'Puntualidad', 'Comodidad', 'App Móvil'],
  datasets: [{
    label: 'Puntuación',
    data: [4.5, 3.8, 4.1, 4.3, 3.9, 4.6],
    backgroundColor: 'rgba(255, 204, 0, 0.6)',
    borderColor: '#ffcc00',
    borderWidth: 2,
    pointBackgroundColor: '#ffcc00',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#ffcc00',
    pointRadius: 6,
    pointHoverRadius: 8
  }]
};

onMounted(() => {
  const ctx = chartCanvas.value.getContext('2d');
  
  chart = new Chart(ctx, {
    type: 'radar',
    data: satisfactionData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#666',
          borderColor: '#ffcc00',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.raw}/5 estrellas`;
            }
          }
        }
      },
      scales: {
        r: {
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1,
            backdropColor: 'transparent',
            color: '#666'
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.3)'
          },
          angleLines: {
            color: 'rgba(200, 200, 200, 0.3)'
          },
          pointLabels: {
            color: '#333',
            font: {
              size: 11,
              weight: 'bold'
            }
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
