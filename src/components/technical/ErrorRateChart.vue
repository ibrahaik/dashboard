<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Tasa de Errores por Versión</ion-card-title>
      <ion-card-subtitle>Gráfico personalizado sin librerías</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div class="canvas-container">
        <canvas ref="chartCanvas" width="800" height="400"></canvas>
        <div v-if="hoveredVersion" class="tooltip" :style="tooltipStyle">
          <div class="tooltip-title">Versión {{ hoveredVersion.version }}</div>
          <div class="tooltip-value">{{ hoveredVersion.errorRate.toFixed(2) }}% errores</div>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';

const chartCanvas = ref(null);
const hoveredVersion = ref(null);
const tooltipStyle = ref({
  left: '0px',
  top: '0px'
});

// Datos simulados de errores por versión
const errorData = [
  { version: '1.0.0', errorRate: 4.2 },
  { version: '1.1.0', errorRate: 3.8 },
  { version: '1.2.0', errorRate: 2.9 },
  { version: '1.3.0', errorRate: 3.1 },
  { version: '1.4.0', errorRate: 2.5 },
  { version: '1.5.0', errorRate: 1.8 },
  { version: '1.6.0', errorRate: 1.2 },
  { version: '1.7.0', errorRate: 0.9 },
  { version: '1.8.0', errorRate: 0.7 },
  { version: '1.9.0', errorRate: 0.5 }
];

// Coordenadas de los puntos en el gráfico
let pointCoordinates = [];

// Función para dibujar el gráfico
const drawChart = () => {
  const canvas = chartCanvas.value;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Limpiar el canvas
  ctx.clearRect(0, 0, width, height);
  
  // Configuración del gráfico
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Encontrar el valor máximo para escalar el eje Y
  const maxErrorRate = Math.max(...errorData.map(d => d.errorRate)) * 1.2;
  
  // Función para convertir valores a coordenadas
  const scaleX = (index) => padding.left + (index / (errorData.length - 1)) * chartWidth;
  const scaleY = (value) => height - padding.bottom - (value / maxErrorRate) * chartHeight;
  
  // Dibujar el eje X
  ctx.beginPath();
  ctx.moveTo(padding.left, height - padding.bottom);
  ctx.lineTo(width - padding.right, height - padding.bottom);
  ctx.strokeStyle = '#999';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Dibujar el eje Y
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, height - padding.bottom);
  ctx.strokeStyle = '#999';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Dibujar líneas de cuadrícula horizontales
  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const y = padding.top + (chartHeight / yTicks) * i;
    const value = maxErrorRate - (i / yTicks) * maxErrorRate;
    
    // Línea de cuadrícula
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Etiqueta del eje Y
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(value.toFixed(1) + '%', padding.left - 10, y);
  }
  
  // Dibujar etiquetas del eje X (versiones)
  errorData.forEach((data, index) => {
    const x = scaleX(index);
    const y = height - padding.bottom;
    
    // Etiqueta del eje X
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(data.version, x, y + 10);
  });
  
  // Dibujar el área bajo la curva
  ctx.beginPath();
  ctx.moveTo(scaleX(0), height - padding.bottom);
  
  // Guardar las coordenadas de los puntos para la interactividad
  pointCoordinates = [];
  
  errorData.forEach((data, index) => {
    const x = scaleX(index);
    const y = scaleY(data.errorRate);
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    
    // Guardar coordenadas
    pointCoordinates.push({ x, y, data });
  });
  
  // Completar el área
  ctx.lineTo(scaleX(errorData.length - 1), height - padding.bottom);
  ctx.closePath();
  
  // Rellenar el área
  const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  gradient.addColorStop(0, 'rgba(255, 204, 0, 0.7)');
  gradient.addColorStop(1, 'rgba(255, 204, 0, 0.1)');
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Dibujar la línea
  ctx.beginPath();
  errorData.forEach((data, index) => {
    const x = scaleX(index);
    const y = scaleY(data.errorRate);
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.strokeStyle = '#ffcc00';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Dibujar puntos
  errorData.forEach((data, index) => {
    const x = scaleX(index);
    const y = scaleY(data.errorRate);
    
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ffcc00';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  // Título del eje Y
  ctx.save();
  ctx.translate(padding.left - 40, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#666';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Tasa de Errores (%)', 0, 0);
  ctx.restore();
  
  // Título del eje X
  ctx.fillStyle = '#666';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Versión de la App', width / 2, height - 5);
};

// Función para manejar el movimiento del ratón
const handleMouseMove = (event) => {
  const canvas = chartCanvas.value;
  if (!canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  // Comprobar si el ratón está sobre algún punto
  let found = false;
  for (const point of pointCoordinates) {
    const distance = Math.sqrt(Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2));
    if (distance < 20) {
      hoveredVersion.value = point.data;
      tooltipStyle.value = {
        left: `${point.x + 10}px`,
        top: `${point.y - 40}px`
      };
      found = true;
      break;
    }
  }
  
  if (!found) {
    hoveredVersion.value = null;
  }
};

// Función para manejar el cambio de tamaño
const handleResize = () => {
  const canvas = chartCanvas.value;
  if (!canvas) return;
  
  const container = canvas.parentElement;
  const ratio = window.devicePixelRatio || 1;
  
  // Ajustar el tamaño del canvas al contenedor
  canvas.width = container.clientWidth * ratio;
  canvas.height = container.clientHeight * ratio;
  
  // Escalar el contexto
  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);
  
  // Ajustar el estilo del canvas
  canvas.style.width = container.clientWidth + 'px';
  canvas.style.height = container.clientHeight + 'px';
  
  // Redibujar el gráfico
  drawChart();
};

onMounted(() => {
  // Inicializar el canvas
  const canvas = chartCanvas.value;
  if (canvas) {
    canvas.addEventListener('mousemove', handleMouseMove);
    
    // Configurar ResizeObserver para manejar cambios de tamaño
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas.parentElement);
    
    // Dibujar el gráfico inicial
    handleResize();
    
    // Limpiar al desmontar
    onUnmounted(() => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
    });
  }
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

.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.tooltip {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #ffcc00;
  border-radius: 8px;
  padding: 8px 12px;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 120px;
  transition: all 0.1s ease;
}

.tooltip-title {
  font-weight: bold;
  margin-bottom: 4px;
  color: #333;
}

.tooltip-value {
  color: #666;
}
</style>
