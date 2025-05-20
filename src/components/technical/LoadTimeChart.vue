<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Tiempo Medio de Carga por Pantalla</ion-card-title>
      <ion-card-subtitle>Medido en milisegundos</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div ref="chartContainer" class="chart-container"></div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent, GridComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, TooltipComponent, LegendComponent, GridComponent, DataZoomComponent, CanvasRenderer]);

const chartContainer = ref(null);
let chart = null;

// Datos simulados de tiempos de carga por pantalla
const loadTimeData = [
  { screen: 'Inicio', loadTime: 320 },
  { screen: 'Búsqueda', loadTime: 580 },
  { screen: 'Resultados', loadTime: 780 },
  { screen: 'Detalles Vuelo', loadTime: 450 },
  { screen: 'Selección Asiento', loadTime: 620 },
  { screen: 'Pago', loadTime: 380 },
  { screen: 'Confirmación', loadTime: 290 },
  { screen: 'Mi Cuenta', loadTime: 340 },
  { screen: 'Mis Vuelos', loadTime: 510 },
  { screen: 'Check-in', loadTime: 420 }
];

// Ordenar los datos por tiempo de carga (descendente)
loadTimeData.sort((a, b) => b.loadTime - a.loadTime);

onMounted(() => {
  chart = echarts.init(chartContainer.value);
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        return `<div style="font-weight:bold;margin-bottom:5px;">${params[0].name}</div>` +
               `<div>Tiempo de carga: <span style="font-weight:bold;color:#ffcc00;">${params[0].value} ms</span></div>`;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#ffcc00',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: 'Tiempo (ms)',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        color: '#666',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#ddd'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(200, 200, 200, 0.3)'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: loadTimeData.map(item => item.screen),
      axisLine: {
        lineStyle: {
          color: '#ddd'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666'
      }
    },
    series: [
      {
        name: 'Tiempo de Carga',
        type: 'bar',
        data: loadTimeData.map(item => item.loadTime),
        itemStyle: {
          color: function(params) {
            // Colorear según el tiempo de carga
            const value = params.value;
            if (value > 600) return '#ff6b6b'; // Rojo para tiempos lentos
            if (value > 400) return '#ffd166'; // Amarillo para tiempos medios
            return '#06d6a0'; // Verde para tiempos rápidos
          },
          borderRadius: [0, 4, 4, 0]
        },
        barWidth: '60%',
        label: {
          show: true,
          position: 'right',
          formatter: '{c} ms',
          color: '#666'
        }
      }
    ],
    // Añadir una línea de referencia para el objetivo de rendimiento
    markLine: {
      data: [
        {
          name: 'Objetivo',
          xAxis: 400,
          lineStyle: {
            color: '#ffcc00',
            type: 'dashed'
          },
          label: {
            formatter: 'Objetivo: 400ms',
            position: 'middle'
          }
        }
      ]
    }
  };
  
  chart.setOption(option);
  
  // Hacer responsivo
  const resizeHandler = () => {
    if (chart) {
      chart.resize();
    }
  };
  
  window.addEventListener('resize', resizeHandler);
  
  // Usar ResizeObserver para detectar cambios en el contenedor
  const resizeObserver = new ResizeObserver(resizeHandler);
  resizeObserver.observe(chartContainer.value);
  
  // Limpiar al desmontar
  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler);
    resizeObserver.disconnect();
    if (chart) {
      chart.dispose();
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

.chart-container {
  width: 100%;
  height: 100%;
}
</style>
