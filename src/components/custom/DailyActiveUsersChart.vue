<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>👥 KPI: Usuarios Activos Diarios</ion-card-title>
      <ion-card-subtitle>Evolución del engagement (últimos 30 días) | Objetivo: 95,000 DAU</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div class="chart-controls">
        <div class="current-stats">
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(currentDAU) }}</div>
            <div class="stat-label">DAU Actual</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(averageDAU) }}</div>
            <div class="stat-label">Promedio 30d</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" :class="{ 'success': growthRate > 0, 'danger': growthRate < 0 }">
              {{ growthRate > 0 ? '+' : '' }}{{ growthRate.toFixed(1) }}%
            </div>
            <div class="stat-label">Crecimiento</div>
          </div>
        </div>
      </div>
      
      <div class="canvas-container">
        <canvas 
          ref="chartCanvas" 
          width="800" 
          height="400"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
        ></canvas>
        
        <div v-if="hoveredPoint" class="tooltip" :style="tooltipStyle">
          <div class="tooltip-title">{{ hoveredPoint.date }}</div>
          <div class="tooltip-value">{{ formatNumber(hoveredPoint.value) }} usuarios</div>
          <div class="tooltip-change" :class="{ 'positive': hoveredPoint.change > 0, 'negative': hoveredPoint.change < 0 }">
            {{ hoveredPoint.change > 0 ? '+' : '' }}{{ hoveredPoint.change.toFixed(1) }}% vs día anterior
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

const generateDAUData = () => {
  const data = [];
  const today = new Date();
  let baseValue = 85000;
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendFactor = isWeekend ? 0.7 : 1.0;
    
    const trendFactor = 1 + (29 - i) * 0.002;
    const randomFactor = 0.9 + Math.random() * 0.2;
    
    const value = Math.round(baseValue * weekendFactor * trendFactor * randomFactor);
    
    const prevValue = data.length > 0 ? data[data.length - 1].value : value;
    const change = ((value - prevValue) / prevValue) * 100;
    
    data.push({
      date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      fullDate: date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
      value: value,
      change: isNaN(change) ? 0 : change,
      x: 0,
      y: 0
    });
  }
  
  return data;
};

const data = ref(generateDAUData());
const currentDAU = computed(() => data.value[data.value.length - 1]?.value || 0);
const averageDAU = computed(() => {
  const sum = data.value.reduce((acc, item) => acc + item.value, 0);
  return Math.round(sum / data.value.length);
});
const growthRate = computed(() => {
  if (data.value.length < 2) return 0;
  const current = data.value[data.value.length - 1].value;
  const previous = data.value[data.value.length - 8].value; 
  return ((current - previous) / previous) * 100;
});

let animationId = null;
let animationProgress = 0;

