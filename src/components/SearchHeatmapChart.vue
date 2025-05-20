<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Mapa de Calor de Búsquedas</ion-card-title>
      <ion-card-subtitle>Por hora y día de la semana</ion-card-subtitle>
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
import { HeatmapChart } from 'echarts/charts';
import { TooltipComponent, VisualMapComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([HeatmapChart, TooltipComponent, VisualMapComponent, GridComponent, CanvasRenderer]);

const chartContainer = ref(null);
let chart = null;

// Generar datos simulados para el mapa de calor
const generateHeatmapData = () => {
  const hours = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  const data = [];
  for (let i = 0; i < days.length; i++) {
    for (let j = 0; j < hours.length; j++) {
      // Simular patrones realistas:
      // - Más búsquedas en horario laboral (8-18h)
      // - Más búsquedas en días laborables
      // - Pico en lunes por la mañana y viernes por la tarde
      let baseValue = 0;
      
      // Horario laboral tiene más búsquedas
      if (j >= 4 && j <= 8) {
        baseValue += 30;
      }
      
      // Días laborables tienen más búsquedas
      if (i < 5) {
        baseValue += 20;
      }
      
      // Pico en lunes por la mañana
      if (i === 0 && j === 4) {
        baseValue += 40;
      }
      
      // Pico en viernes por la tarde
      if (i === 4 && j === 8) {
        baseValue += 50;
      }
      
      // Añadir aleatoriedad
      const value = baseValue + Math.round(Math.random() * 30);
      
      data.push([j, i, value]);
    }
  }
  
  return {
    hours,
    days,
    data
  };
};

onMounted(() => {
  const { hours, days, data } = generateHeatmapData();
  chart = echarts.init(chartContainer.value);
  
  const option = {
    tooltip: {
      position: 'top',
      formatter: function (params) {
        return `${days[params.value[1]]}, ${hours[params.value[0]]}<br>Búsquedas: ${params.value[2]}`;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#ffcc00',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      }
    },
    grid: {
      top: '10%',
      left: '3%',
      right: '5%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: {
        show: true
      },
      axisLabel: {
        fontSize: 10,
        color: '#666',
        interval: 1,
        rotate: 45
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: {
        show: true
      },
      axisLabel: {
        color: '#666'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      color: ['#ffcc00', '#ffd633', '#ffe066', '#ffeb99', '#fff5cc'],
      textStyle: {
        color: '#666'
      }
    },
    series: [{
      name: 'Búsquedas',
      type: 'heatmap',
      data: data,
      label: {
        show: false
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
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
