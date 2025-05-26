<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Top Destinos</ion-card-title>
      <ion-card-subtitle>Más populares este mes</ion-card-subtitle>
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
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

const chartContainer = ref(null);
let chart = null;

// Datos de destinos más populares
const destinationsData = [
  { value: 2840, name: 'París' },
  { value: 2350, name: 'Roma' },
  { value: 2100, name: 'Londres' },
  { value: 1890, name: 'Ámsterdam' },
  { value: 1650, name: 'Berlín' },
  { value: 1420, name: 'Lisboa' },
  { value: 980, name: 'Otros' }
];

onMounted(() => {
  chart = echarts.init(chartContainer.value);
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} reservas ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#ffcc00',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      data: destinationsData.map(item => item.name),
      textStyle: {
        color: '#666',
        fontSize: 11
      },
      itemWidth: 8,
      itemHeight: 8
    },
    series: [
      {
        name: 'Destinos',
        type: 'pie',
        radius: ['30%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: destinationsData,
        color: ['#ffcc00', '#ffd633', '#ffe066', '#ffeb99', '#fff5cc', '#fff9e6', '#fffcf0']
      }
    ]
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
