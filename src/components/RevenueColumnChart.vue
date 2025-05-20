<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Ingresos Mensuales por País</ion-card-title>
      <ion-card-subtitle>Comparativa del último trimestre</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div id="revenue-chart"></div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';
import ApexCharts from 'apexcharts';

// Datos simulados de ingresos por país
const revenueData = [
  {
    name: 'España',
    data: [1420000, 1650000, 1830000]
  },
  {
    name: 'Francia',
    data: [980000, 1120000, 1250000]
  },
  {
    name: 'Italia',
    data: [850000, 920000, 1050000]
  },
  {
    name: 'Alemania',
    data: [750000, 820000, 950000]
  },
  {
    name: 'Reino Unido',
    data: [1100000, 1250000, 1380000]
  }
];

let chart = null;

onMounted(() => {
  const options = {
    series: revenueData,
    chart: {
      type: 'bar',
      height: 300,
      stacked: false,
      toolbar: {
        show: false
      },
      fontFamily: 'inherit',
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        dataLabels: {
          position: 'top'
        }
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Abril', 'Mayo', 'Junio'],
      title: {
        text: 'Mes',
        style: {
          color: '#666'
        }
      },
      labels: {
        style: {
          colors: '#666'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      title: {
        text: 'Ingresos (€)',
        style: {
          color: '#666'
        }
      },
      labels: {
        formatter: function (value) {
          return (value / 1000000).toFixed(1) + 'M €';
        },
        style: {
          colors: '#666'
        }
      }
    },
    grid: {
      borderColor: 'rgba(200, 200, 200, 0.2)',
      row: {
        colors: ['transparent', 'transparent']
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toLocaleString('es-ES') + ' €';
        }
      },
      theme: 'light',
      style: {
        fontSize: '12px'
      }
    },
    colors: ['#ffcc00', '#999999', '#666666', '#333333', '#cccccc'],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '12px',
      markers: {
        radius: 12
      },
      itemMargin: {
        horizontal: 8,
        vertical: 0
      }
    }
  };

  chart = new ApexCharts(document.querySelector("#revenue-chart"), options);
  chart.render();
  
  // Manejar cambios de tamaño
  window.addEventListener('resize', () => {
    chart.updateOptions({
      chart: {
        height: document.querySelector("#revenue-chart").offsetHeight
      }
    });
  });
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

#revenue-chart {
  width: 100%;
  height: 100%;
}
</style>
