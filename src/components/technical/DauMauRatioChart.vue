<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>👥 KPI: Ratio DAU/MAU</ion-card-title>
      <ion-card-subtitle>Usuarios activos diarios/mensuales | Unidad: Ratio (0-1)</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div class="canvas-container">
        <svg ref="svgChart" width="100%" height="100%" viewBox="0 0 800 300"></svg>
        <div v-if="hoveredPoint" class="tooltip" :style="tooltipStyle">
          <div class="tooltip-title">{{ hoveredPoint.date }}</div>
          <div class="tooltip-value">Ratio: {{ hoveredPoint.ratio.toFixed(3) }}</div>
          <div class="tooltip-details">
            <div>DAU: {{ hoveredPoint.dau.toLocaleString() }}</div>
            <div>MAU: {{ hoveredPoint.mau.toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';

const svgChart = ref(null);
const hoveredPoint = ref(null);
const tooltipStyle = ref({
  left: '0px',
  top: '0px'
});

// Datos DAU/MAU de los últimos 30 días
const generateDauMauData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    const mau = 450000 + Math.random() * 50000;
    const dau = mau * (0.15 + Math.random() * 0.1); // Ratio típico 15-25%
    
    data.push({
      date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      dau: Math.round(dau),
      mau: Math.round(mau),
      ratio: dau / mau
    });
  }
  
  return data;
};

const data = generateDauMauData();
let pointCoordinates = [];

// Función para dibujar el gráfico SVG personalizado
const drawChart = () => {
  const svg = svgChart.value;
  if (!svg) return;
  
  // Limpiar SVG
  svg.innerHTML = '';
  
  const width = 800;
  const height = 300;
  const padding = { top: 20, right: 40, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Escalas
  const maxRatio = Math.max(...data.map(d => d.ratio));
  const minRatio = Math.min(...data.map(d => d.ratio));
  const scaleX = (index) => padding.left + (index / (data.length - 1)) * chartWidth;
  const scaleY = (value) => height - padding.bottom - ((value - minRatio) / (maxRatio - minRatio)) * chartHeight;
  
  // Crear gradiente
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  gradient.setAttribute('id', 'areaGradient');
  gradient.setAttribute('x1', '0%');
  gradient.setAttribute('y1', '0%');
  gradient.setAttribute('x2', '0%');
  gradient.setAttribute('y2', '100%');
  
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#ffcc00');
  stop1.setAttribute('stop-opacity', '0.7');
  
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#ffcc00');
  stop2.setAttribute('stop-opacity', '0.1');
  
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  svg.appendChild(defs);
  
  // Líneas de cuadrícula
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartHeight / 5) * i;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', padding.left);
    line.setAttribute('y1', y);
    line.setAttribute('x2', width - padding.right);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(200, 200, 200, 0.3)');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
    
    // Etiquetas Y
    const value = maxRatio - (i / 5) * (maxRatio - minRatio);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', padding.left - 10);
    text.setAttribute('y', y + 4);
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('fill', '#666');
    text.setAttribute('font-size', '12');
    text.textContent = value.toFixed(3);
    svg.appendChild(text);
  }
  
  // Crear path para el área
  let pathData = `M ${scaleX(0)} ${height - padding.bottom}`;
  
  pointCoordinates = [];
  data.forEach((point, index) => {
    const x = scaleX(index);
    const y = scaleY(point.ratio);
    
    if (index === 0) {
      pathData += ` L ${x} ${y}`;
    } else {
      pathData += ` L ${x} ${y}`;
    }
    
    pointCoordinates.push({ x, y, data: point });
  });
  
  pathData += ` L ${scaleX(data.length - 1)} ${height - padding.bottom} Z`;
  
  // Dibujar área
  const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  area.setAttribute('d', pathData);
  area.setAttribute('fill', 'url(#areaGradient)');
  svg.appendChild(area);
  
  // Dibujar línea
  let lineData = '';
  data.forEach((point, index) => {
    const x = scaleX(index);
    const y = scaleY(point.ratio);
    
    if (index === 0) {
      lineData += `M ${x} ${y}`;
    } else {
      lineData += ` L ${x} ${y}`;
    }
  });
  
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  line.setAttribute('d', lineData);
  line.setAttribute('stroke', '#ffcc00');
  line.setAttribute('stroke-width', '3');
  line.setAttribute('fill', 'none');
  svg.appendChild(line);
  
  // Dibujar puntos
  pointCoordinates.forEach((point) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', point.x);
    circle.setAttribute('cy', point.y);
    circle.setAttribute('r', '4');
    circle.setAttribute('fill', '#ffcc00');
    circle.setAttribute('stroke', '#fff');
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);
  });
  
  // Etiquetas X (cada 5 días)
  data.forEach((point, index) => {
    if (index % 5 === 0) {
      const x = scaleX(index);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', height - padding.bottom + 20);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#666');
      text.setAttribute('font-size', '11');
      text.textContent = point.date;
      svg.appendChild(text);
    }
  });
  
  // Título del eje Y
  const yTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  yTitle.setAttribute('x', 20);
  yTitle.setAttribute('y', height / 2);
  yTitle.setAttribute('text-anchor', 'middle');
  yTitle.setAttribute('fill', '#666');
  yTitle.setAttribute('font-size', '12');
  yTitle.setAttribute('font-weight', 'bold');
  yTitle.setAttribute('transform', `rotate(-90, 20, ${height / 2})`);
  yTitle.textContent = 'Ratio DAU/MAU';
  svg.appendChild(yTitle);
  
  // Título del eje X
  const xTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xTitle.setAttribute('x', width / 2);
  xTitle.setAttribute('y', height - 5);
  xTitle.setAttribute('text-anchor', 'middle');
  xTitle.setAttribute('fill', '#666');
  xTitle.setAttribute('font-size', '12');
  xTitle.setAttribute('font-weight', 'bold');
  xTitle.textContent = 'Fecha';
  svg.appendChild(xTitle);
};

