<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Eficiencia Operacional</ion-card-title>
      <ion-card-subtitle>Métricas en tiempo real</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div class="efficiency-container">
        <div class="metrics-grid">
          <div class="metric-item" v-for="metric in metrics" :key="metric.name">
            <div class="metric-circle" :style="{ background: getCircleGradient(metric.value) }">
              <div class="metric-value">{{ metric.value }}%</div>
            </div>
            <div class="metric-label">{{ metric.name }}</div>
          </div>
        </div>
        
        <div class="efficiency-summary">
          <div class="overall-score">
            <div class="score-value">{{ overallScore }}%</div>
            <div class="score-label">Eficiencia General</div>
          </div>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';

const metrics = ref([
  { name: 'Puntualidad', value: 87 },
  { name: 'Ocupación', value: 92 },
  { name: 'Satisfacción', value: 84 },
  { name: 'Eficiencia Combustible', value: 78 }
]);

const overallScore = computed(() => {
  const average = metrics.value.reduce((sum, metric) => sum + metric.value, 0) / metrics.value.length;
  return Math.round(average);
});

let updateInterval = null;

// Función para actualizar métricas en tiempo real
const updateMetrics = () => {
  metrics.value = metrics.value.map(metric => ({
    ...metric,
    value: Math.max(70, Math.min(95, metric.value + (Math.random() * 6 - 3)))
  }));
};

// Función para obtener el gradiente del círculo según el valor
const getCircleGradient = (value) => {
  if (value >= 90) {
    return 'conic-gradient(from 0deg, #10ac84 0%, #10ac84 ' + (value * 3.6) + 'deg, #e0e0e0 ' + (value * 3.6) + 'deg)';
  } else if (value >= 75) {
    return 'conic-gradient(from 0deg, #ffcc00 0%, #ffcc00 ' + (value * 3.6) + 'deg, #e0e0e0 ' + (value * 3.6) + 'deg)';
  } else {
    return 'conic-gradient(from 0deg, #ff6b6b 0%, #ff6b6b ' + (value * 3.6) + 'deg, #e0e0e0 ' + (value * 3.6) + 'deg)';
  }
};

onMounted(() => {
  // Actualizar métricas cada 3 segundos
  updateInterval = setInterval(updateMetrics, 3000);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
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

.efficiency-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.metric-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  position: relative;
  transition: all 0.3s ease;
}

.metric-circle::before {
  content: '';
  position: absolute;
  inset: 4px;
  background: white;
  border-radius: 50%;
}

.metric-value {
  position: relative;
  z-index: 1;
  font-weight: bold;
  font-size: 0.9rem;
  color: #333;
}

.metric-label {
  font-size: 0.75rem;
  color: #666;
  text-align: center;
  line-height: 1.2;
}

.efficiency-summary {
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
  border: 2px solid #ffcc00;
}

.score-value {
  font-size: 2rem;
  font-weight: bold;
  color: #ffcc00;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.score-label {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  
  .metric-circle {
    width: 50px;
    height: 50px;
  }
  
  .metric-value {
    font-size: 0.8rem;
  }
  
  .metric-label {
    font-size: 0.7rem;
  }
  
  .score-value {
    font-size: 1.5rem;
  }
}
</style>
