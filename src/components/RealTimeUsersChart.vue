<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Usuarios Activos</ion-card-title>
      <ion-card-subtitle>En tiempo real</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div class="realtime-container">
        <div class="users-count">
          <div class="count">{{ currentUsers }}</div>
          <div class="label">usuarios activos</div>
        </div>
        <canvas ref="chartCanvas"></canvas>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';
import Chart from 'chart.js/auto';

const chartCanvas = ref(null);
const currentUsers = ref(0);
let chart = null;
let updateInterval = null;
let resizeObserver = null;

// Datos iniciales
const labels = Array(20).fill('').map((_, i) => `${i}`);
const data = Array(20).fill(0);

// Función para simular datos en tiempo real
const updateRealtimeData = () => {
  // Simular fluctuación de usuarios
  const newUsers = Math.floor(Math.random() * 100) + 350;
  currentUsers.value = newUsers;
  
  // Actualizar datos del gráfico
  data.shift();
  data.push(newUsers);
  
  chart.update();
};

onMounted(() => {
  const ctx = chartCanvas.value.getContext('2d');
  
  // Configuración del gráfico
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Usuarios Activos',
        data: data,
        borderColor: '#ffcc00',
        backgroundColor: 'rgba(255, 204, 0, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 300,
          max: 500,
          grid: {
            display: false
          },
          display: false
        },
        x: {
          display: false
        }
      },
      animation: {
        duration: 300
      }
    }
  });
  
  // Iniciar actualización en tiempo real
  updateRealtimeData();
  updateInterval = setInterval(updateRealtimeData, 2000);
  
  // Usar ResizeObserver para manejar cambios de tamaño
  resizeObserver = new ResizeObserver(() => {
    if (chart) {
      chart.resize();
    }
  });
  
  if (chartCanvas.value.parentNode) {
    resizeObserver.observe(chartCanvas.value.parentNode);
  }
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
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

.realtime-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.users-count {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 15px 25px;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.count {
  font-size: 3rem;
  font-weight: bold;
  color: #ffcc00;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.label {
  font-size: 1rem;
  color: #666;
}

canvas {
  position: relative;
  z-index: 5;
  width: 100%;
  height: 100%;
}
</style>
