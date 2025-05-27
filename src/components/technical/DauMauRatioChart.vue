<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Ratio DAU/MAU</ion-card-title>
      <ion-card-subtitle>Usuarios activos diarios/mensuales | Unidad: Ratio (0-1)</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div class="chart-controls">
        <div class="current-stats">
          <div class="stat-item">
            <div class="stat-value">{{ currentRatio.toFixed(3) }}</div>
            <div class="stat-label">Ratio Actual</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ averageRatio.toFixed(3) }}</div>
            <div class="stat-label">Promedio 30d</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" :class="{ 'success': trendDirection > 0, 'danger': trendDirection < 0 }">
              {{ trendDirection > 0 ? '+' : '' }}{{ (trendDirection * 100).toFixed(1) }}%
            </div>
            <div class="stat-label">Tendencia</div>
          </div>
        </div>
      </div>
      
      <div class="canvas-container">
        <canvas 
          ref="chartCanvas" 
          width="800" 
          height="300"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
        ></canvas>
        
        <div v-if="hoveredPoint" class="tooltip" :style="tooltipStyle">
          <div class="tooltip-title">{{ hoveredPoint.fullDate }}</div>
          <div class="tooltip-value">Ratio: {{ hoveredPoint.ratio.toFixed(3) }}</div>
          <div class="tooltip-details">
            <div>DAU: {{ formatNumber(hoveredPoint.dau) }}</div>
            <div>MAU: {{ formatNumber(hoveredPoint.mau) }}</div>
          </div>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';

const chartCanvas = ref(null);
const hoveredPoint = ref(null);
const tooltipStyle = ref({ left: '0px', top: '0px' });

// Generar datos DAU/MAU de los últimos 30 días
const generateDauMauData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Simular datos realistas
    const mau = 450000 + Math.random() * 50000;
    const baseRatio = 0.18 + Math.random() * 0.06; // Ratio típico 18-24%
    const dau = mau * baseRatio;
    
    data.push({
      date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      fullDate: date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
      dau: Math.round(dau),
      mau: Math.round(mau),
      ratio: dau / mau,
      x: 0,
      y: 0
    });
  }
  
  return data;
};

const data = ref(generateDauMauData());

// Computed properties
const currentRatio = computed(() => data.value[data.value.length - 1]?.ratio || 0);
const averageRatio = computed(() => {
  const sum = data.value.reduce((acc, item) => acc + item.ratio, 0);
  return sum / data.value.length;
});
const trendDirection = computed(() => {
  if (data.value.length < 8) return 0;
  const recent = data.value.slice(-7).reduce((acc, item) => acc + item.ratio, 0) / 7;
  const previous = data.value.slice(-14, -7).reduce((acc, item) => acc + item.ratio, 0) / 7;
  return (recent - previous) / previous;
});

let animationId = null;
let animationProgress = 0;

