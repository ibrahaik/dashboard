<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Ingresos Mensuales</ion-card-title>
      <ion-card-subtitle>Comparativa vs objetivos mensuales | Unidad: Millones de Euros (€M)</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div class="revenue-summary">
        <div class="summary-stats">
          <div class="stat-item primary">
            <div class="stat-value">€{{ currentRevenue.toFixed(1) }}M</div>
            <div class="stat-label">Ingresos Diciembre</div>
          </div>
          <div class="stat-item target">
            <div class="stat-value">€{{ targetRevenue.toFixed(1) }}M</div>
            <div class="stat-label">Objetivo Diciembre</div>
          </div>
          <div class="stat-item" :class="{ 'success': achievementPercentage >= 100, 'warning': achievementPercentage >= 90, 'danger': achievementPercentage < 90 }">
            <div class="stat-value">{{ achievementPercentage.toFixed(1) }}%</div>
            <div class="stat-label">Cumplimiento</div>
          </div>
        </div>
      </div>
      
      <div class="chart-container">
        <canvas 
          ref="chartCanvas" 
          width="800" 
          height="200"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
        ></canvas>
        
        <div v-if="hoveredBar" class="tooltip" :style="tooltipStyle">
          <div class="tooltip-title">{{ hoveredBar.month }}</div>
          <div class="tooltip-real">Real: €{{ hoveredBar.revenue.toFixed(1) }}M</div>
          <div class="tooltip-target">Objetivo: €{{ hoveredBar.target.toFixed(1) }}M</div>
          <div class="tooltip-diff" :class="{ 'positive': hoveredBar.difference >= 0, 'negative': hoveredBar.difference < 0 }">
            {{ hoveredBar.difference >= 0 ? '+' : '' }}€{{ hoveredBar.difference.toFixed(1) }}M
          </div>
        </div>
      </div>
    
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon } from '@ionic/vue';
import { trendingUpOutline, trendingDownOutline, removeOutline } from 'ionicons/icons';

const chartCanvas = ref(null);
const hoveredBar = ref(null);
const tooltipStyle = ref({ left: '0px', top: '0px' });

const monthlyData = ref([
  { month: 'Jul', revenue: 3.8, target: 3.6, achievement: 105.6, difference: 0.2 },
  { month: 'Ago', revenue: 3.65, target: 3.7, achievement: 98.6, difference: -0.05 },
  { month: 'Sep', revenue: 3.75, target: 3.8, achievement: 98.7, difference: -0.05 },
  { month: 'Oct', revenue: 3.9, target: 3.9, achievement: 100.0, difference: 0.0 },
  { month: 'Nov', revenue: 3.85, target: 4.0, achievement: 96.3, difference: -0.15 },
  { month: 'Dic', revenue: 4.2, target: 4.1, achievement: 102.4, difference: 0.1 }
]);

const currentRevenue = computed(() => monthlyData.value[monthlyData.value.length - 1]?.revenue || 0);
const targetRevenue = computed(() => monthlyData.value[monthlyData.value.length - 1]?.target || 0);
const achievementPercentage = computed(() => (currentRevenue.value / targetRevenue.value) * 100);

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
  const padding = { top: 20, right: 40, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  ctx.clearRect(0, 0, width, height);
  
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const maxValue = Math.max(...monthlyData.value.map(d => Math.max(d.revenue, d.target)));
  const minValue = Math.min(...monthlyData.value.map(d => Math.min(d.revenue, d.target))) * 0.9;
  const valueRange = maxValue - minValue;
  
  const barGroupWidth = chartWidth / monthlyData.value.length;
  const barWidth = barGroupWidth * 0.35;
  const barSpacing = barGroupWidth * 0.1;
  
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
    ctx.fillText(`€${value.toFixed(1)}M`, padding.left - 10, y);
  }
  
  monthlyData.value.forEach((month, index) => {
    const progress = Math.min(1, Math.max(0, (animationProgress - index * 0.1)));
    if (progress > 0) {
      const groupX = padding.left + (index * barGroupWidth) + (barGroupWidth * 0.15);
      
      const targetHeight = (month.target - minValue) / valueRange * chartHeight * progress;
      const targetY = height - padding.bottom - targetHeight;
      
      ctx.fillStyle = '#e9ecef';
      ctx.fillRect(groupX, targetY, barWidth, targetHeight);
      
      ctx.strokeStyle = '#dee2e6';
      ctx.lineWidth = 1;
      ctx.strokeRect(groupX, targetY, barWidth, targetHeight);
      
      const revenueHeight = (month.revenue - minValue) / valueRange * chartHeight * progress;
      const revenueY = height - padding.bottom - revenueHeight;
      
      let color;
      if (month.achievement >= 100) {
        color = '#1dd1a1'; 
      } else if (month.achievement >= 90) {
        color = '#ffcc00'; 
      } else {
        color = '#ff6b6b'; 
      }
      
      const gradient = ctx.createLinearGradient(0, revenueY, 0, height - padding.bottom);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color + '80'); 
      
      ctx.fillStyle = gradient;
      ctx.fillRect(groupX + barWidth + barSpacing, revenueY, barWidth, revenueHeight);
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(groupX + barWidth + barSpacing, revenueY, barWidth, revenueHeight);
      
      month.targetBarX = groupX;
      month.targetBarY = targetY;
      month.targetBarWidth = barWidth;
      month.targetBarHeight = targetHeight;
      
      month.revenueBarX = groupX + barWidth + barSpacing;
      month.revenueBarY = revenueY;
      month.revenueBarWidth = barWidth;
      month.revenueBarHeight = revenueHeight;
      
      if (progress > 0.8) {
        ctx.fillStyle = '#666';
        ctx.font = '9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        
        ctx.fillText(`€${month.target.toFixed(1)}M`, groupX + barWidth/2, targetY - 8);
        
        ctx.fillStyle = color;
        ctx.font = 'bold 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`€${month.revenue.toFixed(1)}M`, groupX + barWidth + barSpacing + barWidth/2, revenueY - 8);
      }
    }
  });
  
  ctx.fillStyle = '#666';
  ctx.textAlign = 'center';
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  monthlyData.value.forEach((month, index) => {
    const x = padding.left + (index * barGroupWidth) + (barGroupWidth / 2);
    ctx.fillText(month.month, x, height - padding.bottom + 20);
  });
  
  ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'left';
  
  ctx.fillStyle = '#e9ecef';
  ctx.fillRect(padding.left, padding.top - 15, 12, 8);
  ctx.fillStyle = '#666';
  ctx.fillText('Objetivo', padding.left + 18, padding.top - 11);
  
  
  ctx.fillStyle = '#1dd1a1';
  ctx.fillRect(padding.left + 80, padding.top - 15, 12, 8);
  ctx.fillStyle = '#666';
  ctx.fillText('Real', padding.left + 98, padding.top - 11);
};

