<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Crecimiento de Ingresos</ion-card-title>
      <ion-card-subtitle>Últimos 12 meses</ion-card-subtitle>
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
import { LineChart } from 'echarts/charts';
import { TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, TooltipComponent, GridComponent, CanvasRenderer]);

const chartContainer = ref(null);
let chart = null;

// Datos de crecimiento de ingresos
const revenueData = [
  { month: 'Ene', revenue: 2800000, growth: 0 },
  { month: 'Feb', revenue: 2950000, growth: 5.4 },
  { month: 'Mar', revenue: 3100000, growth: 5.1 },
  { month: 'Abr', revenue: 3350000, growth: 8.1 },
  { month: 'May', revenue: 3200000, growth: -4.5 },
  { month: 'Jun', revenue: 3450000, growth: 7.8 },
  { month: 'Jul', revenue: 3800000, growth: 10.1 },
  { month: 'Ago', revenue: 3650000, growth: -3.9 },
  { month: 'Sep', revenue: 3750000, growth: 2.7 },
  { month: 'Oct', revenue: 3900000, growth: 4.0 },
  { month: 'Nov', revenue: 3850000, growth: -1.3 },
  { month: 'Dic', revenue: 4200000, growth: 9.1 }
];

onMounted(() => {
  chart = echarts.init(chartContainer.value);
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function(params) {
        const revenue = params[0];
        const growth = params[1];
        return `<div style="font-weight:bold;margin-bottom:5px;">${revenue.name}</div>` +
               `<div>Ingresos: <span style="color:#ffcc00;font-weight:bold;">€${(revenue.value / 1000000).toFixed(1)}M</span></div>` +
               `<div>Crecimiento: <span style="color:${growth.value >= 0 ? '#10ac84' : '#ff6b6b'};font-weight:bold;">${growth.value >= 0 ? '+' : ''}${growth.value}%</span></div>`;
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
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: revenueData.map(item => item.month),
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
    yAxis: [
      {
        type: 'value',
        name: 'Ingresos (€M)',
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ffcc00'
          }
        },
        axisLabel: {
          formatter: '{value}M',
          color: '#666'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(200, 200, 200, 0.3)'
          }
        }
      },
      {
        type: 'value',
        name: 'Crecimiento (%)',
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#10ac84'
          }
        },
        axisLabel: {
          formatter: '{value}%',
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: 'Ingresos',
        type: 'line',
        yAxisIndex: 0,
        data: revenueData.map(item => (item.revenue / 1000000).toFixed(1)),
        smooth: true,
        lineStyle: {
          color: '#ffcc00',
          width: 3
        },
        itemStyle: {
          color: '#ffcc00'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 204, 0, 0.3)' },
              { offset: 1, color: 'rgba(255, 204, 0, 0.05)' }
            ]
          }
        }
      },
      {
        name: 'Crecimiento',
        type: 'line',
        yAxisIndex: 1,
        data: revenueData.map(item => item.growth),
        smooth: true,
        lineStyle: {
          color: '#10ac84',
          width: 2,
          type: 'dashed'
        },
        itemStyle: {
          color: '#10ac84'
        }
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