// Función para dibujar el gráfico de barras
const drawChart = () => {
  const canvas = chartCanvas.value;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  
  // Ajustar canvas para alta resolución
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  
  const width = rect.width;
  const height = rect.height;
  const padding = { top: 30, right: 60, bottom: 50, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Limpiar canvas
  ctx.clearRect(0, 0, width, height);
  
  // Configurar estilos
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Calcular escalas
  const maxRatio = Math.max(...data.value.map(d => d.ratio));
  const minRatio = Math.min(...data.value.map(d => d.ratio));
  const ratioRange = maxRatio - minRatio;
  const targetRatio = 0.22; // Objetivo del 22%
  
  const barWidth = chartWidth / data.value.length * 0.8;
  const barSpacing = chartWidth / data.value.length * 0.2;
  
  const scaleX = (index) => padding.left + (index * (barWidth + barSpacing)) + barSpacing / 2;
  const scaleY = (ratio) => padding.top + ((maxRatio - ratio) / ratioRange) * chartHeight;
  
  // Dibujar grid horizontal
  ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    
    // Etiquetas Y
    const ratio = maxRatio - (i / 5) * ratioRange;
    ctx.fillStyle = '#666';
    ctx.textAlign = 'right';
    ctx.fillText(ratio.toFixed(3), padding.left - 10, y);
  }
  
  // Dibujar línea de objetivo
  const targetY = scaleY(targetRatio);
  if (targetY >= padding.top && targetY <= height - padding.bottom) {
    ctx.strokeStyle = '#ff4757';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(padding.left, targetY);
    ctx.lineTo(width - padding.right, targetY);
    ctx.stroke();
    
    // Etiqueta objetivo
    ctx.fillStyle = '#ff4757';
    ctx.textAlign = 'left';
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Objetivo: 0.220', width - padding.right + 5, targetY);
  }
  ctx.setLineDash([]);
  
  // Dibujar barras con animación
  data.value.forEach((point, index) => {
    const progress = Math.min(1, Math.max(0, (animationProgress - index * 0.02)));
    if (progress > 0) {
      const x = scaleX(index);
      const yTop = scaleY(point.ratio);
      const yBottom = height - padding.bottom;
      const animatedHeight = (yBottom - yTop) * progress;
      const animatedYTop = yBottom - animatedHeight;
      
      // Actualizar coordenadas para hover
      point.x = x + barWidth / 2;
      point.y = yTop;
      point.barX = x;
      point.barY = animatedYTop;
      point.barWidth = barWidth;
      point.barHeight = animatedHeight;
      
      // Crear gradiente para cada barra
      const gradient = ctx.createLinearGradient(0, animatedYTop, 0, yBottom);
      
      // Color basado en si está por encima o debajo del objetivo
      if (point.ratio >= targetRatio) {
        gradient.addColorStop(0, '#ffcc00'); // Amarillo brillante
        gradient.addColorStop(1, '#ffa500'); // Naranja dorado
      } else if (point.ratio >= targetRatio * 0.9) {
        gradient.addColorStop(0, '#ffcc00'); // Amarillo
        gradient.addColorStop(1, '#ffeb3b'); // Amarillo claro
      } else {
        gradient.addColorStop(0, '#ffd54f'); // Amarillo pálido
        gradient.addColorStop(1, '#fff176'); // Amarillo muy claro
      }
      
      // Dibujar barra con bordes redondeados
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, animatedYTop, barWidth, animatedHeight, [4, 4, 0, 0]);
      ctx.fill();
      
      // Borde de la barra
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Agregar brillo en la parte superior
      if (animatedHeight > 10) {
        const shineGradient = ctx.createLinearGradient(0, animatedYTop, 0, animatedYTop + 20);
        shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = shineGradient;
        ctx.beginPath();
        ctx.roundRect(x, animatedYTop, barWidth, Math.min(20, animatedHeight), [4, 4, 0, 0]);
        ctx.fill();
      }
      
      // Valor en la parte superior de la barra (solo para barras altas)
      if (animatedHeight > 30 && index % 3 === 0) {
        ctx.fillStyle = '#333';
        ctx.font = 'bold 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(point.ratio.toFixed(3), x + barWidth / 2, animatedYTop - 8);
      }
    }
  });
  
  // Etiquetas X (mostrar cada 3 días para evitar solapamiento)
  ctx.fillStyle = '#666';
  ctx.textAlign = 'center';
  ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  data.value.forEach((point, index) => {
    if (index % 3 === 0 || index === data.value.length - 1) {
      const x = scaleX(index) + barWidth / 2;
      ctx.fillText(point.date, x, height - padding.bottom + 20);
    }
  });
  
  // Títulos de ejes
  ctx.fillStyle = '#333';
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  
  // Título eje Y
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('Ratio DAU/MAU', 0, 0);
  ctx.restore();
  
  // Título eje X
  ctx.textAlign = 'center';
  ctx.fillText('Fecha', width / 2, height - 10);
};

