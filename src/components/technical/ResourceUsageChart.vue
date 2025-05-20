<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Consumo de Recursos</ion-card-title>
      <ion-card-subtitle>CPU, RAM y Batería</ion-card-subtitle>
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

// Datos simulados de consumo de recursos para diferentes dispositivos
const resourceData = [
  {
    label: 'iPhone 13',
    cpu: 15,
    ram: 22,
    battery: 8
  },
  {
    label: 'Samsung S21',
    cpu: 18,
    ram: 25,
    battery: 10
  },
  {
    label: 'Pixel 6',
    cpu: 16,
    ram: 20,
    battery: 9
  },
  {
    label: 'Xiaomi Mi 11',
    cpu: 20,
    ram: 28,
    battery: 12
  },
  {
    label: 'iPhone 12',
    cpu: 17,
    ram: 24,
    battery: 9
  }
];

onMounted(() => {
  const ctx = chartCanvas.value.getContext('2d');
  
  chart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['CPU (%)', 'RAM (MB)', 'Batería (%/h)'],
      datasets: resourceData.map((device, index) => ({
        label: device.label,
        data: [device.cpu, device.ram, device.battery],
        backgroundColor: `rgba(255, 204, 0, ${0.7 - index * 0.1})`,
        borderColor: index === 0 ? '#ffcc00' : `rgba(${51 + index * 40}, ${51 + index * 40}, ${51 + index * 40}, 0.8)`,
        borderWidth: 2,
        pointBackgroundColor: index === 0 ? '#ffcc00' : `rgba(${51 + index * 40}, ${51 + index * 40}, ${51 + index * 40}, 0.8)`,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: index === 0 ? '#ffcc00' : `rgba(${51 + index * 40}, ${51 + index * 40}, ${51 + index * 40}, 0.8)`,
        pointRadius: 4,
        pointHoverRadius: 6
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            padding: 15,
            color: '#666'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#666',
          borderColor: '#ffcc00',
          borderWidth: 1,
          padding: 10,
          displayColors: true,
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.raw;
              const metric = context.chart.data.labels[context.dataIndex];
              
              if (metric.includes('CPU')) {
                return `${label}: ${value}% de CPU`;
              } else if (metric.includes('RAM')) {
                return `${label}: ${value} MB de RAM`;
              } else if (metric.includes('Batería')) {
                return `${label}: ${value}% de batería por hora`;
              }
              return `${label}: ${value}`;
            }
          }
        }
      },
      scales: {
        r: {
          min: 0,
          max: 30,
          ticks: {
            stepSize: 5,
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
              size: 12,
              weight: 'bold'
            }
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
  
  if (chartCanvas.value.parentNode) {
    resizeObserver.observe(chartCanvas.value.parentNode);
  }
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
  margin: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
  border-top: 3px solid #ffcc00;
}

ion-card-header {
  padding: 16px;
  background-color: #fff;
}

ion-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

ion-card-subtitle {
  font-size: 0.85rem;
  color: #666;
}

ion-card-content {
  padding: 0 16px 16px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

canvas {
  max-width: 100%;
  max-height: 100%;
}
</style>
