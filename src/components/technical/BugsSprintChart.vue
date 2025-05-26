<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Bugs por Sprint</ion-card-title>
      <ion-card-subtitle>Bugs abiertos vs resueltos | Unidad: Número de bugs</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div id="bugs-chart"></div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';
import ApexCharts from 'apexcharts';

// Datos de bugs por sprint
const bugsData = {
  categories: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Sprint 6'],
  opened: [23, 18, 31, 15, 22, 19],
  resolved: [19, 25, 28, 20, 26, 24]
};

let chart = null;

onMounted(() => {
  const options = {
    series: [
      {
        name: 'Bugs Abiertos',
        data: bugsData.opened
      },
      {
        name: 'Bugs Resueltos',
        data: bugsData.resolved
      }
    ],
    chart: {
      type: 'bar',
      height: 300,
      stacked: true,
      toolbar: {
        show: false
      },
      fontFamily: 'inherit'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      }
    },
    colors: ['#ff6b6b', '#1dd1a1'],
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'],
        fontWeight: 'bold'
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: bugsData.categories,
      title: {
        text: 'Sprint',
        style: {
          color: '#666',
          fontWeight: 'bold'
        }
      },
      labels: {
        style: {
          colors: '#666'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Número de Bugs',
        style: {
          color: '#666',
          fontWeight: 'bold'
        }
      },
      labels: {
        style: {
          colors: '#666'
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + ' bugs';
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center'
    },
    grid: {
      borderColor: 'rgba(200, 200, 200, 0.2)'
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
}

#bugs-chart {
  width: 100%;
  height: 100%;
}
</style>
