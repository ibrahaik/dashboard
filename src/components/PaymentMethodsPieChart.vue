<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Métodos de Pago</ion-card-title>
      <ion-card-subtitle>Distribución de transacciones</ion-card-subtitle>
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
import { TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([PieChart, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

const chartContainer = ref(null);
let chart = null;

// Datos simulados de métodos de pago
const paymentData = [
  { value: 58, name: 'Tarjeta de Crédito' },
  { value: 25, name: 'PayPal' },
  { value: 8, name: 'Bizum' },
  { value: 5, name: 'Apple Pay' },
  { value: 4, name: 'Google Pay' }
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
      data: paymentData.map(item => item.name),
      textStyle: {
        color: '#666',
        fontSize: 12
      },
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 10
    },
    series: [
      {
        name: 'Métodos de Pago',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
            color: '#333'
          }
        },
        labelLine: {
          show: false
        },
        data: paymentData,
        color: ['#ffcc00', '#999999', '#666666', '#333333', '#cccccc']
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