const animate = () => {
  if (animationProgress < 1.5) {
    animationProgress += 0.05;
    drawChart();
    animationId = requestAnimationFrame(animate);
  }
};

// Manejar hover
const handleMouseMove = (event) => {
  const canvas = chartCanvas.value;
  if (!canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  // Encontrar barra bajo el cursor
  let hoveredMonth = null;
  
  monthlyData.value.forEach(month => {
    // Verificar hover sobre barra de objetivo
    if (month.targetBarX && mouseX >= month.targetBarX && 
        mouseX <= month.targetBarX + month.targetBarWidth &&
        mouseY >= month.targetBarY && 
        mouseY <= month.targetBarY + month.targetBarHeight) {
      hoveredMonth = month;
    }
    
    // Verificar hover sobre barra de ingresos
    if (month.revenueBarX && mouseX >= month.revenueBarX && 
        mouseX <= month.revenueBarX + month.revenueBarWidth &&
        mouseY >= month.revenueBarY && 
        mouseY <= month.revenueBarY + month.revenueBarHeight) {
      hoveredMonth = month;
    }
  });
  
  if (hoveredMonth) {
    hoveredBar.value = hoveredMonth;
    tooltipStyle.value = {
      left: `${mouseX}px`,
      top: `${mouseY - 10}px`
    };
  } else {
    hoveredBar.value = null;
  }
};

const handleMouseLeave = () => {
  hoveredBar.value = null;
};

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

.revenue-summary {
  margin-bottom: 1rem;
}

.summary-stats {
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
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.stat-item.primary .stat-value {
  color: #ffcc00;
}

.stat-item.target .stat-value {
  color: #666;
}

.stat-item.success .stat-value {
  color: #1dd1a1;
}

.stat-item.warning .stat-value {
  color: #ffcc00;
}

.stat-item.danger .stat-value {
  color: #ff6b6b;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 140px;
  margin-bottom: 1rem;
}

canvas {
  width: 100%;
  height: 100%;
  cursor: crosshair;
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
  min-width: 120px;
  transform: translate(-50%, -100%);
  margin-top: -10px;
}

.tooltip-title {
  font-weight: bold;
  margin-bottom: 4px;
  color: #333;
  font-size: 0.9rem;
}

.tooltip-real {
  color: #1dd1a1;
  font-weight: bold;
  margin-bottom: 2px;
  font-size: 0.9rem;
}

.tooltip-target {
  color: #666;
  font-size: 0.8rem;
  margin-bottom: 2px;
}

.tooltip-diff {
  font-size: 0.8rem;
  font-weight: 600;
}

.tooltip-diff.positive {
  color: #1dd1a1;
}

.tooltip-diff.negative {
  color: #ff6b6b;
}

.performance-indicators {
  margin-top: 1rem;
}

.indicator-title {
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
}

.indicators-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.25rem;
}

.indicator-item {
  text-align: center;
  padding: 0.5rem 0.25rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.indicator-item.exceeded {
  background-color: rgba(29, 209, 161, 0.1);
  border-color: #1dd1a1;
}

.indicator-item.close {
  background-color: rgba(255, 204, 0, 0.1);
  border-color: #ffcc00;
}

.indicator-item.missed {
  background-color: rgba(255, 107, 107, 0.1);
  border-color: #ff6b6b;
}

.indicator-month {
  font-size: 0.7rem;
  font-weight: bold;
  color: #666;
  margin-bottom: 0.25rem;
}

.indicator-icon {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.indicator-item.exceeded .indicator-icon {
  color: #1dd1a1;
}

.indicator-item.close .indicator-icon {
  color: #ffcc00;
}

.indicator-item.missed .indicator-icon {
  color: #ff6b6b;
}

.indicator-percentage {
  font-size: 0.7rem;
  font-weight: 600;
}

.indicator-item.exceeded .indicator-percentage {
  color: #1dd1a1;
}

.indicator-item.close .indicator-percentage {
  color: #ffcc00;
}

.indicator-item.missed .indicator-percentage {
  color: #ff6b6b;
}

@media (max-width: 768px) {
  ion-card-content {
    height: 350px;
  }
  
  .summary-stats {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .stat-value {
    font-size: 1rem;
  }
  
  .chart-container {
    height: 120px;
  }
  
  .indicators-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
}
</style>
