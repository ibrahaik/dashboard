<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>% Reservas por Destino</ion-card-title>
      <ion-card-subtitle>Distribución de destinos populares | Unidad: Porcentaje (%)</ion-card-subtitle>
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

const destinationData = [
  { value: 28.5, name: 'París' },
  { value: 22.3, name: 'Roma' },
  { value: 18.7, name: 'Londres' },
  { value: 12.4, name: 'Ámsterdam' },
  { value: 8.9, name: 'Berlín' },
  { value: 5.8, name: 'Lisboa' },
  { value: 3.4, name: 'Otros' }
];

onMounted(() => {
  chart = echarts.init(chartContainer.value);
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}% ({d}%)',
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
      data: destinationData.map(item => item.name),
      textStyle: {
        color: '#666',
        fontSize: 11
      },
      itemWidth: 10,
      itemHeight: 10
    },
    series: [
      {
        name: 'Destinos',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{c}%',
          fontSize: 10,
          color: '#666'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '12',
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: destinationData,
        color: ['#ffcc00', '#ffd633', '#ffe066', '#ffeb99', '#fff5cc', '#fff9e6', '#fffcf0']
      }
    ]
  };
  
  chart.setOption(option);
  
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