const drawChart = () => {
  const canvas = chartCanvas.value;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  
  const width = rect.width;
  const height = rect.height;
  const padding = { top: 40, right: 60, bottom: 60, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  ctx.clearRect(0, 0, width, height);
  
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const maxValue = Math.max(...data.value.map(d => d.value));
  const minValue = Math.min(...data.value.map(d => d.value));
  const valueRange = maxValue - minValue;
  const targetValue = 95000;
  
  const scaleX = (index) => padding.left + (index / (data.value.length - 1)) * chartWidth;
  const scaleY = (value) => padding.top + ((maxValue - value) / valueRange) * chartHeight;
  
  ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    
    const value = maxValue - (i / 5) * valueRange;
    ctx.fillStyle = '#666';
    ctx.textAlign = 'right';
    ctx.fillText(formatNumber(Math.round(value)), padding.left - 10, y);
  }
  
  const targetY = scaleY(targetValue);
  if (targetY >= padding.top && targetY <= height - padding.bottom) {
    ctx.strokeStyle = '#ff4757';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(padding.left, targetY);
    ctx.lineTo(width - padding.right, targetY);
    ctx.stroke();
    
    ctx.fillStyle = '#ff4757';
    ctx.textAlign = 'left';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Objetivo: 95K', width - padding.right + 5, targetY);
  }
  ctx.setLineDash([]);
  
  const animatedData = data.value.map((point, index) => {
    const progress = Math.min(1, Math.max(0, (animationProgress - index * 0.02)));
    const x = scaleX(index);
    const y = scaleY(point.value);
    const animatedY = height - padding.bottom - (height - padding.bottom - y) * progress;
    
    return { ...point, x, y: animatedY, originalY: y };
  });
  
  data.value.forEach((point, index) => {
    point.x = animatedData[index].x;
    point.y = animatedData[index].originalY;
  });
  
  if (animationProgress > 0) {
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(255, 204, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 204, 0, 0.05)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(animatedData[0].x, height - padding.bottom);
    
    animatedData.forEach((point, index) => {
      if (index === 0) {
        ctx.lineTo(point.x, point.y);
      } else {
        const prevPoint = animatedData[index - 1];
        const cpx = (prevPoint.x + point.x) / 2;
        ctx.quadraticCurveTo(cpx, prevPoint.y, point.x, point.y);
      }
    });
    
    ctx.lineTo(animatedData[animatedData.length - 1].x, height - padding.bottom);
    ctx.closePath();
    ctx.fill();
  }
  
  ctx.strokeStyle = '#ffcc00';
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  animatedData.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      const prevPoint = animatedData[index - 1];
      const cpx = (prevPoint.x + point.x) / 2;
      ctx.quadraticCurveTo(cpx, prevPoint.y, point.x, point.y);
    }
  });
  ctx.stroke();
  
  animatedData.forEach((point, index) => {
    const progress = Math.min(1, Math.max(0, (animationProgress - index * 0.02)));
    if (progress > 0) {
      ctx.fillStyle = '#ffcc00';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4 * progress, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
  
  ctx.fillStyle = '#666';
  ctx.textAlign = 'center';
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  data.value.forEach((point, index) => {
    if (index % 5 === 0 || index === data.value.length - 1) {
      ctx.fillText(point.date, point.x, height - padding.bottom + 20);
    }
  });
  
  ctx.fillStyle = '#333';
  ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('Usuarios Activos Diarios', 0, 0);
  ctx.restore();
  
  ctx.textAlign = 'center';
  ctx.fillText('Fecha', width / 2, height - 10);
};

const animate = () => {
  if (animationProgress < 1.5) {
    animationProgress += 0.02;
    drawChart();
    animationId = requestAnimationFrame(animate);
  }
};


const handleMouseMove = (event) => {
  const canvas = chartCanvas.value;
  if (!canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  let closestPoint = null;
  let minDistance = Infinity;
  
  data.value.forEach(point => {
    const distance = Math.sqrt(Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2));
    if (distance < 30 && distance < minDistance) {
      minDistance = distance;
      closestPoint = point;
    }
  });
  
  if (closestPoint) {
    hoveredPoint.value = closestPoint;
    tooltipStyle.value = {
      left: `${closestPoint.x}px`,
      top: `${closestPoint.y - 10}px`
    };
  } else {
    hoveredPoint.value = null;
  }
};

const handleMouseLeave = () => {
  hoveredPoint.value = null;
};

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toLocaleString('es-ES');
};

onMounted(() => {
  animationId = requestAnimationFrame(animate);
  
  const resizeObserver = new ResizeObserver(() => {
    setTimeout(() => {
      animationProgress = 1.5; 
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
  border-top: 3px solid #1dd1a1;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

ion-card-content {
  height: 500px;
  position: relative;
}

.chart-controls {
  margin-bottom: 1rem;
}

.current-stats {
  display: flex;
  justify-content: space-around;
  background: linear-gradient(135deg, rgba(29, 209, 161, 0.1), rgba(16, 172, 132, 0.1));
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1dd1a1;
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
  height: 400px;
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
  border: 2px solid #1dd1a1;
  border-radius: 8px;
  padding: 8px 12px;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 150px;
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
  color: #1dd1a1;
  font-weight: bold;
  margin-bottom: 4px;
  font-size: 1rem;
}

.tooltip-change {
  font-size: 0.8rem;
  font-weight: 600;
}

.tooltip-change.positive {
  color: #1dd1a1;
}

.tooltip-change.negative {
  color: #ff6b6b;
}

@media (max-width: 768px) {
  ion-card-content {
    height: 400px;
  }
  
  .canvas-container {
    height: 300px;
  }
  
  .current-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .stat-value {
    font-size: 1.2rem;
  }
}
</style>