// Manejar hover para barras
const handleMouseMove = (event) => {
  const canvas = chartCanvas.value;
  if (!canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  // Encontrar barra más cercana
  let hoveredBar = null;
  
  data.value.forEach(point => {
    if (point.barX && point.barY && point.barWidth && point.barHeight) {
      // Verificar si el mouse está sobre la barra
      if (mouseX >= point.barX && 
          mouseX <= point.barX + point.barWidth &&
          mouseY >= point.barY && 
          mouseY <= point.barY + point.barHeight) {
        hoveredBar = point;
      }
    }
  });
  
  if (hoveredBar) {
    hoveredPoint.value = hoveredBar;
    tooltipStyle.value = {
      left: `${hoveredBar.barX + hoveredBar.barWidth / 2}px`,
      top: `${hoveredBar.barY - 10}px`
    };
  } else {
    hoveredPoint.value = null;
  }
};

const handleMouseLeave = () => {
  hoveredPoint.value = null;
};

// Función de formato
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toLocaleString('es-ES');
};

// Función de animación
const animate = () => {
  if (animationProgress < 1.2) {
    animationProgress += 0.03;
    drawChart();
    animationId = requestAnimationFrame(animate);
  }
};

// Agregar función roundRect si no está disponible
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radii) {
    this.beginPath();
    this.moveTo(x + radii[0], y);
    this.lineTo(x + width - radii[1], y);
    this.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
    this.lineTo(x + width, y + height - radii[2]);
    this.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
    this.lineTo(x + radii[3], y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
    this.lineTo(x, y + radii[0]);
    this.quadraticCurveTo(x, y, x + radii[0], y);
    this.closePath();
  };
}

onMounted(() => {
  // Iniciar animación
  animationId = requestAnimationFrame(animate);
  
  // Manejar redimensionamiento
  const resizeObserver = new ResizeObserver(() => {
    setTimeout(() => {
      animationProgress = 1.5; // Saltar animación en resize
      drawChart();
    }, 100);
  });
  
  if (chartCanvas.value) {
    resizeObserver.observe(chartCanvas.value.parentElement);
  }
  
  onUnmounted(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    resizeObserver.disconnect();
  });
});
</script>

<style scoped>
.chart-card {
  height: 100%;
  border-top: 3px solid #ffcc00;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

ion-card-content {
  height: 300px;
  position: relative;
}

.chart-controls {
  margin-bottom: 1rem;
}

.current-stats {
  display: flex;
  justify-content: space-around;
  background: linear-gradient(135deg, rgba(255, 204, 0, 0.1), rgba(255, 211, 51, 0.1));
  border-radius: 12px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffcc00;
  margin-bottom: 0.25rem;
}

.stat-value.success {
  color: #1dd1a1;
}

.stat-value.danger {
  color: #ff6b6b;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
}

.canvas-container {
  position: relative;
  width: 100%;
  height: 220px;
}

canvas {
  width: 100%;
  height: 100%;
  cursor: crosshair;
  border-radius: 8px;
}

.tooltip {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.95);
  border: 2px solid #ffcc00;
  border-radius: 8px;
  padding: 8px 12px;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 140px;
  transform: translate(-50%, -100%);
  margin-top: -10px;
}

.tooltip-title {
  font-weight: bold;
  margin-bottom: 4px;
  color: #333;
  font-size: 0.9rem;
}

.tooltip-value {
  color: #ffcc00;
  font-weight: bold;
  margin-bottom: 4px;
  font-size: 1rem;
}

.tooltip-details {
  font-size: 0.8rem;
  color: #666;
}

.tooltip-details div {
  margin-bottom: 2px;
}

@media (max-width: 768px) {
  ion-card-content {
    height: 280px;
  }
  
  .canvas-container {
    height: 200px;
  }
  
  .current-stats {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .stat-value {
    font-size: 1rem;
  }
}
</style>
