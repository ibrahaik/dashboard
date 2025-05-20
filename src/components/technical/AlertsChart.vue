<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Alertas Técnicas Frecuentes</ion-card-title>
      <ion-card-subtitle>Últimas 24 horas</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div id="alerts-chart"></div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';
import ApexCharts from 'apexcharts';

// Datos simulados de alertas técnicas
const alertsData = [
  { type: 'API Timeout', count: 42 },
  { type: 'Conexión Perdida', count: 38 },
  { type: 'Error de Autenticación', count: 27 },
  { type: 'Memoria Insuficiente', count: 21 },
  { type: 'Fallo de Caché', count: 18 },
  { type: 'Error de Renderizado', count: 15 },
  { type: 'Excepción no Controlada', count: 12 },
  { type: 'Timeout de Base de Datos', count: 9 }
];

// Ordenar los datos por frecuencia (descendente)
alertsData.sort((a, b) => b.count - a.count);

let chart = null;

onMounted(() => {
  const options = {
    series: [{
      name: 'Ocurrencias',
      data: alertsData.map(item => item.count)
    }],
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      },
      fontFamily: 'inherit',
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        barHeight: '70%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#fff'],
        fontWeight: 'bold'
      },
      formatter: function(val, opt) {
        return val;
      },
      offsetX: 0
    },
    colors: [
      '#ff6b6b', '#ff9f43', '#feca57', '#1dd1a1', 
      '#54a0ff', '#5f27cd', '#48dbfb', '#10ac84'
    ],
    xaxis: {
      categories: alertsData.map(item => item.type),
      labels: {
        style: {
          colors: '#666',
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#666',
          fontSize: '12px'
        }
      }
    },
    grid: {
      borderColor: 'rgba(200, 200, 200, 0.2)',
      row: {
        colors: ['transparent', 'transparent']
      },
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    tooltip: {
      theme: 'light',
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function() {
            return 'Ocurrencias:';
          }
        }
      }
    },
    legend: {
      show: false
    }
  };

  chart = new ApexCharts(document.querySelector("#alerts-chart"), options);
  chart.render();
  
  // Manejar cambios de tamaño
  const resizeHandler = () => {
    if (chart) {
      chart.updateOptions({
        chart: {
          height: document.querySelector("#alerts-chart").offsetHeight
        }
      });
    }
  };
  
  window.addEventListener('resize', resizeHandler);
  
  // Usar ResizeObserver para detectar cambios en el contenedor
  const resizeObserver = new ResizeObserver(resizeHandler);
  if (document.querySelector("#alerts-chart")) {
    resizeObserver.observe(document.querySelector("#alerts-chart").parentElement);
  }
  
  // Limpiar al desmontar
  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler);
    resizeObserver.disconnect();
    if (chart) {
      chart.destroy();
    }
  });
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

#alerts-chart {
  width: 100%;
  height: 100%;
}
</style>
