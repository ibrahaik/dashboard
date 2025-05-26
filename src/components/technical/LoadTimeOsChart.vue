<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Tiempo de Carga por SO</ion-card-title>
      <ion-card-subtitle>Comparativa iOS vs Android | Unidad: Milisegundos (ms)</ion-card-subtitle>
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
import { RadarChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([RadarChart, TooltipComponent, LegendComponent, CanvasRenderer]);

const chartContainer = ref(null);
let chart = null;

// Datos de tiempo de carga por SO y pantalla
let loadTimeData = {
  indicator: [
    { name: 'Inicio', max: 1000 },
    { name: 'Búsqueda', max: 1500 },
    { name: 'Resultados', max: 2000 },
    { name: 'Detalles', max: 1200 },
    { name: 'Pago', max: 1800 },
    { name: 'Confirmación', max: 800 }
  ],
  series: [
    {
      name: 'iOS',
      value: [320, 580, 780, 450, 620, 290],
      itemStyle: {
        color: '#ffcc00'
      }
    },
    {
      name: 'Android',
      value: [380, 640, 890, 520, 720, 340],
      itemStyle: {
        color: '#1dd1a1'
      }
    }
  ]
};

onMounted(() => {
  chart = echarts.init(chartContainer.value);
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return `<div style="font-weight:bold;margin-bottom:5px;">${params.seriesName}</div>` +
               `<div>${params.name}: ${params.value}ms</div>`;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#ffcc00',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      }
    },
    legend: {
      data: ['iOS', 'Android'],
      top: 'bottom',
      textStyle: {
        color: '#666'
      }
    },
    radar: {
      indicator: loadTimeData.indicator,
      center: ['50%', '50%'],
      radius: '70%',
      axisName: {
        color: '#666',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(200, 200, 200, 0.3)'
        }
      },
      splitArea: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(200, 200, 200, 0.3)'
        }
      }
    },
    series: [{
      name: 'Tiempo de Carga',
      type: 'radar',
      data: loadTimeData.series.map(item => ({
        value: item.value,
        name: item.name,
        itemStyle: item.itemStyle,
        areaStyle: {
          opacity: 0.2
        }
      }))
    }]
  };
  chart.setOption(option);
  
  // Hacer responsivo
  const resizeHandler = () => {
    if (chart) {
      chart.resize();
    }
  };
  
  window.addEventListener('resize', resizeHandler);
  const resizeObserver = new ResizeObserver(resizeHandler);
  resizeObserver.observe(chartContainer.value);
  
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
