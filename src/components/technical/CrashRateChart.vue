<template>
    <ion-card class="chart-card">
      <ion-card-header>
        <ion-card-title>Crash Rate por Versión</ion-card-title>
        <ion-card-subtitle>Tasa de errores por versión de app | Unidad: Porcentaje (%)</ion-card-subtitle>
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
  
  const crashData = {
    labels: ['v1.5.0', 'v1.6.0', 'v1.7.0', 'v1.8.0', 'v1.9.0', 'v2.0.0'],
    datasets: [{
      label: 'Crash Rate (%)',
      data: [2.8, 1.9, 1.2, 0.8, 0.6, 0.4],
      backgroundColor: function(context) {
        const value = context.parsed.y;
        if (value > 2) return '#ff6b6b';
        if (value > 1) return '#feca57';
        return '#1dd1a1';
      },
      borderColor: function(context) {
        const value = context.parsed.y;
        if (value > 2) return '#ff5252';
        if (value > 1) return '#ff9f43';
        return '#10ac84';
      },
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false
    }]
  };
  
  onMounted(() => {
    const ctx = chartCanvas.value.getContext('2d');
    
    chart = new Chart(ctx, {
      type: 'bar',
      data: crashData,
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
                return `Crash Rate: ${context.parsed.y}%`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Crash Rate (%)',
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
                return value + '%';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Versión de la App',
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
  