// Función para manejar el movimiento del ratón
const handleMouseMove = (event) => {
  const svg = svgChart.value;
  if (!svg) return;
  
  const rect = svg.getBoundingClientRect();
  const mouseX = (event.clientX - rect.left) * (800 / rect.width);
  const mouseY = (event.clientY - rect.top) * (300 / rect.height);
  
  // Encontrar el punto más cercano
  let closestPoint = null;
  let minDistance = Infinity;
  
  pointCoordinates.forEach(point => {
    const distance = Math.sqrt(Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2));
    if (distance < 20 && distance < minDistance) {
      minDistance = distance;
      closestPoint = point;
    }
  });
  
  if (closestPoint) {
    hoveredPoint.value = closestPoint.data;
    tooltipStyle.value = {
      left: `${(closestPoint.x / 800) * 100}%`,
      top: `${(closestPoint.y / 300) * 100}%`
    };
  } else {
    hoveredPoint.value = null;
  }
};

onMounted(() => {
  drawChart();
  
  const svg = svgChart.value;
  if (svg) {
    svg.addEventListener('mousemove', handleMouseMove);
    svg.addEventListener('mouseleave', () => {
      hoveredPoint.value = null;
    });
  }
  
  // Manejar cambios de tamaño
  const resizeObserver = new ResizeObserver(() => {
    drawChart();
  });
  
  if (svg.parentElement) {
    resizeObserver.observe(svg.parentElement);
  }
  
  onUnmounted(() => {
    if (svg) {
      svg.removeEventListener('mousemove', handleMouseMove);
    }
    resizeObserver.disconnect();
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

.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
}

svg {
  cursor: crosshair;
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
  transform: translate(-50%, -100%);
  margin-top: -10px;
}

.tooltip-title {
  font-weight: bold;
  margin-bottom: 4px;
  color: #333;
}

.tooltip-value {
  color: #ffcc00;
  font-weight: bold;
  margin-bottom: 4px;
}

.tooltip-details {
  font-size: 0.85rem;
  color: #666;
}
</style>
