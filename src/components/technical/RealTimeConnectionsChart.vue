<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Conexiones Activas por Región</ion-card-title>
      <ion-card-subtitle>Actualización en tiempo real</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div class="connections-summary">
        <div class="total-connections">
          <div class="count">{{ totalConnections }}</div>
          <div class="label">conexiones totales</div>
        </div>
      </div>
      <div ref="chartContainer" class="chart-container"></div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer]);

const chartContainer = ref(null);
const connectionsData = ref([
  { region: 'Europa', connections: 245 },
  { region: 'América', connections: 187 },
  { region: 'Asia', connections: 103 },
  { region: 'África', connections: 42 },
  { region: 'Oceanía', connections: 28 }
]);
const totalConnections = computed(() => {
  return connectionsData.value.reduce((sum, item) => sum + item.connections, 0);
});

let chart = null;
let updateInterval = null;

// Función para actualizar los datos en tiempo real
const updateConnectionsData = () => {
  // Actualizar cada región con una fluctuación aleatoria
  connectionsData.value = connectionsData.value.map(item => {
    // Generar una fluctuación entre -10% y +15%
    const fluctuation = (Math.random() * 0.25) - 0.1;
    const newConnections = Math.max(1, Math.round(item.connections * (1 + fluctuation)));
    
    return {
      region: item.region,
      connections: newConnections
    };
  });
  
  // Actualizar el gráfico
  if (chart) {
    chart.setOption({
      series: [{
        data: connectionsData.value.map(item => ({
          value: item.connections,
          name: item.region
        }))
      }]
    });
  }
};

onMounted(() => {
  chart = echarts.init(chartContainer.value);
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} conexiones',
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
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: connectionsData.value.map(item => item.region),
      axisLine: {
        lineStyle: {
          color: '#ddd'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666',
        rotate: 0
      }
    },
    yAxis: {
      type: 'value',
      name: 'Conexiones',
      nameTextStyle: {
        color: '#666'
      },
      axisLine: {
        show: true,
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
    series: [{
      type: 'bar',
      data: connectionsData.value.map(item => ({
        value: item.connections,
        name: item.region,
        itemStyle: {
          color: function(params) {
            // Colores diferentes para cada región
            const colors = ['#ffcc00', '#ff9f43', '#ee5253', '#0abde3', '#10ac84'];
            return colors[params.dataIndex % colors.length];
          }
        }
      })),
      barWidth: '40%',
      label: {
        show: true,
        position: 'top',
        color: '#666'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        }
      },
      animationDuration: 300,
      animationEasing: 'cubicOut'
    }]
  };
  
  chart.setOption(option);
  
  // Iniciar actualización en tiempo real
  updateInterval = setInterval(updateConnectionsData, 1000);
  
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
    if (updateInterval) {
      clearInterval(updateInterval);
    }
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
  position: relative;
}

.connections-summary {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #ffcc00;
}

.total-connections {
  text-align: center;
}

.count {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffcc00;
}

.label {
  font-size: 0.8rem;
  color: #666;
}

.chart-container {
  width: 100%;
  height: 100%;
}
</style>
