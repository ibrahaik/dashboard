<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Bugs por Sprint</ion-card-title>
      <ion-card-subtitle>Gestión de calidad por sprint | Unidad: Número de bugs</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div class="bugs-summary">
        <div class="summary-stats">
          <div class="stat-item success">
            <div class="stat-value">{{ totalResolved }}</div>
            <div class="stat-label">Resueltos</div>
          </div>
          <div class="stat-item danger">
            <div class="stat-value">{{ totalOpened }}</div>
            <div class="stat-label">Abiertos</div>
          </div>
          <div class="stat-item info">
            <div class="stat-value">{{ resolutionRate }}%</div>
            <div class="stat-label">Tasa Resolución</div>
          </div>
        </div>
      </div>
      <div id="bugs-chart"></div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';
import ApexCharts from 'apexcharts';

// Datos de bugs por sprint
const bugsData = {
  categories: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Sprint 6'],
  opened: [23, 18, 31, 15, 22, 19],
  resolved: [19, 25, 28, 20, 26, 24]
};

// Computed properties para estadísticas
const totalOpened = computed(() => bugsData.opened.reduce((sum, val) => sum + val, 0));
const totalResolved = computed(() => bugsData.resolved.reduce((sum, val) => sum + val, 0));
const resolutionRate = computed(() => Math.round((totalResolved.value / (totalOpened.value + totalResolved.value)) * 100));

let chart = null;

onMounted(() => {
  // Cambiar a gráfico radial/circular
  const options = {
    series: bugsData.categories.map((sprint, index) => {
      const total = bugsData.opened[index] + bugsData.resolved[index];
      const resolvedPercentage = Math.round((bugsData.resolved[index] / total) * 100);
      return resolvedPercentage;
    }),
    chart: {
      type: 'radialBar',
      height: 300,
      toolbar: {
        show: false
      },
      fontFamily: 'inherit'
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '30%',
          background: 'transparent',
          image: undefined,
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '11px',
            fontWeight: 'bold',
            color: '#666',
            offsetY: -10
          },
          value: {
            show: true,
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            offsetY: 5,
            formatter: function(val) {
              return val + '%';
            }
          }
        },
        track: {
          background: '#f2f2f2',
          strokeWidth: '97%',
          margin: 5,
        }
      }
    },
    colors: ['#1dd1a1', '#ffcc00', '#54a0ff', '#ff6b6b', '#feca57', '#ff9ff3'],
    labels: bugsData.categories,
    legend: {
      show: true,
      floating: true,
      fontSize: '11px',
      position: 'left',
      offsetX: 10,
      offsetY: 15,
      labels: {
        useSeriesColors: true,
      },
      markers: {
        size: 0
      },
      formatter: function(seriesName, opts) {
        const index = opts.seriesIndex;
        const resolved = bugsData.resolved[index];
        const opened = bugsData.opened[index];
        return seriesName + ": " + resolved + "/" + (resolved + opened);
      },
      itemMargin: {
        vertical: 3
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          show: false
        }
      }
    }],
    tooltip: {
      enabled: true,
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        const sprintIndex = seriesIndex;
        const resolved = bugsData.resolved[sprintIndex];
        const opened = bugsData.opened[sprintIndex];
        const total = resolved + opened;
        const percentage = series[seriesIndex];
        
        return `
          <div style="padding: 10px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="font-weight: bold; margin-bottom: 5px; color: #333;">
              ${bugsData.categories[sprintIndex]}
            </div>
            <div style="color: #1dd1a1; margin-bottom: 3px;">
              Resueltos: ${resolved}
            </div>
            <div style="color: #ff6b6b; margin-bottom: 3px;">
              Abiertos: ${opened}
            </div>
            <div style="color: #666; font-size: 12px;">
              Total: ${total} | Tasa: ${percentage}%
            </div>
          </div>
        `;
      }
    }
  };

  chart = new ApexCharts(document.querySelector("#bugs-chart"), options);
  chart.render();
});

onUnmounted(() => {
  if (chart) {
    chart.destroy();
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
  position: relative;
}

.bugs-summary {
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
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.stat-item.success .stat-value {
  color: #1dd1a1;
}

.stat-item.danger .stat-value {
  color: #ff6b6b;
}

.stat-item.info .stat-value {
  color: #54a0ff;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
}

#bugs-chart {
  width: 100%;
  height: 220px;
}

@media (max-width: 768px) {
  .summary-stats {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .stat-value {
    font-size: 1rem;
  }
  
  #bugs-chart {
    height: 200px;
  }
}
</style>
