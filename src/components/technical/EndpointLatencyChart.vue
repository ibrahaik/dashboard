<template>
    <ion-card class="chart-card">
      <ion-card-header>
        <ion-card-title>Latencia en Tiempo Real</ion-card-title>
        <ion-card-subtitle>Latencia promedio APIs (actualización cada 2s) | Unidad: Milisegundos (ms)</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <div class="latency-summary">
          <div class="current-latency">
            <div class="latency-value" :class="{ 'warning': currentLatency > 120, 'danger': currentLatency > 150 }">
              {{ currentLatency }}ms
            </div>
            <div class="latency-label">Latencia Actual</div>
          </div>
        </div>
        <div ref="chartContainer" class="chart-container"></div>
      </ion-card-content>
    </ion-card>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';
  import * as echarts from 'echarts/core';
  import { LineChart } from 'echarts/charts';
  import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
  import { CanvasRenderer } from 'echarts/renderers';
  
  echarts.use([LineChart, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]);
  
  const chartContainer = ref(null);
  const currentLatency = ref(0);
  let chart = null;
  let updateInterval = null;
  
  // Datos iniciales (últimos 60 segundos)
  const timeLabels = Array(60).fill('').map((_, i) => {
    const time = new Date();
    time.setSeconds(time.getSeconds() - (59 - i));
    return time.toLocaleTimeString('es-ES', { hour12: false });
  });
  
  const latencyData = Array(60).fill(0).map(() => Math.floor(Math.random() * 80) + 90);
  const targetLine = Array(60).fill(120); // Línea roja de objetivo
  
  // Función para actualizar datos en tiempo real
  const updateRealtimeData = () => {
    // Simular nueva latencia
    const newLatency = Math.floor(Math.random() * 100) + 80;
    currentLatency.value = newLatency;
    
    // Actualizar datos del gráfico
    latencyData.shift();
    latencyData.push(newLatency);
    
    // Actualizar etiqueta de tiempo actual
    const currentTime = new Date().toLocaleTimeString('es-ES', { hour12: false });
    timeLabels.shift();
    timeLabels.push(currentTime);
    
    if (chart) {
      chart.setOption({
        xAxis: {
          data: [...timeLabels]
        },
        series: [
          {
            data: [...latencyData]
          },
          {
            data: [...targetLine]
          }
        ]
      });
    }
  };
  
  onMounted(() => {
    chart = echarts.init(chartContainer.value);
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function(params) {
          const latency = params[0];
          const target = params[1];
          return `<div style="font-weight:bold;margin-bottom:5px;">${latency.name}</div>` +
                 `<div>Latencia: <span style="color:#ffcc00;font-weight:bold;">${latency.value}ms</span></div>` +
                 `<div>Objetivo: <span style="color:#ff4757;font-weight:bold;">${target.value}ms</span></div>`;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ffcc00',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        }
      },
      legend: {
        data: ['Latencia Real', 'Objetivo (120ms)'],
        top: 'top',
        textStyle: {
          color: '#666'
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
        data: timeLabels,
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
          interval: 9 // Mostrar cada 10 segundos
        }
      },
      yAxis: {
        type: 'value',
        name: 'Latencia (ms)',
        nameTextStyle: {
          color: '#666',
          fontWeight: 'bold'
        },
        axisLabel: {
          color: '#666',
          formatter: '{value}ms'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(200, 200, 200, 0.3)'
          }
        }
      },
      series: [
        {
          name: 'Latencia Real',
          type: 'line',
          data: latencyData,
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
          name: 'Objetivo (120ms)',
          type: 'line',
          data: targetLine,
          lineStyle: {
            color: '#ff4757',
            width: 2,
            type: 'dashed'
          },
          itemStyle: {
            color: '#ff4757'
          },
          symbol: 'none'
        }
      ]
    };
    
    chart.setOption(option);
    
    // Inicializar valor actual
    currentLatency.value = latencyData[latencyData.length - 1];
    
    // Iniciar actualización en tiempo real cada 2 segundos
    updateInterval = setInterval(updateRealtimeData, 2000);
    
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
    position: relative;
  }
  
  ion-card-content {
    height: 300px;
    position: relative;
  }
  
  .latency-summary {
    position: absolute;
    top: 10px;
    right: 20px;
    z-index: 10;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    padding: 8px 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #ffcc00;
  }
  
  .current-latency {
    text-align: center;
  }
  
  .latency-value {
    font-size: 1.2rem;
    font-weight: bold;
    color: #ffcc00;
    transition: color 0.3s ease;
  }
  
  .latency-value.warning {
    color: #ff9f43;
  }
  
  .latency-value.danger {
    color: #ff4757;
  }
  
  .latency-label {
    font-size: 0.7rem;
    color: #666;
  }
  
  .chart-container {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 5;
  }
  </style>
  